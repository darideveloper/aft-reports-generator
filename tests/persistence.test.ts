import { test, expect } from '@playwright/test';
import { SurveyPage } from './survey';

// Get test credentials from environment
const guestCode = process.env.TESTING_GUEST_CODE || '';
const validEmail = process.env.TESTING_VALID_EMAIL || '';

test.describe('Persistence Features', () => {
    let testEmail = '';

    test.beforeEach(async ({ page }) => {
        // Generate unique email for each test to ensure clean state
        testEmail = `persistence_test_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
    });

    test('resume_progress_happy_path', async ({ page }) => {
        const survey = new SurveyPage(page);

        // 1. Setup: Start and make some progress
        await survey.goto();
        await survey.surveyInfoScreen();
        await survey.guestCodeScreen(guestCode);
        await survey.generalDataScreen(testEmail);

        // Monitor for save request initiated by completing the screen
        const saveResponsePromise = page.waitForResponse(resp => resp.url().includes('/progress/') && resp.request().method() === 'POST');

        // Complete TEMA 1 (This clicks Next, which triggers save)
        await survey.questionScreen('TEMA 1 - Antecedentes tecnológicos');

        // Wait for save to complete
        const saveResponse = await saveResponsePromise;
        if (!saveResponse.ok()) {
            console.log('Save Progress Failed:', await saveResponse.text());
        }
        expect(saveResponse.ok()).toBeTruthy();

        await survey.verifyCurrentScreen('TEMA 2 -  Evolución de la tecnología');

        // 2. Action: Drop off (Reload)
        await survey.goto();

        // 3. Return: Navigate back
        await survey.surveyInfoScreen();
        await survey.guestCodeScreen(guestCode);

        // Manually fill General Data to trigger validation
        await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible();
        await page.fill('input[id="name"]', 'Test User Resuring');
        await page.selectOption('select[id="gender"]', 'Masculino');
        await page.selectOption('select[id="birthRange"]', '1946-1964');
        await page.selectOption('select[id="position"]', 'Director');

        await page.fill('input[id="email"]', testEmail);
        // Click Validar
        await page.click('button:has-text("Validar")');

        // 4. Verification: Prompt appears and Accept
        await survey.handleResumePrompt(true);

        // Should jump to TEMA 2 immediately
        await survey.verifyCurrentScreen('TEMA 2 -  Evolución de la tecnología');
    });

    test('sanitization_of_double_quoted_data', async ({ page }) => {
        const survey = new SurveyPage(page);

        // Mock response with double-quoted strings (simulating the bug)
        await page.route('**/progress/?email=**', async route => {
            const json = {
                current_screen: 3, // Start at TEMA 1
                email: testEmail,
                survey_id: 1,
                data: {
                    emailResponse: {
                        email: testEmail,
                        name: "\"John Doe\"", // Double quoted
                        gender: "\"m\"",
                        birthRange: "\"1981-1996\"",
                        position: "\"director_general\"",
                    },
                    responses: [],
                    guestCodeResponse: { guestCode: guestCode }
                }
            };
            await route.fulfill({ json });
        });

        // 1. Setup: Start
        await survey.goto();
        await survey.surveyInfoScreen();
        await survey.guestCodeScreen(guestCode);

        // 2. Action: Validate email to trigger fetchProgress
        await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible();
        await page.fill('input[id="email"]', testEmail);
        await page.click('button:has-text("Validar")');

        // 3. Verification: Resume Prompt
        await survey.handleResumePrompt(true);

        // 4. Verify we are at TEMA 1 (Screen 3)
        // Note: verifyCurrentScreen looks for header text.
        // Assuming TEMA 1 header is 'TEMA 1 - Antecedentes tecnológicos'
        await expect(page.getByText('TEMA 1 - Antecedentes tecnológicos', { exact: false })).toBeVisible();

        // 5. Go back to General Data to check values
        await page.click('button:has-text("Anterior")');
        await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible();

        // 6. Verify inputs are CLEAN (no quotes)
        await expect(page.locator('input[id="name"]')).toHaveValue('John Doe');

        // For dropdowns, we check the value or the displayed text. 
        // Value logic depends on how dropdown is implemented. 
        // Assuming standard select or controlled component where value prop matches.
        // The Dropdown component likely uses a hidden input or just state.
        // Let's check internal form state via UI if possible, or visually.
        // The test helper selectOption uses select[id=...]. 
        // Let's assume standard behavior:
        await expect(page.locator('select[id="gender"]')).toHaveValue('m');
        await expect(page.locator('select[id="position"]')).toHaveValue('director_general');
    });

    test('discard_saved_progress', async ({ page }) => {
        const survey = new SurveyPage(page);

        // 1. Setup: Start and make some progress
        await survey.goto();
        await survey.surveyInfoScreen();
        await survey.guestCodeScreen(guestCode);
        await survey.generalDataScreen(testEmail);

        // Monitor for save request
        const saveResponsePromise = page.waitForResponse(resp => resp.url().includes('/progress/') && resp.request().method() === 'POST');

        // Complete TEMA 1
        await survey.questionScreen('TEMA 1 - Antecedentes tecnológicos');

        // Wait for save
        const saveResponse = await saveResponsePromise;
        if (!saveResponse.ok()) {
            console.log('Save Progress Failed:', await saveResponse.text());
        }
        expect(saveResponse.ok()).toBeTruthy();

        await survey.verifyCurrentScreen('TEMA 2 -  Evolución de la tecnología');

        // 2. Action: Drop off (Reload)
        await survey.goto();

        // 3. Return
        await survey.surveyInfoScreen();
        await survey.guestCodeScreen(guestCode);

        // Manually fill General Data
        await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible();
        await page.fill('input[id="name"]', 'Test User Discarding');
        await page.selectOption('select[id="gender"]', 'Masculino');
        await page.selectOption('select[id="birthRange"]', '1946-1964');
        await page.selectOption('select[id="position"]', 'Director');

        await page.fill('input[id="email"]', testEmail);
        await page.click('button:has-text("Validar")');

        // 4. Verification: Prompt appears and Reject
        await survey.handleResumePrompt(false);

        // Should NOT jump. Stay on General Data.
        await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible();

        // Click Continuar to start fresh
        await page.click('button:has-text("Continuar")');

        // Should be at TEMA 1 (Fresh start)
        await survey.verifyCurrentScreen('TEMA 1 - Antecedentes tecnológicos');
    });

    test('cleanup_on_completion', async ({ page }) => {
        const survey = new SurveyPage(page);
        test.setTimeout(300000); // Extended timeout for full survey run

        // 1. Setup: Complete the entire survey
        await survey.goto();
        await survey.surveyInfoScreen();
        await survey.guestCodeScreen(guestCode);
        await survey.generalDataScreen(testEmail);

        // Monitor for cleanup (DELETE) request
        const cleanupResponsePromise = page.waitForResponse(resp => resp.url().includes('/progress/') && resp.request().method() === 'DELETE');

        // Answer randomly all questions screens
        await survey.questionScreen('TEMA 1 - Antecedentes tecnológicos');
        await survey.questionScreen('TEMA 2 -  Evolución de la tecnología');
        await survey.questionScreen('TEMA 3 -  Internet y conectividad');
        await survey.questionScreen('TEMA 4 - Dispositivos digitales');
        await survey.questionScreen('TEMA 5 - Ciberseguridad');
        await survey.questionScreen('TEMA 6 - Huella digital');
        await survey.questionScreen('TEMA 7 - Uso de la tecnología');
        await survey.questionScreen('TEMA 8 - Herramientas de colaboración');
        await survey.questionScreen('TEMA 9 - Tecnologías emergentes');
        await survey.questionScreen('TEMA 10 - Tecnologías de asistencia');
        await survey.questionScreen('TEMA 11 - Rol del líder y la tecnología');
        await survey.questionScreenGrid('TEMA 12 - Tecnología y medio ambiente');
        await survey.questionScreen('TEMA 13 - Etiqueta digital', true); // true = last screen

        // Validate confirmation screen
        await survey.confirmationScreen();

        // 2. Verification: Cleanup API called and succeeded
        const cleanupResponse = await cleanupResponsePromise;
        expect(cleanupResponse.ok()).toBeTruthy();

        // 3. Fill form again (first screen)
        await survey.goto();
        await survey.surveyInfoScreen();
        await survey.guestCodeScreen(guestCode);

        // 4. Verification: Should not show prompt and email should be invalid
        await survey.generalDataScreen(testEmail, true);
    });

});



test.describe('Email Persistence Bug', () => {
    test.beforeEach(async ({ page }) => {
        // Delete any existing participant to start fresh
        const survey = new SurveyPage(page);
        await survey.dashboardDeleteParticipant(validEmail);
        await survey.dashboardDeleteProgress(validEmail);
    });

    test('Email should persist when filling other fields', async ({ page }) => {
        const surveyPage = new SurveyPage(page);

        // Navigate to survey
        await surveyPage.goto();
        await surveyPage.surveyInfoScreen();
        await surveyPage.guestCodeScreen(guestCode);

        // Wait for General Data screen to load
        await expect(
            page.locator('h2:has-text("Datos Generales")')
        ).toBeVisible({ timeout: 5000 });

        const emailInput = page.locator('input[id="email"]');
        const nameInput = page.locator('input[id="name"]');
        const genderSelect = page.locator('select[id="gender"]');
        const birthRangeSelect = page.locator('select[id="birthRange"]');
        const positionSelect = page.locator('select[id="position"]');

        // Step 1: Fill email first
        await emailInput.fill(validEmail);
        const emailAfterFill = await emailInput.inputValue();
        expect(emailAfterFill).toBe(validEmail);

        // Step 2: Fill name (this used to cause email to be overwritten)
        await nameInput.fill('Test User For Bug');
        const emailAfterName = await emailInput.inputValue();
        expect(emailAfterName).toBe(validEmail);
        console.log(`Email after name fill: ${emailAfterName}`);

        // Step 3: Select gender (this could also cause issues)
        await genderSelect.selectOption('Masculino');
        const emailAfterGender = await emailInput.inputValue();
        expect(emailAfterGender).toBe(validEmail);
        console.log(`Email after gender select: ${emailAfterGender}`);

        // Step 4: Select birth range
        await birthRangeSelect.selectOption('1946-1964');
        const emailAfterBirth = await emailInput.inputValue();
        expect(emailAfterBirth).toBe(validEmail);
        console.log(`Email after birth range select: ${emailAfterBirth}`);

        // Step 5: Select position
        await positionSelect.selectOption('Director');
        const emailAfterPosition = await emailInput.inputValue();
        expect(emailAfterPosition).toBe(validEmail);
        console.log(`Email after position select: ${emailAfterPosition}`);

        // Step 6: Validate email (triggers API call)
        const validateButton = page.locator('button:has-text("Validar")');
        await validateButton.click();

        // Wait for validation to complete
        await expect(validateButton).toBeVisible({ timeout: 5000 });

        // Final check - email should persist after validation
        const finalEmailValue = await emailInput.inputValue();
        expect(finalEmailValue).toBe(validEmail);
        console.log(`Email after validation: ${finalEmailValue}`);
    });
});

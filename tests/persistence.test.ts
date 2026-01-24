import { test, expect } from '@playwright/test';
import { SurveyPage } from './survey';

const guestCode = process.env.TESTING_GUEST_CODE || '123456';

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
        test.setTimeout(120000); // Extended timeout for full survey run

        // 1. Setup: Complete the entire survey
        await survey.goto();
        await survey.surveyInfoScreen();
        await survey.guestCodeScreen(guestCode);
        await survey.generalDataScreen(testEmail);

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

        // 2. Action: Return to survey
        await survey.goto();
        await survey.surveyInfoScreen();
        await survey.guestCodeScreen(guestCode);

        // Manually fill General Data
        await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible();
        await page.fill('input[id="name"]', 'Test User Cleanup');
        await page.selectOption('select[id="gender"]', 'Masculino');
        await page.selectOption('select[id="birthRange"]', '1946-1964');
        await page.selectOption('select[id="position"]', 'Director');

        await page.fill('input[id="email"]', testEmail);
        await page.click('button:has-text("Validar")');

        // 3. Verification: NO Prompt should appear
        await expect(page.locator('.swal2-container')).not.toBeVisible({ timeout: 3000 });

        // Should be at TEMA 1
        await page.click('button:has-text("Continuar")');
        await survey.verifyCurrentScreen('TEMA 1 - Antecedentes tecnológicos');
    });

});

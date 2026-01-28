import { expect, test } from '@playwright/test';
import { SurveyPage } from './survey';

// Get guest code from .env variables
const guestCode = process.env.TESTING_GUEST_CODE || '';
const invalidEmail = process.env.TESTING_INVALID_EMAIL || '';
const validEmail = process.env.TESTING_VALID_EMAIL || '';


console.warn(`Before run tests, be sure that these emails are in the database:
  - ${invalidEmail} (invalid)
  - ${validEmail} (valid)
`)

// valid invalid guest code and expect error
test('invalid_guest_code', async ({ page }) => {
  const survey = new SurveyPage(page);
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen('123456', true); // true = expect error
});

// Validate guest code and expect success
test('valid_guest_code', async ({ page }) => {
  const survey = new SurveyPage(page);
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
});

// Validate email no registered and expect success
test('valid_email', async ({ page }) => {

  // Delete from prod dashboard test user
  const survey = new SurveyPage(page);
  await survey.dashboardDeleteParticipant(validEmail);
  await survey.dashboardDeleteProgress(validEmail);

  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
  await survey.generalDataScreen(validEmail);
});

// Validate email already exists and expect error
test('invalid_email_already_exists', async ({ page }) => {
  const survey = new SurveyPage(page);
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
  await survey.generalDataScreen(invalidEmail, true);
});

// Email validation feedback tests
test('email_validation_message_hidden_before_validate', async ({ page }) => {
  const survey = new SurveyPage(page);

  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);

  // Wait for General Data screen
  await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible({ timeout: 3000 });

  // Fill fields but don't click Validar
  await page.fill('input[id="name"]', 'Test User');
  await page.fill('input[id="email"]', validEmail);

  // Assert: No validation messages should be visible
  await expect(page.locator('p:has-text("✅ Email válido")')).not.toBeVisible();
  await expect(page.locator('p.text-destructive:has-text("El email no es válido")')).not.toBeVisible();
});

test('email_validation_message_shown_after_validate', async ({ page }) => {
  const survey = new SurveyPage(page);

  // Clean up first
  await survey.dashboardDeleteParticipant(validEmail);
  await survey.dashboardDeleteProgress(validEmail);

  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);

  // Wait for General Data screen
  await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible({ timeout: 3000 });

  // Fill fields
  await page.fill('input[id="name"]', 'Test User');
  await page.selectOption('select[id="gender"]', 'Masculino');
  await page.selectOption('select[id="birthRange"]', '1946-1964');
  await page.selectOption('select[id="position"]', 'Director');
  await page.fill('input[id="email"]', validEmail);

  // Click Validar
  await page.click('button:has-text("Validar")');

  // Wait for validation to complete
  await expect(page.locator('button:has-text("Validar")')).toBeVisible({ timeout: 5000 });

  // Assert: Success message should be visible
  await expect(page.locator('p:has-text("✅ Email válido")')).toBeVisible({ timeout: 2000 });
});

test('email_validation_message_hides_on_email_change', async ({ page }) => {
  const survey = new SurveyPage(page);

  // Clean up first
  await survey.dashboardDeleteParticipant(validEmail);
  await survey.dashboardDeleteProgress(validEmail);

  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);

  // Wait for General Data screen
  await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible({ timeout: 3000 });

  // Fill fields
  await page.fill('input[id="name"]', 'Test User');
  await page.selectOption('select[id="gender"]', 'Masculino');
  await page.selectOption('select[id="birthRange"]', '1946-1964');
  await page.selectOption('select[id="position"]', 'Director');
  await page.fill('input[id="email"]', validEmail);

  // Click Validar and wait
  await page.click('button:has-text("Validar")');
  await expect(page.locator('p:has-text("✅ Email válido")')).toBeVisible({ timeout: 5000 });

  // Modify email
  await page.fill('input[id="email"]', 'modified@example.com');

  // Assert: Success message should disappear
  await expect(page.locator('p:has-text("✅ Email válido")')).not.toBeVisible();
});

test('email_error_message_only_after_validate', async ({ page }) => {
  const survey = new SurveyPage(page);

  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);

  // Wait for General Data screen
  await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible({ timeout: 3000 });

  // Fill fields with invalid email
  await page.fill('input[id="name"]', 'Test User');
  await page.fill('input[id="email"]', invalidEmail);

  // Assert: No error message before validation
  await expect(page.locator('p.text-destructive:has-text("El email no es válido")')).not.toBeVisible();

  // Click Validar
  await page.click('button:has-text("Validar")');

  // Wait for validation to complete
  await expect(page.locator('button:has-text("Validar")')).toBeVisible({ timeout: 5000 });

  // Assert: Error message should now be visible
  await expect(page.locator('p.text-destructive:has-text("El email no es válido")')).toBeVisible({ timeout: 2000 });
});

test('repeted_options_grid', async ({ page }) => {

  // Delete from prod dashboard test user
  const survey = new SurveyPage(page);
  await survey.dashboardDeleteParticipant(validEmail);
  await survey.dashboardDeleteProgress(validEmail);

  // Basic setup
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
  await survey.generalDataScreen(validEmail);

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
  await survey.questionScreenGrid('TEMA 12 - Tecnología y medio ambiente', false, true, false) // false = not last screen, true = unique response, false = not unique responses 
});

test('correct_answers_confirmation_screen', async ({ page }) => {

  // Delete from prod dashboard test user
  const survey = new SurveyPage(page);
  await survey.dashboardDeleteParticipant(validEmail);
  await survey.dashboardDeleteProgress(validEmail);

  // Basic setup
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
  await survey.generalDataScreen(validEmail);

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
  await survey.confirmationScreen()
});

test('submit_form', async ({ page }) => {

  // Delete from prod dashboard test user
  const survey = new SurveyPage(page);
  await survey.dashboardDeleteParticipant(validEmail);
  await survey.dashboardDeleteProgress(validEmail);

  // Basic setup
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
  await survey.generalDataScreen(validEmail);

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
  await survey.questionScreenGrid('TEMA 12 - Tecnología y medio ambiente')
  await survey.questionScreen('TEMA 13 - Etiqueta digital', true); // true = last screen

  // Validate confirmation screen
  await survey.confirmationScreen()

  // Validate user created in dashboard
  const { count: userCount } = await survey.dashboardSearchUser(validEmail, false) // false = not login
  expect(userCount).toBe(1)
});
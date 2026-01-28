// Validate dynamic points in tema 3

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

test('10_of_12_correct_answers', async ({ page }) => {

  // Delete from prod dashboard test user
  const survey = new SurveyPage(page);
  await survey.dashboardDeleteParticipant(validEmail);
  await survey.dashboardDeleteProgress(validEmail);

  // Basic setup
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
  await survey.generalDataScreen(validEmail);

  // Answer randomly first screens
  await survey.questionScreen('TEMA 1 - Antecedentes tecnológicos');
  await survey.questionScreen('TEMA 2 -  Evolución de la tecnología');

  // Answer randomly third screen with correct answers (10 of 12)
  await survey.questionScreen('TEMA 3 -  Internet y conectividad', false, false, [
    "World Wide Web (WWW)",
    "Internet",
    "Internet",
    "World Wide Web (WWW)",
    "Internet",
    "World Wide Web (WWW)",
    "Internet",
    "World Wide Web (WWW)",
    "World Wide Web (WWW)",
    "Internet",
    "Word Wide Web (WWW), Internet"
  ]);

  // Answer randomly last screens
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

  // Validate score in tema 3 (index 4)
  const totalQuestionGroup = await survey.dashboardSearchTotalQuestionGroup(validEmail, 4, false) // false = not login
  expect(totalQuestionGroup).toBe(83.33)
})

test('11_of_12_correct_answers', async ({ page }) => {

  // Delete from prod dashboard test user
  const survey = new SurveyPage(page);
  await survey.dashboardDeleteParticipant(validEmail);
  await survey.dashboardDeleteProgress(validEmail);

  // Basic setup
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
  await survey.generalDataScreen(validEmail);

  // Answer randomly first screens
  await survey.questionScreen('TEMA 1 - Antecedentes tecnológicos');
  await survey.questionScreen('TEMA 2 -  Evolución de la tecnología');

  // Answer randomly third screen with correct answers (10 of 12)
  await survey.questionScreen('TEMA 3 -  Internet y conectividad', false, false, [
    "World Wide Web (WWW)",
    "Internet",
    "Internet",
    "World Wide Web (WWW)",
    "Internet",
    "World Wide Web (WWW)",
    "Internet",
    "World Wide Web (WWW)",
    "World Wide Web (WWW)",
    "Internet",
    "Internet, Internet"
  ]);

  // Answer randomly last screens
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

  // Validate score in tema 3 (index 4)
  const totalQuestionGroup = await survey.dashboardSearchTotalQuestionGroup(validEmail, 4, false) // false = not login
  expect(totalQuestionGroup).toBe(91.66)
})

test('12_of_12_correct_answers', async ({ page }) => {

  // Delete from prod dashboard test user
  const survey = new SurveyPage(page);
  await survey.dashboardDeleteParticipant(validEmail);
  await survey.dashboardDeleteProgress(validEmail);

  // Basic setup
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
  await survey.generalDataScreen(validEmail);

  // Answer randomly first screens
  await survey.questionScreen('TEMA 1 - Antecedentes tecnológicos');
  await survey.questionScreen('TEMA 2 -  Evolución de la tecnología');

  // Answer randomly third screen with correct answers (10 of 12)
  await survey.questionScreen('TEMA 3 -  Internet y conectividad', false, false, [
    "World Wide Web (WWW)",
    "Internet",
    "Internet",
    "World Wide Web (WWW)",
    "Internet",
    "World Wide Web (WWW)",
    "Internet",
    "World Wide Web (WWW)",
    "World Wide Web (WWW)",
    "Internet",
    "Internet, Word Wide Web (WWW)"
  ]);

  // Answer randomly last screens
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

  // Validate score in tema 3 (index 4)
  const totalQuestionGroup = await survey.dashboardSearchTotalQuestionGroup(validEmail, 4, false) // false = not login
  expect(totalQuestionGroup).toBe(100)
})
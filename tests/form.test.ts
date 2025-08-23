import { test } from '@playwright/test';
import { SurveyPage } from './survey';

// Get guest code from .env variables
const guestCode = process.env.TESTING_GUEST_CODE || '';
const invalidEmail = process.env.TESTING_INVALID_EMAIL || '';
const validEmail = process.env.TESTING_VALID_EMAIL || '';

console.warn(`Before run tests, be sure that these emails are in the database:
  - ${invalidEmail} (invalid)
  - ${validEmail} (valid)
`)


test('invalid_guest_code', async ({ page }) => {
  const survey = new SurveyPage(page);
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen('123456', true); // true = expect error
});

test('valid_guest_code', async ({ page }) => {
  const survey = new SurveyPage(page);
  await survey.goto();
  await survey.surveyInfoScreen();
  await survey.guestCodeScreen(guestCode);
});

// test('valid_email', async ({ page }) => {
//   const survey = new SurveyPage(page);
//   await survey.goto();
//   await survey.surveyInfoScreen();
//   await survey.guestCodeScreen(guestCode);
//   await survey.generalDataScreen();
// });

// test('fill full form', async ({ page }) => {
//   const survey = new SurveyPage(page);
//   await survey.goto();
//   await survey.surveyInfoScreen();
//   await survey.guestCodeScreen('123456');       // no error
//   await survey.generalDataScreen();
//   await survey.questionScreen();
//   await survey.completionScreen();
// });

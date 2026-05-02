import { expect, test } from '@playwright/test';

test('dynamic_options_loading', async ({ page }) => {
  // Mock the survey endpoint
  await page.route('**/api/surveys/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        name: 'Test Survey',
        instructions: 'Test Instructions',
        question_groups: []
      }),
    });
  });

  // Mock invitation code
  await page.route('**/api/invitation-code/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });

  // Mock progress
  await page.route('**/api/progress/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  // Mock the options endpoint
  await page.route('**/api/options/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: [{ value: 'pending', label: '⏳ Pendiente' }],
        gender: [
          { value: 'm', label: 'Masculino' },
          { value: 'f', label: 'Femenino' },
          { value: 'custom_gender', label: 'Custom Gender' }
        ],
        birth_range: [
          { value: '1900-1945', label: '1900-1945' }
        ],
        position: [
          { value: 'ceo', label: 'Chief Executive Officer' }
        ]
      }),
    });
  });

  await page.goto('/');
  await page.click('button:has-text("Comenzar Evaluación")');
  await page.fill('input[id="guestCode"]', 'valid-code');
  await page.click('button:has-text("Validar")');
  await page.click('button:has-text("Continuar")');

  // Verify General Data Screen
  await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible({ timeout: 5000 });

  // Verify dynamic options are present in the DOM
  const genderOption = page.locator('select[id="gender"] option[value="custom_gender"]');
  await expect(genderOption).toHaveCount(1);
  await expect(genderOption).toHaveText('Custom Gender');
  
  const birthRangeOption = page.locator('select[id="birthRange"] option[value="1900-1945"]');
  await expect(birthRangeOption).toHaveCount(1);
  await expect(birthRangeOption).toHaveText('1900-1945');
  
  const positionOption = page.locator('select[id="position"] option[value="ceo"]');
  await expect(positionOption).toHaveCount(1);
  await expect(positionOption).toHaveText('Chief Executive Officer');
});

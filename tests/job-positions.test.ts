import { test, expect } from '@playwright/test';
import { SurveyPage } from './survey';

test.describe('Job Positions', () => {
    test('vicepresidente_option_exists_and_can_be_selected', async ({ page }) => {
        const survey = new SurveyPage(page);

        // Mock survey info
        await page.route('**/surveys/1/', async route => {
            await route.fulfill({ json: { 
                id: 1, 
                name: 'Evaluación LeadForward Prueba empresa v1', 
                description: 'Test description', 
                instructions: 'Test instructions',
                question_groups: [] 
            } });
        });

        // Mock guest code validation
        await page.route('**/invitation-code/validate/', async route => {
            await route.fulfill({ json: { status: 'success', data: { id: 1, survey: 1, code: 'valid-code' } } });
        });

        // Navigate to General Data screen
        await survey.goto();
        
        // Handle Survey Info Screen
        await survey.surveyInfoScreen();
        
        const guestCode = 'valid-code';
        await survey.guestCodeScreen(guestCode);
        
        // Now on General Data screen
        await expect(page.locator('h2:has-text("Datos Generales")')).toBeVisible();
        
        const positionSelect = page.locator('select[id="position"]');
        await expect(positionSelect).toBeVisible();
        
        // Check if 'vicepresidente' option exists
        const option = positionSelect.locator('option[value="vicepresidente"]');
        await expect(option).toBeAttached();
        await expect(option).toHaveText('Vicepresidente');
        
        // Select it
        await positionSelect.selectOption('vicepresidente');
        await expect(positionSelect).toHaveValue('vicepresidente');
    });
});

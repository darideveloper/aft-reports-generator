import { Page, expect } from '@playwright/test';

export class SurveyPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async surveyInfoScreen() {
    // wait page loads
    await expect(this.page.locator('text=Evaluación LeadForward Prueba empresa v1'))
      .toBeVisible({ timeout: 1000 });

    // click button "Comenzar Evaluación"
    await this.page.click('button:has-text("Comenzar Evaluación")');
  }

  async guestCodeScreen(code: string, expectError = false) {
    // wait page loads
    await expect(this.page.locator('h2:has-text("Código de Invitado")'))
      .toBeVisible({ timeout: 1000 });

    // fill guest code
    await this.page.fill('input[id="guestCode"]', code);

    // Click in "Validar" button
    await this.page.click('button:has-text("Validar")');

    // validate error message
    if (expectError) {
      const error = this.page.locator('p.text-destructive');
      await expect(error).toBeVisible({ timeout: 1000 });
      await expect(error).toHaveText('El código de invitado no es válido');
    } else {
      await this.page.click('button:has-text("Continuar")');
    }
  }

  async generalDataScreen() {
    // Fill general data here
  }

  async questionScreen() {
    // Fill questions here
  }

  async completionScreen() {
    // Completion steps here
  }
}

import { ElementHandle, Page, expect } from '@playwright/test'

const dashboardPariticipantsUrl =
  process.env.TESTING_DASHBOARD_PARTICIPANTS_URL || ''
const dashboardUser = process.env.TESTING_DASHBOARD_USER || ''
const dashboardPassword = process.env.TESTING_DASHBOARD_PASSWORD || ''

export class SurveyPage {
  private selectedAnswers: Record<string, string> = {}

  constructor(private page: Page) {}

  async #waitClickButton(buttonSelector: string) {
    const button = this.page.locator(buttonSelector)
    await expect(button).toBeVisible({ timeout: 3000 })
    await button.click()
  }

  async goto() {
    await this.page.goto('/')
  }

  async surveyInfoScreen() {
    // wait page loads
    await expect(
      this.page.locator('text=Evaluación LeadForward Prueba empresa v1')
    ).toBeVisible({ timeout: 2000 })

    // click button "Comenzar Evaluación"
    await this.page.click('button:has-text("Comenzar Evaluación")')
  }

  async guestCodeScreen(code: string, expectError: boolean = false) {
    // wait page loads
    await expect(
      this.page.locator('h2:has-text("Código de Invitado")')
    ).toBeVisible({ timeout: 3000 })

    // fill guest code
    await this.page.fill('input[id="guestCode"]', code)

    // Click in "Validar" button
    await this.page.click('button:has-text("Validar")')

    // validate error message
    if (expectError) {
      const error = this.page.locator('p.text-destructive')
      await expect(error).toBeVisible({ timeout: 1000 })
      await expect(error).toHaveText('El código de invitado no es válido')
    } else {
      await this.page.click('button:has-text("Continuar")')
    }
  }

  async generalDataScreen(email: string, expectError: boolean = false) {
    // wait page loads
    await expect(
      this.page.locator('h2:has-text("Datos Generales")')
    ).toBeVisible({ timeout: 3000 })

    // Select gender
    await this.page.selectOption('select[id="gender"]', 'Masculino')

    // Select birth range
    await this.page.selectOption('select[id="birthRange"]', '1946-1964')

    // Select position
    await this.page.selectOption('select[id="position"]', 'Director')

    // fill email and validate
    await this.page.fill('input[id="email"]', email)
    await this.page.click('button:has-text("Validar")')

    // Wait until check button shows "validar" again
    await expect(this.page.locator('button:has-text("Validar")')).toBeVisible({
      timeout: 2000,
    })

    if (expectError) {
      // validate error message
      const error = this.page.locator(
        'p.text-destructive:has-text("El email no es válido")'
      )
      await expect(error).toBeVisible({ timeout: 1000 })

      // Validate next button is disabled
      const nextButton = this.page.locator('button:has-text("Continuar")')
      await expect(nextButton).toBeDisabled()
    } else {
      // Click next button
      await this.page.click('button:has-text("Continuar")')
    }
  }

  async #questionScreenValidateTitle(title: string) {
    await expect(this.page.locator(`h2:has-text("${title}")`)).toBeVisible({
      timeout: 3000,
    })
  }

  async #questionValidateNextButton(lastScreen: boolean, disableNext: boolean) {
    if (lastScreen) {
      await this.page.click('button:has-text("Enviar")')
    } else {
      const nextButton = this.page.locator('button:has-text("Siguiente")')
      if (disableNext) {
        await expect(nextButton).toBeDisabled()
      } else {
        await nextButton.click()
      }
    }
  }

  async #questionValidateH3(question: ElementHandle<Element>) {
    const questionTitleSelector = 'h3'
    const questionTitle = await question.$(questionTitleSelector)
    const questionTitleText = await questionTitle?.textContent()
    return questionTitleText
  }

  async questionScreen(title, lastScreen = false, disableNext = false) {
    // Validate title in screen
    await this.#questionScreenValidateTitle(title)

    // Loop questions
    const questionSelector = `.questions .question-container`
    const questions = await this.page.$$(questionSelector)
    for (const question of questions) {
      // Select random answer and save value
      const questionTitleText = await this.#questionValidateH3(question)

      // Select random answer and save value
      const optionsSelector = 'label input'
      const options = await question.$$(optionsSelector)

      // Get random option validating unique responses
      const randomOption = options[Math.floor(Math.random() * options.length)]
      const randomOptionValue =
        (await randomOption?.getAttribute('value')) || ''

      // Click option
      await randomOption?.click()
      this.selectedAnswers[questionTitleText || ''] = randomOptionValue
    }

    await this.#questionValidateNextButton(lastScreen, disableNext)
  }

  async questionScreenGrid(
    title: string,
    lastScreen: boolean = false,
    disableNext: boolean = false,
    uniqueResponses: boolean = true
  ) {
    // Validate title in screen
    await this.#questionScreenValidateTitle(title)

    // Loop questions
    const questionSelector = `.questions .question-container`
    const questions = await this.page.$$(questionSelector)
    for (const question of questions) {
      // Select random answer and save value
      const questionTitleText = await this.#questionValidateH3(question)

      // Select random answer and save value
      const optionsSelector = 'label input'
      const options = await question.$$(optionsSelector)

      // Get random option validating unique responses
      let randomOption: ElementHandle<Element> | null = null
      let randomOptionValue = ''
      if (uniqueResponses) {
        const selectedAnswersScreen: string[] = []

        // Get random response without repited responses
        while (true) {
          randomOption = options[Math.floor(Math.random() * options.length)]
          randomOptionValue = (await randomOption?.getAttribute('value')) || ''
          if (!selectedAnswersScreen.includes(randomOptionValue)) {
            break
          }
        }
      } else {
        // Get firs response
        randomOption = options[0]
        randomOptionValue = (await randomOption?.getAttribute('value')) || ''
      }

      await randomOption?.click()
      this.selectedAnswers[questionTitleText || ''] = randomOptionValue
    }

    // Validate error message "No se puede seleccionar la misma opción en más de una pregunta"
    const error = this.page.locator(
      'p.text-destructive:has-text("No se puede seleccionar la misma opción en más de una pregunta")'
    )
    await expect(error).toBeVisible({ timeout: 1000 })

    await this.#questionValidateNextButton(lastScreen, disableNext)
  }

  async deleteDashboardParticipant(email: string) {
    // Open dashboard
    await this.page.goto(dashboardPariticipantsUrl + `?q=${email}`)

    // Login
    await this.page.fill('input[name="username"]', dashboardUser)
    await this.page.fill('input[name="password"]', dashboardPassword)
    await this.page.click('button[type="submit"]')

    // Validage page h1 "Participantes"
    await expect(
      this.page.locator('h1:has-text("Participantes")')
    ).toBeVisible()

    // Validate if "valid-test" its in page, as link  (no error if not found)
    const links = await this.page.locator('.field-name a')

    if ((await links.count()) > 0) {
      // Open details page
      await links.first().click()

      // Wait and click delete button
      await this.#waitClickButton('a:has-text("Eliminar")')

      // Wait and click confirm button
      await this.#waitClickButton('input[value="Si, estoy seguro"]')
    }
  }
}

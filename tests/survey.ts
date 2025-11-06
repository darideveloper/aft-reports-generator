import { ElementHandle, Locator, Page, expect } from '@playwright/test'

const dashboardUrl = process.env.TESTING_DASHBOARD_URL || ''
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

  async generalDataScreen(email: string, expectError: boolean = false, name: string = 'test user',) {
    // wait page loads
    await expect(
      this.page.locator('h2:has-text("Datos Generales")')
    ).toBeVisible({ timeout: 3000 })

    // Fill name
    await this.page.fill('input[id="name"]', name)

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

  async questionScreen(
    title: string,
    lastScreen: boolean = false,
    disableNext: boolean = false,
    answers: string[] = []
  ) {
    // Validate title in screen
    await this.#questionScreenValidateTitle(title)

    // Loop questions
    const questionSelector = `.questions .question-container`
    const questions = await this.page.$$(questionSelector)
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      // Select random answer and save value
      const question = questions[questionIndex]
      const questionTitleText = await this.#questionValidateH3(question)

      // Select correct answers
      if (answers.length > 0) {
        const answerValue = answers[questionIndex]
        const questionAnswers = await questions[questionIndex].$$('label input')
        for (const answer of questionAnswers) {
          if (await answer.getAttribute('value') === answerValue) {
            await answer.click()
            break
          }
        }
        this.selectedAnswers[questionTitleText || ''] = answerValue
        continue
      } 

      // Select random answer if no answers are provided
      const optionsSelector = 'label input'
      const options = await question.$$(optionsSelector)

      const randomOption = options[Math.floor(Math.random() * options.length)]
      const randomOptionValue =
        (await randomOption?.getAttribute('value')) || ''

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
    const selectedAnswersScreen: string[] = []
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
      selectedAnswersScreen.push(randomOptionValue)
    }

    // Validate error message "No se puede seleccionar la misma opción en más de una pregunta"
    if (!uniqueResponses) {
      const error = this.page.locator(
        'p.text-destructive:has-text("No se puede seleccionar la misma opción en más de una pregunta")'
      )
      await expect(error).toBeVisible({ timeout: 1000 })
    }

    await this.#questionValidateNextButton(lastScreen, disableNext)
  }

  async #loginDashboard() {
    // Load dashboard page
    await this.page.goto(dashboardUrl)

    // Wait to load login page
    await expect(
      this.page.locator('p:has-text("Bienvenido a AFT Reports Generator")')
    ).toBeVisible({ timeout: 3000 })

    // Login with credentials
    await this.page.fill('input[name="username"]', dashboardUser)
    await this.page.fill('input[name="password"]', dashboardPassword)
    await this.page.click('button[type="submit"]')
  }

  async dashboardSearchTotalQuestionGroup(
    email: string,
    questionGroupIndex: number,
    login: boolean = true
  ): Promise<number> {
    // Login and search user
    if (login) {
      await this.#loginDashboard()
    }

    // Open participants page
    let searchUrl = `/admin/survey/reportquestiongrouptotal/`
    searchUrl += `?question_group__id__exact=${questionGroupIndex}&q=${email}`
    await this.page.goto(dashboardUrl + searchUrl)

    // Validage page h1 "Participantes"
    await expect(
      this.page.locator('h1:has-text("Totales de Grupos de Preguntas")')
    ).toBeVisible()

    // Get users found but not fields it no data
    const totalQuestionGroup = this.page.locator('.field-total')
    const totalQuestionGroupText = await totalQuestionGroup.textContent()
    return parseFloat(totalQuestionGroupText || '0')
  }

  async dashboardSearchUser(
    email: string,
    login: boolean = true
  ): Promise<{ count: number; usersLinks: Locator[] }> {
    // Login and search user
    if (login) {
      await this.#loginDashboard()
    }

    // Open participants page
    await this.page.goto(dashboardUrl + `/admin/survey/participant/?q=${email}`)

    // Validage page h1 "Participantes"
    await expect(
      this.page.locator('h1:has-text("Participantes")')
    ).toBeVisible()

    // Get users found but not fields it no data
    const users = this.page.locator('.field-name a')
    const count = await users
      .first()
      .waitFor({ timeout: 2000 })
      .then(() => users.count())
      .catch(() => 0)
    return {
      count: count,
      usersLinks: await users.all(),
    }
  }

  async dashboardDeleteParticipant(email: string) {
    // login and search user
    const { count: userCount, usersLinks } = await this.dashboardSearchUser(
      email
    )

    if (userCount > 0) {
      // Click in first user link
      await usersLinks[0].click()

      // Wait and click delete button
      await this.#waitClickButton('a:has-text("Eliminar")')

      // Wait and click confirm button
      await this.#waitClickButton('input[value="Si, estoy seguro"]')
    }
  }

  async confirmationScreen() {
    // Validate confirmation sweet alert
    await expect(
      this.page.locator('h2.swal2-title:has-text("¡Respuestas Guardadas!")')
    ).toBeVisible({ timeout: 3000 })

    // Click button "Entendido"
    await this.#waitClickButton('button.swal2-confirm:has-text("Entendido")')

    // Validate page h2
    await expect(
      this.page.locator('h2:has-text("¡Formulario Completado!")')
    ).toBeVisible({ timeout: 3000 })
  }
}

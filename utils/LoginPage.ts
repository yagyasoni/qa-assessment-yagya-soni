import { Page, Locator, expect } from '@playwright/test';

// ✅ Page Object Model for the login page
export class LoginPage {
  readonly page: Page;

  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly welcomeMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Define locators
    this.emailInput = page.getByPlaceholder('Enter your email address');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.welcomeMessage = page.getByRole('heading', { name: 'Welcome' });
    this.errorMessage = page.locator('.error-message');
  }

  /**
   * Navigates to the login page.
   * Uses baseURL from playwright.config.ts if defined.
   */
  async goto() {
    await this.page.goto('/auth/login', { waitUntil: 'networkidle' });
    await expect(this.welcomeMessage).toBeVisible();
  }

  /**
   * Logs in using provided credentials.
   * Waits for successful navigation to dashboard.
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await Promise.all([
      this.page.waitForNavigation({ url: '**/gotrade', waitUntil: 'networkidle' }),
      this.signInButton.click(),
    ]);
  }
}

export default LoginPage;

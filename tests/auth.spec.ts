import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/LoginPage';

// --- Test Data ---
const VALID_EMAIL = 'user22@goquant.io'; 
const VALID_PASSWORD = '60Re3G9KvvFl4Ihegxpi'; 
const INVALID_EMAIL = 'wrong@email.com';
const INVALID_PASSWORD = 'wrongpassword';

// Grouping the authentication tests
test.describe('Authentication Tests: Login Flows', () => {
	
	// Test case 1: Successful Login (Positive Test Scenario)
	// This test confirms the LoginPage correctly redirects to the initial authenticated page (/gotrade).
	test('should allow a user to log in with valid credentials and redirect to /gotrade', async ({ page }) => {
		// 1. Arrange: Initialize the Page Object and navigate
		const loginPage = new LoginPage(page);
		await loginPage.goto();

		// 2. Act: Perform the login action. (LoginPage.ts waits for /gotrade)
		await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

		// 3. ✅ FIX APPLIED: Assert: Verify the immediate successful login destination is /gotrade
		// Navigating from /gotrade to /admin is handled by AccountsPage in the setup file, 
		// but the successful login outcome itself is confirmed here.
		await expect(page).toHaveURL(/gotrade/); 
		
		// BONUS ASSERTION: Check for an element unique to the authenticated GoTrade page.
		// A common element on a trading page is the 'Order Entry' or the page title itself.
		await expect(page).toHaveTitle(/GoTrade/); 
	});

	// Test case 2: Failed Login with Invalid Password (Negative Test Scenario)
	test('should show an error when logging in with an invalid password', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		
		// ACT: Try to log in with correct email but wrong password
		await loginPage.emailInput.fill(VALID_EMAIL);
		await loginPage.passwordInput.fill(INVALID_PASSWORD);
		await loginPage.signInButton.click();

		// ASSERT: Verify the error state
		await expect(page.getByText(/Invalid credentials/)).toBeVisible(); 
		
		// Ensure the user is still on the login page
		await expect(page).toHaveURL(/auth\/login/); 
	});
	
	// Test case 3: Failed Login with Empty Fields (Boundary/Negative Test)
	test('should prevent sign in when fields are left empty', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();

		// ACT: Click the sign-in button without filling any fields
		await loginPage.signInButton.click();

		// ASSERT 1: Verify the sign-in button remains available (no navigation)
		await expect(loginPage.signInButton).toBeVisible();

		// ASSERT 2: Check for a validation message on the Email field
		await expect(page.getByText('Email is required')).toBeVisible(); 
	});

});
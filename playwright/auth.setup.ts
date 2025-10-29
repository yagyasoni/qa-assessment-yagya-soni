import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../utils/LoginPage';
import { AccountsPage } from '../utils/AccountsPage'; // ⬅️ Import AccountsPage for navigation

// IMPORTANT: Retaining your test credentials
const VALID_EMAIL = 'user22@goquant.io';
const VALID_PASSWORD = '60Re3G9KvvFl4Ihegxpi';

// Path to the file where the authentication state will be saved
const authFile = 'playwright/.auth/user.json'; 

setup('authenticate and navigate to admin dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const accountsPage = new AccountsPage(page); // ⬅️ Instantiate AccountsPage
  
  // 1. Navigate to the login page
  await loginPage.goto(); 
  
  // 2. Perform the sign-in (lands on /gotrade, as handled in LoginPage.ts)
  await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

  // 3. 🔑 Execute the multi-step navigation from /gotrade to /admin
  // This step handles the click on "Accounts" and then the "Admin" link.
  await accountsPage.navigateToAdminDashboard();

  // 4. Verify successful final URL
  await expect(page).toHaveURL(/admin/); 

  // 5. Save the authenticated storage state
  await page.context().storageState({ path: authFile });
});
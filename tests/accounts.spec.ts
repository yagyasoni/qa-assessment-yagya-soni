import { test, expect } from '@playwright/test';
import { AccountsPage } from '../utils/AccountsPage';

// 🚨 IMPORTANT: Replace these placeholders with your actual API account test data.
const OKX_ACCOUNT_DATA = {
    name: 'OKX_API_yagya_test',
    key: 'f448c682-0dad-4ebb-b234-099e16418c6d', 
    secret: 'E0F67D50E674F24888C7595272199C87',
    passphrase: 'Samoyed@1234',
};

// NEW: Data for Binance accounts 
const BINANCE_USDM_DATA = {
    name: 'BINANCE_USDM_TEST_TM',
    key: 'HAY74jvEsWzHuO67aAk8PyJSLK0BhDBH0rFIbATHhgajVuFzB0kgn3prPQDjWbxj', 
    secret: 'vqzsLCSSLmalnOlDB2JJRHZPPmLSzLVTsAItmoAsFF3hWfCXWOnpeeM0zRxySbtf',
};
const BINANCE_COINM_DATA = {
    name: 'BINANCE_COINM_TEST_TM',
    key: 'HAY74jvEsWzHuO67aAk8PyJSLK0BhDBH0rFIbATHhgajVuFzB0kgn3prPQDjWbxj', 
    secret: 'vqzsLCSSLmalnOlDB2JJRHZPPmLSzLVTsAItmoAsFF3hWfCXWOnpeeM0zRxySbtf',
};

// --- Grouping Account Management Tests ---
test.describe('Account Management: Add Account Flows (Multi-Exchange)', () => {
    let accountsPage: AccountsPage;

    // Use the stored authenticated session
    test.use({ storageState: 'test-results/user.json' });

    // Use a 'beforeEach' to initialize the page object and open the modal
    test.beforeEach(async ({ page }) => {
        accountsPage = new AccountsPage(page);
        // Navigate to the /admin page
        await accountsPage.goto(); 
        // Open the "Add Account" modal (defaulting to OKX)
        await accountsPage.openAddAccountModal(); 
    });

    // =======================================================================
    // 1. OKX TESTS (Original Flow - Test Mode defaults to OFF)
    // =======================================================================

    // Test Case 1: Positive Scenario - Successful OKX Account Addition
    test('should successfully add a new OKX test account with valid credentials', async ({ page }) => {
        // ACT: Fill the form with valid data and submit (isTestMode defaults to false/unchecked)
        await accountsPage.fillAccountForm(
            OKX_ACCOUNT_DATA.name,
            OKX_ACCOUNT_DATA.key,
            OKX_ACCOUNT_DATA.secret,
            OKX_ACCOUNT_DATA.passphrase 
        );
        
        // ASSERT 1: Verify the success message appears
        await expect(accountsPage.successMessage).toBeVisible({ timeout: 60000 });
        
        // ASSERT 2: Verify the new account name appears in the accounts table
        await expect(page.getByRole('cell', { name: OKX_ACCOUNT_DATA.name })).toBeVisible();
    });

    // Test Case 2: Negative Scenario - Invalid OKX Credentials/Format
    test('should show an error when adding an OKX account with invalid credentials', async ({ page }) => {
        const INVALID_KEY = 'invalid-short'; 
        const INVALID_SECRET = 'invalid-secret';

        // ACT: Fill the form with invalid key and submit
        await accountsPage.fillAccountForm(
            OKX_ACCOUNT_DATA.name,
            INVALID_KEY, 
            INVALID_SECRET,
            OKX_ACCOUNT_DATA.passphrase
        );

        // ASSERT: Check for a system-level error message related to API validation
        await expect(accountsPage.addAccountDialog.getByText(/Invalid Key or Signature|Invalid API Key/)).toBeVisible({ timeout: 60000 });
    });

    // =======================================================================
    // 2. BINANCE USD-M TEST (New Flow - Test Mode must be enabled)
    // =======================================================================

    test('should successfully select and prepare form for Binance USD-M Account with Test Mode enabled', async ({ page }) => {
        const exchangeName = 'Binance USDⓈ-M';
        
        // 1. ACT: Select Binance USD-M from the dropdown
        await accountsPage.selectExchange(exchangeName);
        
        // 2. ACT: Fill the API Keys and explicitly enable Test Mode
        await accountsPage.fillAccountForm(
            BINANCE_USDM_DATA.name,
            BINANCE_USDM_DATA.key,
            BINANCE_USDM_DATA.secret,
            undefined, 
            true // <-- REQUIRED: Enable Test Mode
        );

        // 3. ASSERT: Verify the modal title reflects the selected account name
        await expect(accountsPage.addAccountDialog.getByRole('heading', { name: `Add ${exchangeName} Account` })).toBeVisible();
        
        // 4. ASSERT: Verify the submit button is active 
        await expect(accountsPage.submitAccountButton).toBeEnabled();
    });
    
    // =======================================================================
    // 3. BINANCE COIN-M TEST (New Flow - Test Mode must be enabled)
    // =======================================================================

    test('should successfully select and prepare form for Binance COIN-M Account with Test Mode enabled', async ({ page }) => {
        const exchangeName = 'Binance COIN-M';
        
        // 1. ACT: Select Binance COIN-M from the dropdown
        await accountsPage.selectExchange(exchangeName);
        
        // 2. ACT: Fill the API Keys and explicitly enable Test Mode
        await accountsPage.fillAccountForm(
            BINANCE_COINM_DATA.name,
            BINANCE_COINM_DATA.key,
            BINANCE_COINM_DATA.secret,
            undefined, 
            true // <-- REQUIRED: Enable Test Mode
        );

        // 3. ASSERT: Verify the modal title reflects the selected account name
        await expect(accountsPage.addAccountDialog.getByRole('heading', { name: `Add ${exchangeName} Account` })).toBeVisible();

        // 4. ASSERT: Verify the submit button is active
        await expect(accountsPage.submitAccountButton).toBeEnabled();
    });
});

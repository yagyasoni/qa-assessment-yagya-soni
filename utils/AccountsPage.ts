import { Page, Locator, expect } from '@playwright/test';

export class AccountsPage {
    readonly page: Page;
    
    // Locators for navigating from /gotrade to /admin
    readonly mainNavigationAccountsButton: Locator; 
    readonly sidebarAdminLink: Locator; 
    
    // Accounts Dashboard Locators (on /admin page)
    readonly accountsHeading: Locator;
    readonly addAccountButton: Locator;
    
    // Add Account Modal Locators 
    readonly addAccountDialog: Locator; 
    readonly exchangeSelectorDropdown: Locator; 
    readonly modalTitle: Locator; 
    readonly accountNameInput: Locator;
    readonly apiKeyInput: Locator;
    readonly apiSecretInput: Locator;
    readonly passphraseInput: Locator;
    readonly testModeToggle: Locator; // NEW LOCATOR for the Test Mode switch/toggle
    readonly submitAccountButton: Locator;
    readonly successMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        
        // Locators for navigating from /gotrade to /admin
        this.mainNavigationAccountsButton = page.getByRole('button', { name: 'Accounts' });
        this.sidebarAdminLink = page.getByRole('link', { name: 'Admin Manage trading accounts & groups' });
        
        // Accounts Dashboard (on /admin page)
        this.accountsHeading = page.getByRole('heading', { name: 'Accounts' });
        this.addAccountButton = page.getByRole('button', { name: 'Add Account' });
        
        // Add Account Modal Locators 
        this.addAccountDialog = page.getByTestId('add-account-dialog'); 
        this.exchangeSelectorDropdown = page.getByTestId('dropdown-trigger:exchange-selector'); 
        this.modalTitle = page.getByRole('heading', { name: 'Add OKX Account' }); 
        
        this.accountNameInput = page.getByTestId('account-name-input');
        this.apiKeyInput = page.getByTestId('input-api-key');
        this.apiSecretInput = page.getByTestId('input-api-secret');
        this.passphraseInput = page.getByTestId('passphrase-input');
        
        // Assuming the toggle is a switch and uses the accessible name "Test Mode"
        this.testModeToggle = page.getByRole('switch', { name: 'Test Mode' }); 
        
        this.submitAccountButton = page.getByTestId('button-submit-account');
        this.successMessage = page.getByText('Account added successfully'); 
    }
    
    async goto() {
        await this.navigateToAdminDashboard();
    }

    async navigateToAdminDashboard() {
        await this.page.waitForURL('**/gotrade', { waitUntil: 'networkidle' });
        await this.mainNavigationAccountsButton.click();
        
        await Promise.all([
            this.page.waitForURL('**/admin', { waitUntil: 'networkidle' }),
            this.sidebarAdminLink.click(),
        ]);

        await this.accountsHeading.waitFor({ state: 'visible' });
    }

    async openAddAccountModal() {
        await this.addAccountButton.click();
        await this.addAccountDialog.waitFor({ state: 'visible' }); 
    }
    
    async selectExchange(exchangeName: string) {
        await this.exchangeSelectorDropdown.click();
        
        const exchangeOption = this.page.getByRole('option', { name: exchangeName, exact: true });
        
        await exchangeOption.waitFor({ state: 'visible' });
        await exchangeOption.click();
        
        await expect(this.exchangeSelectorDropdown).toContainText(exchangeName);
    }

    /**
     * Fills the account form, handling optional passphrase and test mode toggle.
     * @param isTestMode If true, the "Test Mode" toggle will be checked before submission.
     */
    async fillAccountForm(name: string, key: string, secret: string, passphrase?: string, isTestMode: boolean = false) {
        await this.accountNameInput.fill(name);
        await this.apiKeyInput.fill(key);
        await this.apiSecretInput.fill(secret);
        
        // Handle optional Passphrase field for OKX
        if (passphrase) {
            if (await this.passphraseInput.isVisible()) {
                await this.passphraseInput.fill(passphrase);
            }
        }
        
        // Handle Test Mode Toggle based on the parameter
        if (isTestMode && await this.testModeToggle.isVisible()) {
            // Check the toggle to enable Test Mode
            await this.testModeToggle.check();
            await expect(this.testModeToggle).toBeChecked(); // Assert it is now checked
        } else if (!isTestMode && await this.testModeToggle.isVisible()) {
            // Ensure it is unchecked if explicitly false/default, and visible
            await this.testModeToggle.uncheck();
        }
        
        await this.submitAccountButton.click();
    }
}

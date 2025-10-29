import { test, expect } from '@playwright/test';
import GoTradeSelectors from '../utils/goTradeSelectors';

/**
 * Test suite for verifying order placement and account switching functionality.
 * This test assumes a successful sign-in and is focused on the GoTrade page.
 */

test.describe('GoTrade - Order Placement and Account Switching', () => {
    
    // Destructure selectors for cleaner code
    const { 
        exchangeSelectorTrigger, 
        binanceCoinMOption,
        binanceUsdmOption, 
        quantityInput, 
        durationInput, 
        tradeButton, 
        workingOrdersTab, 
        orderHistoryTab, 
        orderTableBuySide, 
        orderTableQuantity,
        successNotification
    } = GoTradeSelectors;

    // Setup: Navigate to the GoTrade page and ensure the primary elements are loaded
    test.beforeEach(async ({ page }) => {
        // Assume navigation to the GoTrade page after successful sign-in
        await page.goto('/goTrade');
        // Ensure the main account selector element is visible before proceeding
        await expect(page.locator(exchangeSelectorTrigger)).toBeVisible({ timeout: 10000 });
    });

    test('TC_01: Should successfully place an order using the default account (Binance Coin M)', async ({ page }) => {
        const defaultAccountName: string = binanceCoinMOption; // Assuming this is the initial default

        // 1. Verify Default Account is selected
        console.log('Verifying default account is selected');
        await expect(page.locator(exchangeSelectorTrigger)).toContainText(defaultAccountName);

        // 2. Input Quantity (0.2)
        console.log('Setting quantity to 0.2');
        await page.locator(quantityInput).clear();
        await page.locator(quantityInput).fill('0.2');

        // 3. Input Duration (1 second)
        console.log('Setting duration to 1 second');
        await page.locator(durationInput).clear();
        await page.locator(durationInput).fill('1');

        // 4. Click Trade Button (Buy)
        console.log('Placing the Buy order');
        // Assuming the Mark as button is already pre-selected for Buy side
        await page.locator(tradeButton).click();

        // Verification of Order Confirmation/Notification
        await expect(page.locator(successNotification)).toBeVisible();
        await expect(page.locator(successNotification)).toContainText('Order Placed');
        await page.waitForTimeout(2000); // Wait for order to settle/fill or for UI update

        // 5. Select Working Orders Tab
        console.log('Checking Working Orders tab');
        await page.locator(workingOrdersTab).click();
        
        // 6. Verify Order in Working Orders table 
        // We look for a table row that contains "Buy" and the quantity "0.2"
        await expect(page.locator('[data-testid="working-orders-table"]')).toBeVisible();
        const workingOrderRow = page.locator('[data-testid="working-orders-table"] tr').filter({ hasText: orderTableBuySide }).filter({ hasText: '0.2' });
        await expect(workingOrderRow).toContainText('Buy');
        await expect(workingOrderRow).toContainText('0.2');

        // 7. Select Order History Tab
        console.log('Checking Order History tab');
        await page.locator(orderHistoryTab).click();
        
        // 8. Verify Order in Order History table
        await expect(page.locator('[data-testid="order-history-table"]')).toBeVisible();
        const historyOrderRow = page.locator('[data-testid="order-history-table"] tr').filter({ hasText: orderTableBuySide }).filter({ hasText: '0.2' });
        await expect(historyOrderRow).toContainText('Buy');
        await expect(historyOrderRow).toContainText('0.2');
    });

    test('TC_02: Should switch account to Binance USDM and successfully place an order under it', async ({ page }) => {
        const targetAccountName: string = binanceUsdmOption;
        const defaultAccountName: string = binanceCoinMOption;
        
        // 1. Open Account Selector
        console.log('Opening account selector');
        await page.locator(exchangeSelectorTrigger).click();

        // 2. Select Target Account
        console.log(`Switching to ${targetAccountName}`);
        // Clicks the element containing the text 'Binance USDM' within the open dropdown/list
        await page.getByText(targetAccountName).click();

        // 3. Verify Account Switch
        await expect(page.locator(exchangeSelectorTrigger)).toContainText(targetAccountName);

        // 4. Input Quantity (0.2)
        console.log('Setting quantity to 0.2 for new account');
        await page.locator(quantityInput).clear();
        await page.locator(quantityInput).fill('0.2');

        // 5. Input Duration (1 second)
        console.log('Setting duration to 1 second for new account');
        await page.locator(durationInput).clear();
        await page.locator(durationInput).fill('1');

        // 6. Click Trade Button (Buy)
        console.log('Placing Buy order on new account');
        await page.locator(tradeButton).click();

        // Verification of Order Confirmation/Notification
        await expect(page.locator(successNotification)).toBeVisible();
        await page.waitForTimeout(2000);

        // 7. Select Working Orders Tab
        console.log('Checking Working Orders tab for new account');
        await page.locator(workingOrdersTab).click();

        // 8. Verify Order in Working Orders for the NEW account (Binance USDM)
        await expect(page.locator('[data-testid="working-orders-table"]')).toBeVisible();
        const newAccountOrderRow = page.locator('[data-testid="working-orders-table"] tr').filter({ hasText: orderTableBuySide }).filter({ hasText: '0.2' });
        await expect(newAccountOrderRow).toContainText('Buy');
        await expect(newAccountOrderRow).toContainText('0.2');
        
        // 9. Verify segregation (Switch back to default account to confirm order is segregated)
        console.log('Switching back to default account for segregation check');
        await page.locator(exchangeSelectorTrigger).click();
        await page.getByText(defaultAccountName).click();
        await expect(page.locator(exchangeSelectorTrigger)).toContainText(defaultAccountName);
        
        await page.locator(workingOrdersTab).click();

        // 10. Assert that the order placed in Step 6 is NOT present in the default account's working orders
        console.log('Verifying order is NOT present in default account');
        // This is a robust check to ensure no row matches both the side and the quantity (which is unique to this test)
        const segregationCheckRow = page.locator('[data-testid="working-orders-table"] tr').filter({ hasText: 'Buy' }).filter({ hasText: '0.2' });
        await expect(segregationCheckRow).toHaveCount(0);
    });
});
/**
 * Selectors for the GoTrade page elements.
 * These are centralized to keep tests clean and maintainable.
 * NOTE: The selectors are typed as string, as they represent CSS selectors 
 * or exact text content for location methods.
 */

// Define the structure of the selectors object
interface GoTradeSelectorMap {
    // --- Account Switching ---
    exchangeSelectorTrigger: string;
    binanceCoinMOption: string;
    binanceUsdmOption: string;

    // --- Trade Card Inputs & Button (Placeholders) ---
    quantityInput: string; 
    durationInput: string; 
    tradeButton: string;     
    
    // --- Order Tables Tabs ---
    workingOrdersTab: string; 
    orderHistoryTab: string;   
    
    // --- Table Content Verification ---
    orderTableBuySide: string;
    orderTableQuantity: string;
    
    // --- Notifications ---
    successNotification: string;
}

const GoTradeSelectors: GoTradeSelectorMap = {
    // --- Account Switching ---
    // Selector for the main button to open the account selection dropdown
    exchangeSelectorTrigger: '[data-testid="exchange-selector-trigger"]',
    
    // Account options are located by their exact text content in the dropdown.
    binanceCoinMOption: 'Binance Coin M', 
    binanceUsdmOption: 'Binance USDM',     

    // --- Trade Card Inputs & Button (Placeholders) ---
    // The Quantity Input field
    quantityInput: '[data-testid="trade-quantity-input"]', 
    // The Duration Input field
    durationInput: '[data-testid="trade-duration-input"]', 
    // The main Trade/Buy button
    tradeButton: '[data-testid="place-trade-button"]',     
    
    // --- Order Tables Tabs ---
    // Locating tabs by their role and contained text for robustness.
    workingOrdersTab: '[role="tab"]', 
    orderHistoryTab: '[role="tab"]',   
    
    // --- Table Content Verification ---
    // Selectors to find the placed order details in a table row.
    orderTableBuySide: 'Buy',
    orderTableQuantity: '0.2',
    
    // --- Notifications ---
    // Message displayed upon successful order placement
    successNotification: '[data-testid="order-success-message"]' 
};

export default GoTradeSelectors;
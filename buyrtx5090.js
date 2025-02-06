const puppeteer = require('puppeteer');
//await new Promise(r => setTimeout(r, 1000))
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const fName = '';
const lName = '';
const address = '';
const city = '';
const zip = '';
const state = '';
const suite = '';
const email = '';
const phone = '';
const cc = ''

async function clickButton(page, buttonClass) {
    await page.waitForSelector(buttonClass, { visible: true });

    const buttonEnabled = await page.evaluate((selector) => {
    const button = document.querySelector(selector);
    return button && !button.disabled; // Check if the button is enabled
    }, buttonClass);

    if (buttonEnabled) {
        await page.click(buttonClass); // Click the button if it's enabled
        await console.log('Button clicked!');
    } else {
        await console.log('Button is disabled or not clickable!');
    }
}

async function htmlElementPresent(page, buttonClass) {
    try {
        await page.waitForSelector(buttonClass, { visible: true, timeout: 500 });
        return true;
    } catch (e) {
        return false;
    }
}

async function reloadUntilPresent(page, htmlClass) {
    let present = await htmlElementPresent(page, htmlClass);
    while (!present) {
        await page.reload();
        present = await htmlElementPresent(page, htmlClass);
    }
}

async function inputText(page, inputClass, text) {
    await page.waitForSelector(inputClass, { visible: true});
    await page.type(inputClass, text);
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,    //spawns a browser
        //slowMo: 1000,        //delay between actions
        defaultViewport: null,  // Disable the default viewport
            args: [
            '--window-size=1920,1080',  // Set the browser window size
        ],
        
        
    });


    const page = await browser.newPage();

    

    const rtx5090 = 'https://www.bestbuy.com/site/nvidia-geforce-rtx-5090-32gb-gddr7-graphics-card-dark-gun-metal/6614151.p?skuId=6614151';
    const mac = 'https://www.bestbuy.com/site/apple-macbook-air-13-inch-apple-m2-chip-built-for-apple-intelligence-16gb-memory-256gb-ssd-midnight/6602763.p?skuId=6602763'

    const productUrl = mac;

    try {
        await page.goto(productUrl, {waitUntil: 'domcontentloaded'});
    } catch (e) {
        await console.log(e);
        await new Promise(r => setTimeout(r, 1000))
     }


    const addToCartButton = '.c-button.c-button-primary.c-button-lg.c-button-block.c-button-icon.c-button-icon-leading.add-to-cart-button '
    let notInStock = !(await htmlElementPresent(page, addToCartButton));

    while (notInStock) { //stock checker
        console.log('Not in stock');
        await page.reload();
        notInStock = !(await htmlElementPresent(page, addToCartButton));
    }
    
    //after in stock ping discord bot to message me
    

    
    //const outOfStockButton = '.c-button.c-button-disabled.c-button-lg.c-button-block.add-to-cart-button ';


    //const addToCartButton = '.c-button.c-button-primary.c-button-lg.c-button-block.c-button-icon.c-button-icon-leading.add-to-cart-button '; 
    const goToCartButton = '.c-button.c-button-secondary.c-button-md.c-button-block ';
    const cartButton = '.cart-label';
    const checkOutButton = '.btn.btn-lg.btn-block.btn-primary';
    const guestButton = '.c-button.c-button-secondary.c-button-lg.cia-guest-content__continue.guest';

    await clickButton(page, addToCartButton);
    if (await htmlElementPresent(page, goToCartButton)) {
        await clickButton(page, goToCartButton);
    } else {
        console.log('not present');
    }
    await clickButton(page, cartButton);
    await reloadUntilPresent(page, checkOutButton);
    

    //const freeShippingBubble = '.c-radio-input.appearance-none.h-full.w-full.border-25.rounded-full'; //availability__title    <- this is the div of the button
    const freeShippingBubble = '.availability__title';
    await clickButton(page, freeShippingBubble);

    await clickButton(page, checkOutButton);
    await clickButton(page, guestButton);

    const applyButton = '.c-button.c-button-secondary.c-button-md.new-address-form__button';
    await reloadUntilPresent(page, applyButton);
    // need to reload page if it is not on checkout page, need to check for apply button to exist
    

    const firstNameInputBox = '#firstName.tb-input';
    const lastNameInputBox = '#lastName.tb-input';
    const addressInputBox = '#street.tb-input';
    const cityInputBox = '#city.tb-input';
    const zipInputBox = '#zipcode.tb-input';

    await inputText(page, firstNameInputBox, fName);
    await inputText(page, lastNameInputBox, lName);
    await inputText(page, addressInputBox, address);
    await inputText(page, cityInputBox, city);
    await inputText(page, zipInputBox, zip);

    const aptNumberButton = '.c-button-link.address-form__showAddress2Link';
    await clickButton(page, aptNumberButton);

    const aptNumberInputBox = '#street2.tb-input';
    await inputText(page, aptNumberInputBox, suite)

    const stateDropDownBox = '#state';
    await page.waitForSelector(stateDropDownBox, { visible: true});
    await page.select(stateDropDownBox, state);

    
    await clickButton(page, applyButton);

    const emailInputBox = '#user\\.emailAddress.tb-input';
    const phoneInputBox = '#user\\.phone.tb-input';

    await inputText(page, emailInputBox, email);
    await inputText(page, phoneInputBox, phone);

    const continueToPaymentButton = '.btn.btn-lg.btn-block.btn-secondary';
    await clickButton(page, continueToPaymentButton);

    const ccInputBox = '#cc-number.tb-input.v-large ';
    await inputText(page, ccInputBox, cc);

    const placeOrderButton = '.btn.btn-lg.btn-block.btn-primary';
    await clickButton(page, placeOrderButton);

   

    
    try {
        await browser.close();
    } catch (e) {
        console.log('tried closing');
    }
    
})();
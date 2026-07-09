const { test, expect } = require('@playwright/test');

test('homepage loads', async ({ page }) => {

    await page.goto('http://localhost:3000');

    await page.screenshot({
        path: 'homepage.png',
        fullPage: true
    });

    await expect(page).toHaveTitle(/./);

});
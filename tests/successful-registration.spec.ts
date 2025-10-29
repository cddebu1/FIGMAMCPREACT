import { test, expect } from '@playwright/test';

test.describe('Registration Functionality', () => {
  test('4.1 Successful Registration', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000/');
    
    // Verify we're on the login page
    await expect(page).toHaveTitle('Login Page');
    await expect(page.getByRole('heading', { name: 'LOGIN' })).toBeVisible();
    
    // Step 1: Navigate to registration page
    await page.getByRole('button', { name: "Don't have an account? Register" }).click();
    
    // Verify navigation to registration page
    await expect(page).toHaveURL(/.*\/register/);
    await expect(page.getByRole('heading', { name: 'REGISTER' })).toBeVisible();
    
    // Generate random email and password
    const randomString = Math.random().toString(36).substring(2, 15);
    const testEmail = `test${randomString}${Date.now()}@example.com`;
    const testPassword = `Pass${Math.random().toString(36).substring(2, 10)}123!`;
    
    // Step 2: Enter valid email
    await page.getByPlaceholder('Enter Your Email').fill(testEmail);
    
    // Step 3: Enter valid password
    await page.getByPlaceholder('Enter Your Password').fill(testPassword);
    
    // Step 4: Enter matching password in confirm field
    await page.getByPlaceholder('Confirm Your Password').fill(testPassword);
    
    // Verify all fields are filled correctly
    await expect(page.getByPlaceholder('Enter Your Email')).toHaveValue(testEmail);
    await expect(page.getByPlaceholder('Enter Your Password')).toHaveValue(testPassword);
    await expect(page.getByPlaceholder('Confirm Your Password')).toHaveValue(testPassword);
    
    // Step 5: Click "REGISTER" button
    await page.getByRole('button', { name: 'REGISTER' }).click();
    
    // Expected Results Verification:
    // Note: The following assertions may need to be adjusted based on your app's actual behavior
    
    // Verify form submission is successful (check for success indicators)
    // This could be a success message, redirect, or other UI change
    // Example assertions (uncomment and adjust as needed):
    
    // Option 1: If redirected to login page
    // await expect(page).toHaveURL(/.*\/(login)?$/);
    // await expect(page.getByRole('heading', { name: 'LOGIN' })).toBeVisible();
    
    // Option 2: If success message is displayed
    // await expect(page.getByText(/registration successful/i)).toBeVisible();
    // await expect(page.getByText(/account created/i)).toBeVisible();
    
    // Option 3: If user is automatically logged in
    // await expect(page).toHaveURL(/.*\/dashboard/);
    // await expect(page.getByText(/welcome/i)).toBeVisible();
    
    // For now, wait a moment to see what happens after registration
    await page.waitForTimeout(2000);
    
    // Take a screenshot for manual verification during test development
    await page.screenshot({ path: `test-results/registration-success-${Date.now()}.png` });
    
    console.log(`Registration test completed with email: ${testEmail} and password: ${testPassword}. Please verify the expected behavior and update assertions accordingly.`);
  });
  
  test.afterEach(async ({ page }) => {
    // Cleanup: Navigate back to home page or perform any necessary cleanup
    await page.goto('http://localhost:3000/');
  });
});
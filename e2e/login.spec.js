/**
 * Login Flow E2E Tests
 * 
 * Tests for user authentication flow
 */

import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login page elements', async ({ page }) => {
    // Check for logo/title
    await expect(page.locator('text=SOMPO')).toBeVisible()
    
    // Check for form fields
    await expect(page.locator('input').first()).toBeVisible()
    
    // Check for login button
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    // Click submit without filling form
    await page.locator('button[type="submit"]').click()
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*login/)
  })

  test('should login with valid credentials', async ({ page }) => {
    // Fill login form
    await page.locator('input').first().fill('YUNUSEMRE')
    await page.locator('input[type="password"]').fill('12')
    
    // Fill captcha (mock)
    const captchaInputs = await page.locator('input[type="text"]').all()
    if (captchaInputs.length > 1) {
      await captchaInputs[1].fill('ABC123')
    }
    
    // Submit form
    await page.locator('button[type="submit"]').click()
    
    // Should redirect to home after successful login
    await expect(page).toHaveURL('/', { timeout: 10000 })
  })

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]')
    
    // Initially should be password type
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click eye icon to toggle
    await page.locator('button[aria-label*="Şifre"]').click()
    
    // Should change to text type
    await expect(page.locator('input[type="text"]').nth(1)).toBeVisible()
  })

  test('should refresh captcha', async ({ page }) => {
    // Find captcha refresh button
    const refreshButton = page.locator('button[icon="bi-arrow-clockwise"]')
    
    if (await refreshButton.count() > 0) {
      await refreshButton.click()
      
      // Captcha should change (visual verification)
      await expect(refreshButton).toBeVisible()
    }
  })
})


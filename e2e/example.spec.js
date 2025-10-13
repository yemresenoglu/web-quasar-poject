/**
 * Example E2E Test
 * 
 * Basic test to verify Playwright is working
 */

import { test, expect } from '@playwright/test'

test.describe('Basic Navigation', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/')
    
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/.*login/)
  })

  test('should have correct title', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page).toHaveTitle(/SOMPO/)
  })

  test('should display login form', async ({ page }) => {
    await page.goto('/login')
    
    // Check for login form elements
    await expect(page.locator('input[type="text"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })
})


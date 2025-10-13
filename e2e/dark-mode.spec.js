/**
 * Dark Mode E2E Tests
 * 
 * Tests for dark mode functionality
 */

import { test, expect } from '@playwright/test'

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.locator('input').first().fill('YUNUSEMRE')
    await page.locator('input[type="password"]').fill('12')
    
    const captchaInputs = await page.locator('input[type="text"]').all()
    if (captchaInputs.length > 1) {
      await captchaInputs[1].fill('ABC123')
    }
    
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/')
  })

  test('should toggle dark mode from taskbar', async ({ page }) => {
    // Find dark mode toggle button (moon/sun icon)
    const darkModeButton = page.locator('[name="dark_mode"], [name="light_mode"]').first()
    
    // Button should be visible
    await expect(darkModeButton).toBeVisible({ timeout: 5000 })
    
    // Get current mode
    const body = page.locator('body')
    const initialIsDark = await body.evaluate((el) => el.classList.contains('body--dark'))
    
    // Click to toggle
    await darkModeButton.click()
    
    // Wait for transition
    await page.waitForTimeout(500)
    
    // Mode should be toggled
    const afterToggleIsDark = await body.evaluate((el) => el.classList.contains('body--dark'))
    expect(afterToggleIsDark).toBe(!initialIsDark)
  })

  test('should persist dark mode after page reload', async ({ page }) => {
    // Toggle dark mode on
    const darkModeButton = page.locator('[name="dark_mode"], [name="light_mode"]').first()
    await darkModeButton.click()
    await page.waitForTimeout(500)
    
    const body = page.locator('body')
    const isDarkBefore = await body.evaluate((el) => el.classList.contains('body--dark'))
    
    // Reload page
    await page.reload()
    await page.waitForTimeout(1000)
    
    // Dark mode should persist
    const isDarkAfter = await body.evaluate((el) => el.classList.contains('body--dark'))
    expect(isDarkAfter).toBe(isDarkBefore)
  })

  test('should show correct icon for current mode', async ({ page }) => {
    const body = page.locator('body')
    const isDark = await body.evaluate((el) => el.classList.contains('body--dark'))
    
    if (isDark) {
      // In dark mode, should show light_mode icon (to switch to light)
      await expect(page.locator('[name="light_mode"]').first()).toBeVisible()
    } else {
      // In light mode, should show dark_mode icon (to switch to dark)
      await expect(page.locator('[name="dark_mode"]').first()).toBeVisible()
    }
  })

  test('should have tooltip on dark mode button', async ({ page }) => {
    const darkModeButton = page.locator('[name="dark_mode"], [name="light_mode"]').first()
    
    // Hover to show tooltip
    await darkModeButton.hover()
    await page.waitForTimeout(500)
    
    // Tooltip should be visible
    const tooltip = page.locator('.q-tooltip')
    await expect(tooltip).toBeVisible()
  })

  test('should change background gradient in dark mode', async ({ page }) => {
    // Toggle to dark mode
    const darkModeButton = page.locator('[name="dark_mode"]').first()
    
    if (await darkModeButton.count() > 0) {
      await darkModeButton.click()
      await page.waitForTimeout(500)
      
      // Body should have dark class
      const body = page.locator('body')
      await expect(body).toHaveClass(/body--dark/)
    }
  })
})


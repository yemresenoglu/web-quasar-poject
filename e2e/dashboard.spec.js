/**
 * Dashboard E2E Tests
 * 
 * Tests for dashboard functionality
 */

import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
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

  test('should display dashboard cards', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('.index-page__card')
    
    // Should have stat cards
    const cards = await page.locator('.index-page__card').all()
    expect(cards.length).toBeGreaterThan(0)
  })

  test('should display charts', async ({ page }) => {
    // Wait for charts
    await page.waitForSelector('canvas', { timeout: 5000 })
    
    // Should have chart canvas elements
    const charts = await page.locator('canvas').all()
    expect(charts.length).toBeGreaterThan(0)
  })

  test('should navigate to menu', async ({ page }) => {
    // Click menu button in taskbar
    await page.locator('[name="bi-grid"]').click()
    
    // Should navigate to menu page
    await expect(page).toHaveURL('/menu')
  })

  test('should display process statistics', async ({ page }) => {
    // Check for process cards
    await page.waitForSelector('.process-stat')
    
    const processCards = await page.locator('.process-stat').all()
    expect(processCards.length).toBeGreaterThan(0)
  })

  test('should show user profile in taskbar', async ({ page }) => {
    // Taskbar should be visible
    await expect(page.locator('.taskbar')).toBeVisible()
    
    // User avatar should be visible
    await expect(page.locator('.taskbar__avatar, .taskbar__avatar-icon')).toBeVisible()
  })
})


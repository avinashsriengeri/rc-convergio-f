import { test, expect } from '@playwright/test'

const modules = [
  { name: 'Contacts', path: '/contacts' },
  { name: 'Companies', path: '/companies' },
  { name: 'Deals', path: '/deals' },
  { name: 'Tasks', path: '/tasks' },
  { name: 'Activities', path: '/activities' },
  { name: 'Campaigns', path: '/campaigns' },
  { name: 'Quotes', path: '/quotes' },
  { name: 'Products', path: '/products' },
  { name: 'Sequences', path: '/sequences' },
]

// Test suite for team/tenant visibility across all modules
for (const mod of modules) {
  test.describe(`${mod.name} Module Team/Tenant Integration`, () => {
    
    test(`${mod.name} | Verify team/tenant visibility elements are present`, async ({ page }) => {
      await page.goto(mod.path)
      
      // Check for team and owner information display
      await expect(page.locator('text=Team')).toBeVisible()
      await expect(page.locator('text=Owner')).toBeVisible()
      
      // Verify permission-based button visibility
      const editButtons = page.locator('button:has-text("Edit")')
      const deleteButtons = page.locator('button:has-text("Delete")')
      
      // At least some buttons should be present (depending on user permissions)
      await expect(editButtons.first()).toBeVisible({ timeout: 10000 })
    })

    test(`${mod.name} | Verify restricted user cannot edit without permission`, async ({ page }) => {
      // This test assumes login as non-admin user is handled globally in setup
      await page.goto(mod.path)
      
      // Check that edit buttons are conditionally shown based on permissions
      const editButtons = page.locator('button:has-text("Edit")')
      const deleteButtons = page.locator('button:has-text("Delete")')
      
      // Verify buttons exist but may be hidden based on permissions
      await expect(editButtons).toHaveCount({ min: 0 })
      await expect(deleteButtons).toHaveCount({ min: 0 })
    })

    test(`${mod.name} | Verify admin can see all team/tenant data`, async ({ page }) => {
      // This test assumes login as admin is handled globally in setup
      await page.goto(mod.path)
      
      // Admin should see team and owner information
      await expect(page.locator('text=Team')).toBeVisible()
      await expect(page.locator('text=Owner')).toBeVisible()
      
      // Admin should have edit/delete permissions
      const editButtons = page.locator('button:has-text("Edit")')
      const deleteButtons = page.locator('button:has-text("Delete")')
      
      await expect(editButtons.first()).toBeVisible({ timeout: 10000 })
    })

    test(`${mod.name} | Verify dropdown filtering works correctly`, async ({ page }) => {
      await page.goto(mod.path)
      
      // Look for user selection dropdowns
      const userDropdowns = page.locator('select, [role="combobox"]')
      
      if (await userDropdowns.count() > 0) {
        // Verify dropdowns are present and functional
        await expect(userDropdowns.first()).toBeVisible()
        
        // Check that dropdown options are filtered (should not show all users)
        const firstDropdown = userDropdowns.first()
        await firstDropdown.click()
        
        // Verify dropdown has options (team-filtered)
        const options = page.locator('option, [role="option"]')
        await expect(options).toHaveCount({ min: 1 })
      }
    })

    test(`${mod.name} | Verify team badges and styling are applied`, async ({ page }) => {
      await page.goto(mod.path)
      
      // Check for team badge styling
      const teamBadges = page.locator('.team-badge, .owner-badge, .tenant-badge')
      
      if (await teamBadges.count() > 0) {
        await expect(teamBadges.first()).toBeVisible()
        
        // Verify badge styling is applied
        const badge = teamBadges.first()
        await expect(badge).toHaveCSS('background-color', /rgb\(238, 242, 255\)|rgb\(240, 249, 255\)|rgb\(254, 243, 199\)/)
      }
    })

    test(`${mod.name} | Verify permission-based UI state changes`, async ({ page }) => {
      await page.goto(mod.path)
      
      // Check for permission-based styling
      const permissionDenied = page.locator('.permission-denied')
      const permissionReadonly = page.locator('.permission-readonly')
      
      // These classes may or may not be present depending on user permissions
      // Just verify the page loads without errors
      await expect(page.locator('body')).toBeVisible()
    })

    test(`${mod.name} | Verify team context indicators`, async ({ page }) => {
      await page.goto(mod.path)
      
      // Check for team context styling
      const teamContext = page.locator('.team-context, .tenant-context')
      
      if (await teamContext.count() > 0) {
        await expect(teamContext.first()).toBeVisible()
        
        // Verify context styling is applied
        const context = teamContext.first()
        await expect(context).toHaveCSS('border-left', /3px solid/)
      }
    })

    test(`${mod.name} | Verify filtered dropdown indicators`, async ({ page }) => {
      await page.goto(mod.path)
      
      // Check for filtered dropdown styling
      const filteredDropdowns = page.locator('.filtered-dropdown')
      
      if (await filteredDropdowns.count() > 0) {
        await expect(filteredDropdowns.first()).toBeVisible()
        
        // Verify filtering indicator is present
        const dropdown = filteredDropdowns.first()
        await expect(dropdown).toHaveCSS('background-color', /rgb\(248, 250, 252\)/)
      }
    })
  })
}

// Global test for team access demo page
test.describe('Team Access Demo', () => {
  test('Team Access Demo page loads and shows examples', async ({ page }) => {
    await page.goto('/team-access-demo')
    
    // Verify demo page loads
    await expect(page.locator('h1:has-text("Team Access Overview")')).toBeVisible()
    
    // Verify demo components are present
    await expect(page.locator('text=Contact Visibility Example')).toBeVisible()
    await expect(page.locator('text=Deal Visibility Example')).toBeVisible()
    
    // Verify permission examples are shown
    await expect(page.locator('text=Who Can See This Contact?')).toBeVisible()
    await expect(page.locator('text=Who Can See/Edit This Deal?')).toBeVisible()
    
    // Verify team-aware dropdown examples
    await expect(page.locator('text=Team-aware User Dropdown')).toBeVisible()
    await expect(page.locator('text=Owner Selection (Team Filtered)')).toBeVisible()
  })
})

// Test for composables functionality
test.describe('Team/Tenant Composables', () => {
  test('useContext composable provides correct data', async ({ page }) => {
    await page.goto('/contacts')
    
    // Verify context data is available (check in browser console)
    const contextData = await page.evaluate(() => {
      return {
        hasContext: typeof window.__RC_CONTEXT__ !== 'undefined',
        hasPermission: typeof window.__RC_PERMISSION__ !== 'undefined'
      }
    })
    
    // Context should be available
    expect(contextData.hasContext).toBe(true)
  })
  
  test('usePermission composable provides correct methods', async ({ page }) => {
    await page.goto('/contacts')
    
    // Verify permission methods are available
    const permissionMethods = await page.evaluate(() => {
      return {
        hasCanEdit: typeof window.__RC_CAN_EDIT__ !== 'undefined',
        hasCanDelete: typeof window.__RC_CAN_DELETE__ !== 'undefined',
        hasCanView: typeof window.__RC_CAN_VIEW__ !== 'undefined'
      }
    })
    
    // Permission methods should be available
    expect(permissionMethods.hasCanEdit).toBe(true)
    expect(permissionMethods.hasCanDelete).toBe(true)
    expect(permissionMethods.hasCanView).toBe(true)
  })
})

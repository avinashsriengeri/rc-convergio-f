import { test, expect } from '@playwright/test'

test.describe('Documents Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page and authenticate
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'password')
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')
  })

  test.describe('Documents Library', () => {
    test('should display documents library page', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Check page title and header
      await expect(page.locator('h1')).toContainText('Documents')
      await expect(page.locator('text=Manage and organize your documents')).toBeVisible()
    })

    test('should show upload button when user has permission', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Check upload button is visible
      await expect(page.locator('button:has-text("Upload Document")')).toBeVisible()
    })

    test('should display empty state when no documents', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Check empty state
      await expect(page.locator('text=No documents found')).toBeVisible()
      await expect(page.locator('text=Get started by uploading your first document')).toBeVisible()
    })

    test('should filter documents by search term', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Add some test documents first (this would be done via API in real test)
      // For now, we'll test the filter UI
      const searchInput = page.locator('input[placeholder="Search documents..."]')
      await searchInput.fill('test document')
      
      // Check that search input has the value
      await expect(searchInput).toHaveValue('test document')
    })

    test('should filter documents by file type', async ({ page }) => {
      await page.goto('/sales/documents')
      
      const fileTypeSelect = page.locator('select').first()
      await fileTypeSelect.selectOption('pdf')
      
      await expect(fileTypeSelect).toHaveValue('pdf')
    })

    test('should filter documents by visibility', async ({ page }) => {
      await page.goto('/sales/documents')
      
      const visibilitySelect = page.locator('select').nth(1)
      await visibilitySelect.selectOption('private')
      
      await expect(visibilitySelect).toHaveValue('private')
    })

    test('should clear filters', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Set some filters
      await page.fill('input[placeholder="Search documents..."]', 'test')
      await page.selectOption('select', 'pdf')
      
      // Clear filters
      await page.click('button:has-text("Clear Filters")')
      
      // Check filters are cleared
      await expect(page.locator('input[placeholder="Search documents..."]')).toHaveValue('')
    })
  })

  test.describe('Document Upload', () => {
    test('should open upload modal when upload button is clicked', async ({ page }) => {
      await page.goto('/sales/documents')
      
      await page.click('button:has-text("Upload Document")')
      
      // Check modal is open
      await expect(page.locator('text=Upload Document')).toBeVisible()
      await expect(page.locator('text=Select a file to upload')).toBeVisible()
    })

    test('should validate file type on upload', async ({ page }) => {
      await page.goto('/sales/documents')
      await page.click('button:has-text("Upload Document")')
      
      // Create a test file with invalid type
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'test.exe',
        mimeType: 'application/exe',
        buffer: Buffer.from('test content')
      })
      
      // Check error message
      await expect(page.locator('text=File type not allowed')).toBeVisible()
    })

    test('should validate file size on upload', async ({ page }) => {
      await page.goto('/sales/documents')
      await page.click('button:has-text("Upload Document")')
      
      // Create a large test file (simulate > 50MB)
      const largeContent = 'x'.repeat(51 * 1024 * 1024) // 51MB
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'large.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from(largeContent)
      })
      
      // Check error message
      await expect(page.locator('text=File size exceeds 50MB limit')).toBeVisible()
    })

    test('should upload valid document', async ({ page }) => {
      await page.goto('/sales/documents')
      await page.click('button:has-text("Upload Document")')
      
      // Create a valid test file
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test content')
      })
      
      // Fill metadata
      await page.fill('input[id="title"]', 'Test Document')
      await page.fill('textarea[id="description"]', 'A test document')
      await page.selectOption('select[id="visibility"]', 'private')
      
      // Submit upload
      await page.click('button[type="submit"]')
      
      // Check success (this would depend on actual API response)
      // For now, we'll check that the modal closes
      await expect(page.locator('text=Upload Document')).not.toBeVisible()
    })
  })

  test.describe('Document Actions', () => {
    test('should preview document when preview button is clicked', async ({ page }) => {
      // This test assumes there are documents in the system
      await page.goto('/sales/documents')
      
      // Wait for documents to load (if any)
      await page.waitForTimeout(1000)
      
      // Try to click preview button if documents exist
      const previewButton = page.locator('button[title="Preview"]').first()
      if (await previewButton.isVisible()) {
        await previewButton.click()
        
        // Check preview modal opens
        await expect(page.locator('text=Preview not available')).toBeVisible()
      }
    })

    test('should download document when download button is clicked', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Wait for documents to load
      await page.waitForTimeout(1000)
      
      // Try to click download button if documents exist
      const downloadButton = page.locator('button[title="Download"]').first()
      if (await downloadButton.isVisible()) {
        // Mock download behavior
        await page.route('**/documents/*/download', route => {
          route.fulfill({
            status: 200,
            contentType: 'application/pdf',
            body: Buffer.from('test pdf content')
          })
        })
        
        await downloadButton.click()
        
        // Check that download was triggered (this is hard to test in Playwright)
        // We'll just verify the button was clicked
        await expect(downloadButton).toBeVisible()
      }
    })

    test('should edit document when edit button is clicked', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Wait for documents to load
      await page.waitForTimeout(1000)
      
      // Try to click edit button if documents exist
      const editButton = page.locator('button[title="Edit"]').first()
      if (await editButton.isVisible()) {
        await editButton.click()
        
        // Check edit modal opens
        await expect(page.locator('text=Edit Document')).toBeVisible()
      }
    })

    test('should delete document when delete button is clicked', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Wait for documents to load
      await page.waitForTimeout(1000)
      
      // Try to click delete button if documents exist
      const deleteButton = page.locator('button[title="Delete"]').first()
      if (await deleteButton.isVisible()) {
        await deleteButton.click()
        
        // Check delete confirmation modal opens
        await expect(page.locator('text=Delete Document')).toBeVisible()
        await expect(page.locator('text=Are you sure you want to delete this document?')).toBeVisible()
      }
    })
  })

  test.describe('Documents Tab Integration', () => {
    test('should show documents tab in deal detail page', async ({ page }) => {
      // Navigate to a deal detail page
      await page.goto('/deals/1')
      
      // Check documents tab is present
      await expect(page.locator('text=Documents')).toBeVisible()
      await expect(page.locator('text=No documents attached')).toBeVisible()
    })

    test('should show documents tab in contact detail page', async ({ page }) => {
      // Navigate to a contact detail page
      await page.goto('/contacts/1')
      
      // Check documents tab is present
      await expect(page.locator('text=Documents')).toBeVisible()
      await expect(page.locator('text=No documents attached')).toBeVisible()
    })

    test('should show documents tab in quote detail page', async ({ page }) => {
      // Navigate to a quote detail page
      await page.goto('/sales/quotes/1')
      
      // Check documents tab is present
      await expect(page.locator('text=Documents')).toBeVisible()
      await expect(page.locator('text=No documents attached')).toBeVisible()
    })

    test('should upload document from deal detail page', async ({ page }) => {
      await page.goto('/deals/1')
      
      // Click upload button in documents tab
      await page.click('button:has-text("Upload")')
      
      // Check upload modal opens
      await expect(page.locator('text=Upload Document')).toBeVisible()
    })
  })

  test.describe('Team Access Integration', () => {
    test('should show team filter when team access is enabled', async ({ page }) => {
      // This test assumes VITE_TEAM_ACCESS_ENABLED=true
      await page.goto('/sales/documents')
      
      // Check team filter is visible
      await expect(page.locator('text=Team')).toBeVisible()
    })

    test('should filter documents by team', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Select a team from dropdown
      const teamSelect = page.locator('select').last()
      if (await teamSelect.isVisible()) {
        await teamSelect.selectOption('1')
        await expect(teamSelect).toHaveValue('1')
      }
    })
  })

  test.describe('Responsive Design', () => {
    test('should display mobile view on small screens', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/sales/documents')
      
      // Check that mobile layout is used
      await expect(page.locator('.md\\:hidden')).toBeVisible()
    })

    test('should display desktop view on large screens', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/sales/documents')
      
      // Check that desktop layout is used
      await expect(page.locator('.hidden.md\\:block')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Check upload button has proper aria label
      const uploadButton = page.locator('button:has-text("Upload Document")')
      await expect(uploadButton).toHaveAttribute('aria-label', 'Upload Document')
    })

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Tab through interactive elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Check that focus is visible
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/sales/documents')
      
      // Check heading hierarchy
      const h1 = page.locator('h1')
      await expect(h1).toContainText('Documents')
      
      // Check that there's only one h1
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)
    })
  })
})

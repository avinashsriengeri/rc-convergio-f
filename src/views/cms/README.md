# CMS Module - Views

This folder contains all the main views for the CMS/Content Platform module.

## Views Overview

### **CmsLayout.vue**
Main layout wrapper for the CMS module.
- Top navigation with module links
- Domain and Language settings access
- Wraps all child views

**Route:** `/cms`

---

### **PagesView.vue**
Pages management dashboard.
- List all pages with filters
- Search functionality
- Create, edit, delete, publish/unpublish actions
- Bulk operations

**Route:** `/cms/pages`

**Features:**
- Filter by status, language, access level
- Real-time search
- One-click publish/unpublish
- Page duplication
- Quick actions menu

---

### **PageEditor.vue**
The heart of the CMS - drag-and-drop page builder.

**Route:** `/cms/editor/:id` (`:id` can be "new" for new pages)

**Features:**
- Drag-and-drop component library
- Real-time visual editing
- Responsive preview (Desktop/Tablet/Mobile)
- Component properties panel
- SEO settings access
- Personalization rules
- Access control
- A/B testing
- Save draft / Publish

**Components Used:**
- Left Sidebar: Component library
- Center: Canvas with draggable components
- Right Sidebar: Properties editor
- Top Bar: Actions and preview modes

---

### **TemplatesView.vue**
Template marketplace and management.

**Route:** `/cms/templates`

**Features:**
- Browse templates by category
- Preview templates
- Use templates to create new pages
- Create custom templates
- Edit and delete templates

**Categories:**
- Landing Page
- Blog
- E-commerce
- Portfolio
- Business

---


### **MembershipsView.vue**
Subscription upgrade page for advanced features.

**Route:** `/cms/memberships`

**Purpose:** Promote subscription for advanced page, blog, and landing page creation

**Features Promoted:**
- Premium page templates
- Professional blog system
- Advanced landing pages
- Premium components & layouts

**Subscription:** $29/month or $290/year (17% savings)

**Contact:** sales@convergio.world for subscription purchase

---

## Component Dependencies

Each view uses various components from:

### `src/components/cms/builder/`
- HeroComponent.vue
- TextComponent.vue
- ImageComponent.vue
- FormComponent.vue
- CtaComponent.vue
- ComponentProperties.vue

### `src/components/cms/panels/`
- SeoPanel.vue (used in page editor)
- PersonalizationPanel.vue
- AccessControlPanel.vue
- AbTestPanel.vue

### `src/components/cms/`
- DomainSettingsModal.vue
- LanguageSettingsModal.vue
- PreviewModal.vue

---

## State Management

All views use the CMS Pinia store:

```javascript
import { useCmsStore } from '@/stores/cms';

const cmsStore = useCmsStore();
```

**Store Methods:**
- `fetchPages()` - Load all pages
- `fetchPage(id)` - Load single page
- `createPage(page)` - Create new page
- `updatePage(id, page)` - Update page
- `deletePage(id)` - Delete page
- `publishPage(id)` - Publish page
- `unpublishPage(id)` - Unpublish page
- ... and more

---

## API Integration

All API calls are handled through:

```javascript
import cmsService from '@/services/cms';
```

The service provides methods for all CMS operations.

---

## Routing

Routes are defined in `src/router.js`:

```javascript
{
  path: '/cms',
  component: CmsLayout,
  redirect: '/cms/pages',
  children: [
    { path: 'pages', component: PagesView },
    { path: 'editor/:id', component: PageEditor },
    { path: 'templates', component: TemplatesView },
    { path: 'ab-testing', component: AbTestingView },
    { path: 'memberships', component: MembershipsView }
  ]
}
```

---

## Development

### Adding a New View

1. Create `YourView.vue` in this folder
2. Add route in `src/router.js`
3. Add navigation link in `CmsLayout.vue`
4. Use CMS store for state management
5. Follow existing patterns

### Styling

All views use:
- TailwindCSS utility classes
- Consistent spacing (p-4, p-6, mb-4, etc.)
- Color scheme: Blue (#3B82F6) primary
- Responsive design patterns
- Heroicons for icons

### Mock Data

All views include mock data for testing without backend:
- Check `onMounted()` hooks
- Mock data in catch blocks
- Fallback to sample data

---

## Testing

To test views without backend:

1. Run dev server: `npm run dev`
2. Navigate to `/cms`
3. All features work with mock data
4. Check browser console for any errors

---

## Best Practices

1. **Always use the store** for data operations
2. **Handle loading states** with spinners
3. **Show empty states** with helpful messages
4. **Add error handling** with try/catch
5. **Make it responsive** on all devices
6. **Use semantic HTML** for accessibility
7. **Add meaningful alt text** for images
8. **Test all user flows** before committing

---

## Common Patterns

### Fetching Data
```javascript
onMounted(async () => {
  try {
    await cmsStore.fetchPages();
  } catch (error) {
    // Handle error or use mock data
  }
});
```

### Loading State
```vue
<div v-if="cmsStore.loading">
  <LoadingSpinner />
</div>
<div v-else>
  <!-- Content -->
</div>
```

### Empty State
```vue
<div v-if="items.length === 0">
  <EmptyState />
</div>
```

### Error Handling
```javascript
try {
  await cmsStore.createPage(page);
  alert('Success!');
} catch (error) {
  alert('Failed to create page');
}
```

---

## File Sizes

| View | Lines of Code |
|------|---------------|
| PageEditor.vue | ~800 |
| PagesView.vue | ~300 |
| CmsLayout.vue | ~150 |
| TemplatesView.vue | ~250 |
| MembershipsView.vue | ~350 |

**Total: ~2,100 lines**

---

## Support

For questions or issues:
1. Check parent documentation: `../../../CMS_MODULE_DOCUMENTATION.md`
2. Review component source code
3. Check store methods in `src/stores/cms.ts`
4. Test with mock data first

---

**Happy Coding! 🚀**





# Documents Module Components

This directory contains the Vue 3 components for the Documents module, providing document management functionality integrated with the existing RC Convergio application.

## Components Overview

### DocumentsLibrary.vue
The main documents library page component that displays all documents with filtering, sorting, and management capabilities.

**Props:** None (uses route parameters)

**Features:**
- Document listing with grid/table view
- Advanced filtering (search, file type, visibility, team)
- Sorting by date, title, size, views
- Pagination
- Upload, edit, delete, download actions
- Mobile responsive design
- Team access integration

**Usage:**
```vue
<DocumentsLibrary />
```

### DocumentsTab.vue
A tab component for displaying documents related to specific entities (deals, contacts, quotes).

**Props:**
- `relatedType` (string, required): The type of related entity ('deal', 'contact', 'quote')
- `relatedId` (number|string, required): The ID of the related entity

**Features:**
- Shows documents linked to specific entities
- Upload documents directly to entities
- Compact list view optimized for tabs
- Permission-based action visibility

**Usage:**
```vue
<DocumentsTab relatedType="deal" :relatedId="123" />
<DocumentsTab relatedType="contact" :relatedId="456" />
<DocumentsTab relatedType="quote" :relatedId="789" />
```

### DocumentUploadModal.vue
Modal component for uploading new documents with metadata.

**Props:**
- `relatedType` (string, optional): Type of related entity for automatic linking
- `relatedId` (number|string, optional): ID of related entity for automatic linking

**Events:**
- `@close`: Emitted when modal is closed
- `@uploaded`: Emitted when document is successfully uploaded (payload: document object)

**Features:**
- Drag & drop file upload
- File type and size validation
- Metadata input (title, description, visibility, owner)
- Progress indication
- Error handling

**Usage:**
```vue
<DocumentUploadModal
  :relatedType="'deal'"
  :relatedId="123"
  @close="showUploadModal = false"
  @uploaded="handleDocumentUploaded"
/>
```

### DocumentEditModal.vue
Modal component for editing document metadata.

**Props:**
- `document` (object, required): The document object to edit

**Events:**
- `@close`: Emitted when modal is closed
- `@updated`: Emitted when document is successfully updated (payload: updated document object)

**Features:**
- Edit title, description, visibility
- Owner assignment (admin only)
- File information display
- Validation

**Usage:**
```vue
<DocumentEditModal
  :document="selectedDocument"
  @close="showEditModal = false"
  @updated="handleDocumentUpdated"
/>
```

### DocumentDeleteModal.vue
Confirmation modal for deleting documents.

**Props:**
- `document` (object, required): The document object to delete

**Events:**
- `@close`: Emitted when modal is closed
- `@deleted`: Emitted when document is successfully deleted

**Features:**
- Document information display
- Warning about permanent deletion
- Confirmation required

**Usage:**
```vue
<DocumentDeleteModal
  :document="selectedDocument"
  @close="showDeleteModal = false"
  @deleted="handleDocumentDeleted"
/>
```

### DocumentPreviewModal.vue
Modal component for previewing documents.

**Props:**
- `document` (object, required): The document object to preview

**Events:**
- `@close`: Emitted when modal is closed

**Features:**
- PDF preview with iframe
- Image preview
- Text file preview
- Download option
- Unsupported file type handling

**Usage:**
```vue
<DocumentPreviewModal
  :document="selectedDocument"
  @close="showPreviewModal = false"
/>
```

## API Endpoints Used

The components interact with the following API endpoints:

- `GET /api/documents` - List documents with filtering
- `POST /api/documents` - Upload new document
- `GET /api/documents/:id` - Get document metadata
- `PUT /api/documents/:id` - Update document metadata
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/download` - Download document file
- `GET /api/documents/analytics` - Get document analytics
- `POST /api/documents/:id/link` - Link document to entity
- `DELETE /api/documents/:id/link` - Unlink document from entity

## Dependencies

### Composables
- `useDocuments()` - Main state management and API interactions
- `useContext()` - Tenant and team context
- `usePermission()` - Permission checking
- `useNotifications()` - User notifications

### Services
- `documentsService` - API service for document operations
- `documentsHelpers` - Utility functions for file handling

### UI Components
- `BaseButton` - Consistent button styling
- `BaseModal` - Modal wrapper (if available)

## File Type Support

### Allowed File Types
- Documents: PDF, DOC, DOCX, TXT
- Spreadsheets: XLS, XLSX
- Presentations: PPT, PPTX
- Images: JPG, JPEG, PNG, GIF, SVG
- Videos: MP4, AVI, MOV
- Archives: ZIP, RAR, 7Z

### File Size Limits
- Maximum file size: 50MB
- Validation performed on both client and server

### Preview Support
- PDF files: Full preview with iframe
- Images: Direct display
- Text files: Content display
- Other types: Download only

## Permission System

### Visibility Levels
- **Private**: Only owner can view/edit
- **Team**: Team members can view/edit
- **Tenant**: All tenant users can view/edit
- **Public**: Anyone can view

### Permission Checks
- `canView(document)`: Check if user can view document
- `canEdit(document)`: Check if user can edit document
- `canDelete(document)`: Check if user can delete document
- `canCreate()`: Check if user can upload documents

## Team Access Integration

When `VITE_TEAM_ACCESS_ENABLED=true`:
- Team filter is shown in DocumentsLibrary
- Team badges are displayed on documents
- Team-based permission filtering
- Team dropdown in upload modal

When disabled:
- Team-related UI is hidden
- All documents are tenant-scoped

## Styling

Components use Tailwind CSS classes and follow the existing design system:
- Consistent color scheme with app theme
- Responsive design for mobile/desktop
- Accessibility features (ARIA labels, keyboard navigation)
- Loading states and error handling

## Error Handling

- Network errors are caught and displayed as notifications
- File validation errors are shown inline
- Permission errors redirect appropriately
- Graceful fallbacks for missing data

## Browser Support

- Modern browsers with ES6+ support
- File API support for uploads
- Blob API support for downloads
- CSS Grid and Flexbox support

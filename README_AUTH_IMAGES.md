# Authentication Pages Image Setup Guide

This guide explains how to add the required background images for the authentication pages (Login, Register, ForgotPassword, ResetPassword).

## Required Images

### 1. Convergio Business Transformation Suite Image (Primary)
- **File Name**: `convergio-business-transformation-suite.png`
- **Location**: `public/convergio-business-transformation-suite.png`
- **Usage**: Displayed in the left panel of Login and Register pages
- **Format**: PNG or JPG
- **Recommended Size**: 400-600px width, maintain aspect ratio
- **Description**: Professional business transformation/dashboard style image representing RC Convergio's business transformation suite

### 2. Legacy Images (Optional - for reference)
These were previously used but are now replaced by the main image above:

- **Login/Forgot/Reset Password**: `cd8e7bd3-50c8-4ffa-bf17-ff2fbea0a921.png`
- **Register**: `5cda467d-2722-4920-9954-97e95df7f037.png`

## Setup Instructions

### Step 1: Add the Main Image
1. Obtain your "Convergio Business Transformation Suite" image
2. Rename it to: `convergio-business-transformation-suite.png`
3. Place it in the `public/` directory of your project
4. The image will automatically appear in the left panel of both Login and Register pages

### Step 2: Image Requirements
- Professional business transformation/dashboard style
- Clean, modern design that fits the dark theme
- Should not contain text that conflicts with the UI text
- High quality and professional appearance
- Should represent RC Convergio's business transformation suite

### Step 3: Verify Setup
1. Start your development server: `npm run dev`
2. Navigate to `/login` and `/register` pages
3. The image should appear in the left panel within the glassmorphism card
4. The image should be properly sized and not overlap with text or forms

## Design Features

### Current Implementation
- **Split-screen layout**: Left side for branding & image, right side for forms
- **Glassmorphism effect**: Semi-transparent cards with backdrop blur
- **Dark theme**: Gradient background with professional styling
- **Responsive design**: Left panel hides on mobile devices
- **No overlap**: Image is contained within its designated area and doesn't interfere with text or forms

### Image Styling
- Rounded corners with shadow
- Responsive sizing (max-height: 300px)
- Object-contain to maintain aspect ratio
- Centered within the left panel card

## Troubleshooting

### Image Not Showing
1. Check that the file is named exactly: `convergio-business-transformation-suite.png`
2. Verify the file is in the `public/` directory
3. Clear browser cache and refresh the page
4. Check browser console for any 404 errors

### Image Too Large/Small
- The image is automatically resized to fit within the container
- If the image appears too small, use a higher resolution image
- If the image appears too large, the container will maintain the max-height constraint

### Performance Issues
- Optimize the image file size (recommend under 500KB)
- Use WebP format for better compression if supported
- Consider using different image sizes for different screen resolutions

## Notes
- All authentication functionality remains unchanged
- The image integration is purely visual and doesn't affect form submission or API calls
- The design is fully responsive and works on all device sizes
- The glassmorphism effect creates a modern, professional appearance

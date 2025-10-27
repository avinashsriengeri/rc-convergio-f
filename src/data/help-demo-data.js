/**
 * Demo data for Help Center testing
 * This file provides sample data when the backend APIs are not available
 */

export const demoCategories = [
  {
    id: 27,
    name: 'Getting Started',
    description: 'Learn the basics of using our platform',
    color: '#3B82F6',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 28,
    name: 'Account & Billing',
    description: 'Manage your account settings and billing information',
    color: '#10B981',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 29,
    name: 'Troubleshooting',
    description: 'Technical issues and troubleshooting guides',
    color: '#F59E0B',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 30,
    name: 'Integrations',
    description: 'Connect with third-party services and APIs',
    color: '#8B5CF6',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const demoArticles = [
  {
    id: 1,
    title: 'Welcome to RC Convergio',
    slug: 'welcome-to-rc-convergio',
    summary: 'Get started with RC Convergio CRM and learn the basics of managing your business relationships.',
    content: `# Welcome to RC Convergio

RC Convergio is a comprehensive CRM platform designed to help you manage your business relationships, track deals, and grow your business.

## Getting Started

1. **Set up your profile** - Complete your user profile with accurate information
2. **Import your contacts** - Upload your existing contact database
3. **Create your first deal** - Start tracking your sales pipeline
4. **Set up your team** - Invite team members and assign roles

## Key Features

- **Contact Management** - Organize and track all your business contacts
- **Deal Tracking** - Monitor your sales pipeline and forecast revenue
- **Task Management** - Stay on top of your daily activities
- **Email Integration** - Sync your emails with contacts and deals
- **Reporting** - Get insights into your business performance

## Need Help?

If you have any questions, don't hesitate to reach out to our support team. We're here to help you succeed!`,
    category_id: 27,
    category: demoCategories[0],
    status: 'published',
    view_count: 1250,
    helpful_count: 45,
    not_helpful_count: 3,
    tags: ['getting-started', 'basics', 'introduction'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'How to Create and Manage Contacts',
    slug: 'create-manage-contacts',
    summary: 'Learn how to add new contacts, organize them, and keep your contact database up to date.',
    content: `# Creating and Managing Contacts

Contacts are the foundation of your CRM. Here's how to effectively manage them.

## Adding New Contacts

### Manual Entry
1. Click the **"Add Contact"** button
2. Fill in the contact information
3. Add custom fields if needed
4. Save the contact

### Import from CSV
1. Go to **Contacts > Import**
2. Download the template
3. Fill in your contact data
4. Upload the CSV file
5. Map the fields correctly
6. Review and import

## Organizing Contacts

### Tags
Use tags to categorize your contacts:
- **Lead** - Potential customers
- **Customer** - Active customers
- **Partner** - Business partners
- **Vendor** - Suppliers

### Custom Fields
Create custom fields for specific information:
- Industry
- Company size
- Lead source
- Preferred contact method

## Best Practices

- Keep contact information up to date
- Use consistent naming conventions
- Add notes after each interaction
- Set follow-up reminders`,
    category_id: 27,
    category: demoCategories[0],
    status: 'published',
    view_count: 890,
    helpful_count: 32,
    not_helpful_count: 2,
    tags: ['contacts', 'management', 'organization'],
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-14T15:20:00Z'
  },
  {
    id: 3,
    title: 'Understanding Your Account Settings',
    slug: 'account-settings-guide',
    summary: 'Configure your account preferences, notification settings, and user profile.',
    content: `# Account Settings Guide

Your account settings allow you to customize your RC Convergio experience.

## Profile Settings

### Personal Information
- Update your name and email
- Add a profile picture
- Set your timezone
- Choose your language preference

### Security
- Change your password
- Enable two-factor authentication
- Manage API keys
- View login history

## Notification Preferences

### Email Notifications
- Deal updates
- Task reminders
- System announcements
- Weekly reports

### In-App Notifications
- Real-time updates
- Desktop notifications
- Mobile push notifications

## Privacy Settings

- Data sharing preferences
- Cookie settings
- Export your data
- Delete your account

## Integration Settings

- Email providers
- Calendar sync
- Third-party apps
- Webhook configurations`,
    category_id: 28,
    category: demoCategories[1],
    status: 'published',
    view_count: 650,
    helpful_count: 28,
    not_helpful_count: 1,
    tags: ['account', 'settings', 'preferences'],
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    title: 'Billing and Subscription Management',
    slug: 'billing-subscription-management',
    summary: 'Learn how to manage your subscription, update payment methods, and understand your billing.',
    content: `# Billing and Subscription Management

Manage your RC Convergio subscription and billing information.

## Subscription Plans

### Starter Plan
- Up to 1,000 contacts
- Basic reporting
- Email support
- $29/month

### Professional Plan
- Up to 10,000 contacts
- Advanced reporting
- Priority support
- $79/month

### Enterprise Plan
- Unlimited contacts
- Custom reporting
- Dedicated support
- Custom pricing

## Payment Methods

### Adding a Payment Method
1. Go to **Settings > Billing**
2. Click **"Add Payment Method"**
3. Enter your card details
4. Save the payment method

### Updating Payment Information
1. Select the payment method
2. Click **"Edit"**
3. Update the information
4. Save changes

## Billing History

View and download your invoices:
- Monthly statements
- Annual summaries
- Tax documents
- Payment receipts

## Troubleshooting

### Payment Issues
- Check card expiration
- Verify billing address
- Contact your bank
- Try a different payment method

### Subscription Changes
- Upgrade/downgrade plans
- Pause subscription
- Cancel subscription
- Reactivate account`,
    category_id: 29,
    category: demoCategories[2],
    status: 'published',
    view_count: 420,
    helpful_count: 18,
    not_helpful_count: 4,
    tags: ['billing', 'subscription', 'payments'],
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-12T14:45:00Z'
  },
  {
    id: 5,
    title: 'Troubleshooting Common Issues',
    slug: 'troubleshooting-common-issues',
    summary: 'Solutions to the most common technical issues and how to resolve them.',
    content: `# Troubleshooting Common Issues

Here are solutions to the most frequently encountered problems.

## Login Issues

### Forgot Password
1. Click **"Forgot Password"** on login page
2. Enter your email address
3. Check your email for reset link
4. Follow the instructions

### Account Locked
- Too many failed login attempts
- Contact support to unlock
- Wait 15 minutes and try again

## Performance Issues

### Slow Loading
- Check your internet connection
- Clear browser cache
- Disable browser extensions
- Try a different browser

### Data Not Syncing
- Refresh the page
- Check your internet connection
- Log out and log back in
- Contact support if issue persists

## Email Integration

### Gmail Not Working
- Check OAuth permissions
- Re-authorize the connection
- Verify IMAP settings
- Contact support

### Outlook Issues
- Update Outlook version
- Check server settings
- Verify credentials
- Try alternative method

## Mobile App Issues

### App Crashes
- Update to latest version
- Restart the app
- Clear app cache
- Reinstall if necessary

### Sync Problems
- Check internet connection
- Force sync in settings
- Log out and back in
- Contact support

## Still Need Help?

If you're still experiencing issues:
1. Check our status page
2. Search our knowledge base
3. Contact our support team
4. Submit a support ticket`,
    category_id: 30,
    category: demoCategories[3],
    status: 'published',
    view_count: 780,
    helpful_count: 35,
    not_helpful_count: 8,
    tags: ['troubleshooting', 'technical', 'support'],
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-11T11:30:00Z'
  }
]

export const demoAnalytics = {
  total_articles: 5,
  total_views: 3990,
  total_helpful: 158,
  total_not_helpful: 18,
  satisfaction_rate: 89.8,
  top_articles: demoArticles.slice(0, 5),
  category_stats: [
    {
      id: 1,
      name: 'Getting Started',
      article_count: 2,
      total_views: 2140,
      color: '#3B82F6'
    },
    {
      id: 2,
      name: 'Account Management',
      article_count: 1,
      total_views: 650,
      color: '#10B981'
    },
    {
      id: 3,
      name: 'Billing & Payments',
      article_count: 1,
      total_views: 420,
      color: '#F59E0B'
    },
    {
      id: 4,
      name: 'Technical Support',
      article_count: 1,
      total_views: 780,
      color: '#EF4444'
    }
  ],
  recent_activity: [
    {
      id: 1,
      article_title: 'Welcome to RC Convergio',
      action: 'view',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      article_title: 'How to Create and Manage Contacts',
      action: 'helpful',
      created_at: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      article_title: 'Troubleshooting Common Issues',
      action: 'not_helpful',
      created_at: '2024-01-15T08:45:00Z'
    },
    {
      id: 4,
      article_title: 'Understanding Your Account Settings',
      action: 'view',
      created_at: '2024-01-15T07:20:00Z'
    },
    {
      id: 5,
      article_title: 'Billing and Subscription Management',
      action: 'helpful',
      created_at: '2024-01-15T06:10:00Z'
    }
  ]
}

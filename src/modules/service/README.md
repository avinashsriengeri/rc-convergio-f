# Service Platform - Ticketing Module

This module provides a complete ticketing system for the RC Convergio application, following the same architecture patterns as the existing Sales Platform and Documents modules.

## 🏗️ Architecture

The module follows a modular structure with clear separation of concerns:

```
src/modules/service/
├── api/
│   └── serviceTickets.js      # API layer with environment-based integration
├── components/
│   ├── TicketList.vue         # Main tickets listing with filters
│   ├── TicketDetail.vue       # Individual ticket view with messages
│   ├── TicketReplyBox.vue     # Reply/message input component
│   ├── TicketStatsCard.vue    # Statistics dashboard cards
│   ├── StatusBadge.vue        # Status indicator component
│   ├── PriorityBadge.vue      # Priority indicator component
│   └── SLABadge.vue          # SLA status indicator component
├── pages/
│   ├── ServicePlatform.vue    # Parent layout with navigation
│   ├── TicketsView.vue        # Main tickets listing page
│   └── TicketDetailView.vue   # Individual ticket detail page
├── store/
│   └── serviceTickets.js      # Pinia store for state management
└── README.md                  # This documentation
```

## 🚀 Features

### Core Functionality
- **Ticket Management**: Create, view, update, and close tickets
- **Message Threading**: Full conversation history with internal/external notes
- **Status Tracking**: Open, In Progress, Resolved, Closed states
- **Priority Levels**: Low, Medium, High, Urgent priorities
- **SLA Monitoring**: Track response times and SLA breaches
- **Assignment**: Assign tickets to specific agents
- **Search & Filtering**: Advanced filtering by status, priority, assignee
- **Statistics Dashboard**: Real-time metrics and KPIs

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live data refresh and notifications
- **Intuitive Navigation**: Breadcrumb navigation and sidebar menus
- **Consistent Styling**: Follows existing Tailwind design system
- **Loading States**: Proper loading indicators and error handling
- **Accessibility**: ARIA labels and keyboard navigation support

## 🔧 Integration

### Environment Configuration
The module uses environment-based API integration with no hardcoded URLs:
- `VITE_API_BASE_URL` → Base URL for all API calls
- All requests use the existing Axios instance with authentication

### API Endpoints
The module expects the following backend endpoints:
- `GET /service/tickets` - List tickets with filtering
- `GET /service/tickets/:id` - Get ticket details
- `POST /service/tickets` - Create new ticket
- `PUT /service/tickets/:id` - Update ticket
- `POST /service/tickets/:id/messages` - Add message/reply
- `POST /service/tickets/:id/close` - Close ticket
- `GET /service/tickets/stats/overview` - Get statistics

### State Management
Uses Pinia store with reactive state management:
- Tickets list with pagination
- Selected ticket details
- Statistics and metrics
- Loading and error states
- Filter and search state

## 🎨 Design System

### Color Scheme
- **Open**: Blue (`bg-blue-100 text-blue-800`)
- **In Progress**: Amber (`bg-amber-100 text-amber-800`)
- **Resolved**: Green (`bg-green-100 text-green-800`)
- **Closed**: Gray (`bg-gray-100 text-gray-800`)
- **SLA On Track**: Green (`bg-green-100 text-green-800`)
- **SLA Breached**: Red (`bg-red-100 text-red-800`)

### Components
All components follow the existing design patterns:
- Consistent button styles and hover effects
- Standard card layouts with shadows
- Form inputs with focus states
- Modal dialogs with backdrop
- Table layouts with hover states

## 🧭 Navigation

### Routes
- `/service` - Main tickets listing
- `/service/:id` - Individual ticket detail
- Additional filtered routes can be added as needed

### Sidebar Integration
The module integrates seamlessly with the existing sidebar navigation:
- Service Platform appears in main sidebar
- Sub-navigation shows when on service routes
- Consistent styling with Sales Platform

## 🔒 Security & Permissions

### Authentication
- All routes require authentication (`requiresAuth: true`)
- Uses existing auth token from localStorage
- Automatic token refresh handling

### Permissions
- Follows existing permission patterns
- Can be extended with role-based access control
- Team/tenant isolation support ready

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px - Stacked layout, simplified navigation
- **Tablet**: 768px - 1024px - Hybrid layout with collapsible sidebar
- **Desktop**: > 1024px - Full sidebar with all features

### Mobile Features
- Touch-friendly buttons and inputs
- Swipe gestures for navigation
- Optimized table layouts
- Collapsible sections

## 🧪 Testing

### Component Testing
Each component is designed to be easily testable:
- Props validation with TypeScript-style interfaces
- Event emission for parent communication
- Computed properties for derived state
- Clear separation of concerns

### Integration Testing
- API integration follows existing patterns
- Error handling matches application standards
- Loading states provide user feedback
- Navigation works with existing router

## 🚀 Future Enhancements

### Planned Features
- **File Attachments**: Upload and download files
- **Email Integration**: Send/receive emails
- **Automation Rules**: Auto-assignment and routing
- **Knowledge Base**: Integrated help articles
- **Reporting**: Advanced analytics and reports
- **Mobile App**: Native mobile application

### Extensibility
The module is designed for easy extension:
- Plugin architecture for custom fields
- Webhook support for external integrations
- API versioning for backward compatibility
- Theme customization support

## 📚 Usage Examples

### Creating a Ticket
```javascript
import { useServiceTicketsStore } from '@/modules/service/store/serviceTickets'

const ticketsStore = useServiceTicketsStore()
await ticketsStore.createTicket({
  subject: 'Login issue',
  description: 'User cannot log in to the system',
  priority: 'high',
  category: 'Technical'
})
```

### Fetching Tickets
```javascript
// Load all tickets
await ticketsStore.fetchTickets()

// Load with filters
await ticketsStore.fetchTickets({
  status: 'open',
  priority: 'high',
  search: 'login'
})
```

### Adding a Reply
```javascript
await ticketsStore.addMessage(ticketId, {
  message: 'I have resolved this issue',
  is_internal: false
})
```

## 🤝 Contributing

When contributing to this module:
1. Follow existing code patterns and conventions
2. Maintain consistent styling with Tailwind classes
3. Add proper error handling and loading states
4. Update this documentation for new features
5. Test on multiple screen sizes
6. Ensure accessibility compliance

## 📄 License

This module is part of the RC Convergio application and follows the same licensing terms.


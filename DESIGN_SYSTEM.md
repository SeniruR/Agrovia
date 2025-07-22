# Agrovia Design System Guide

## Overview
This guide provides comprehensive documentation for maintaining UI consistency across the Agrovia platform. Follow these guidelines to ensure a cohesive user experience.

## 🎨 Brand Colors

### Primary Palette (Agrovia Green)
```javascript
// Primary green colors - use these for main brand elements
agrovia-50: '#f0fdf4'   // Very light backgrounds
agrovia-100: '#dcfce7'  // Light backgrounds, badges
agrovia-200: '#bbf7d0'  // Soft accents
agrovia-300: '#86efac'  // Medium accents
agrovia-400: '#4ade80'  // Interactive elements
agrovia-500: '#22c55e'  // PRIMARY BRAND COLOR
agrovia-600: '#16a34a'  // Hover states
agrovia-700: '#15803d'  // Active states
agrovia-800: '#166534'  // Dark text
agrovia-900: '#14532d'  // Very dark text
```

### Semantic Colors
```javascript
// Success (use for positive actions, completed states)
success: { light: '#dcfce7', main: '#22c55e', dark: '#15803d' }

// Warning (use for attention, pending states)
warning: { light: '#fef3c7', main: '#f59e0b', dark: '#b45309' }

// Error (use for errors, failed states, danger)
error: { light: '#fee2e2', main: '#ef4444', dark: '#b91c1c' }

// Info (use for information, processing states)
info: { light: '#dbeafe', main: '#3b82f6', dark: '#1d4ed8' }
```

## 🔧 Components Usage

### Buttons
```jsx
import { Button } from '../components/ui';

// Primary button (main actions)
<Button variant="primary" onClick={handleSave}>
  Save Changes
</Button>

// Secondary button (less important actions)
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

// Outline button (alternative actions)
<Button variant="outline" onClick={handleEdit}>
  Edit
</Button>

// With icon
<Button variant="primary" icon={Plus}>
  Add Item
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Cards
```jsx
import { Card } from '../components/ui';

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Interactive card with hover effect
<Card hover>
  <h3>Hover me!</h3>
</Card>

// Different padding sizes
<Card padding="sm">Small padding</Card>
<Card padding="lg">Large padding</Card>
```

### Status Badges
```jsx
import { Badge } from '../components/ui';

// Using status prop (automatically maps to correct colors)
<Badge status="completed">Completed</Badge>
<Badge status="pending">Pending</Badge>
<Badge status="available">Available</Badge>

// Using variant prop
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>

// With icon
<Badge status="completed" icon={CheckCircle}>
  Order Complete
</Badge>
```

### Form Inputs
```jsx
import { Input } from '../components/ui';

// Basic input
<Input 
  label="Email Address"
  type="email"
  placeholder="Enter your email"
/>

// Input with icon
<Input 
  label="Search"
  icon={Search}
  placeholder="Search crops..."
/>

// Input with error
<Input 
  label="Phone Number"
  error="Please enter a valid phone number"
  value={phoneNumber}
  onChange={setPhoneNumber}
/>

// Input with helper text
<Input 
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>
```

## 📐 Layout Components

### Container
```jsx
import { Container } from '../components/ui';

// Standard container
<Container>
  Content goes here
</Container>

// Different sizes
<Container size="sm">Smaller container</Container>
<Container size="lg">Larger container</Container>
<Container size="full">Full width</Container>
```

### Grid
```jsx
import { Grid } from '../components/ui';

// 3-column responsive grid
<Grid cols={3} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// 4-column with large gap
<Grid cols={4} gap="lg">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
  <Card>Card 4</Card>
</Grid>
```

## 🎯 Status Color Mapping

### Order/Delivery Status
```javascript
pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
processing: 'bg-blue-100 text-blue-800 border-blue-200'
completed: 'bg-green-100 text-green-800 border-green-200'
delivered: 'bg-green-100 text-green-800 border-green-200'
cancelled: 'bg-red-100 text-red-800 border-red-200'
rejected: 'bg-red-100 text-red-800 border-red-200'
```

### Crop Status
```javascript
available: 'bg-green-100 text-green-800 border-green-200'
'ready-to-harvest': 'bg-green-100 text-green-800 border-green-200'
growing: 'bg-yellow-100 text-yellow-800 border-yellow-200'
planted: 'bg-blue-100 text-blue-800 border-blue-200'
sold: 'bg-gray-100 text-gray-800 border-gray-200'
reserved: 'bg-yellow-100 text-yellow-800 border-yellow-200'
```

### Priority Levels
```javascript
urgent: 'bg-red-100 text-red-700 border-red-200'
high: 'bg-orange-100 text-orange-700 border-orange-200'
medium: 'bg-yellow-100 text-yellow-700 border-yellow-200'
low: 'bg-green-100 text-green-700 border-green-200'
```

## 📝 Typography Guidelines

### Headings
```jsx
// Use consistent heading hierarchy
<h1 className="text-3xl font-bold text-neutral-900">Page Title</h1>
<h2 className="text-2xl font-bold text-neutral-900">Section Title</h2>
<h3 className="text-xl font-semibold text-neutral-900">Subsection</h3>
```

### Body Text
```jsx
// Primary text
<p className="text-neutral-600">Main content text</p>

// Muted text
<p className="text-neutral-500 text-sm">Secondary information</p>

// Gradient text for brand emphasis
<h2 className="gradient-text">Agrovia Platform</h2>
```

## 🏗️ Layout Patterns

### Page Structure
```jsx
// Standard page layout
<div className="min-h-screen bg-neutral-50">
  <Container>
    <div className="py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Page Title</h1>
        <p className="text-neutral-600 mt-2">Page description</p>
      </div>
      
      {/* Main content */}
      <div className="space-y-6">
        <Card>
          {/* Card content */}
        </Card>
      </div>
    </div>
  </Container>
</div>
```

### Dashboard Cards
```jsx
// Stats card pattern
<Grid cols={4} gap="md" className="mb-8">
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-neutral-600">Total Crops</p>
        <p className="text-2xl font-bold text-neutral-900">24</p>
      </div>
      <div className="p-3 bg-agrovia-100 rounded-lg">
        <Package className="w-6 h-6 text-agrovia-600" />
      </div>
    </div>
  </Card>
</Grid>
```

## 🎭 Animation Classes

### Fade Animations
```jsx
// Fade in effect
<div className="animate-fade-in">Content</div>

// Fade in up effect
<div className="animate-fade-in-up">Content</div>
```

### Slide Animations
```jsx
// Slide in from left
<div className="animate-slide-in-left">Content</div>

// Slide in from right
<div className="animate-slide-in-right">Content</div>
```

### Hover Effects
```jsx
// Scale on hover
<Card className="hover:scale-105 transition-transform duration-200">
  Hover me!
</Card>

// Glow effect
<Button className="hover:glow-green">
  Glowing Button
</Button>
```

## ⚠️ Common Mistakes to Avoid

### ❌ Don't Do This
```jsx
// Using inconsistent colors
<span className="bg-lime-500 text-white">Status</span>

// Mixing different button styles
<button className="bg-blue-500 hover:bg-blue-600">Save</button>
<button className="bg-green-400 hover:bg-green-500">Cancel</button>

// Inconsistent spacing
<div className="p-3">
  <div className="mb-2">Item 1</div>
  <div className="mb-4">Item 2</div>
  <div className="mb-1">Item 3</div>
</div>
```

### ✅ Do This Instead
```jsx
// Use design system colors
<Badge status="active">Status</Badge>

// Use consistent button components
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>

// Use consistent spacing scale
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## 🔧 Utility Functions

### Getting Status Colors
```javascript
import { getStatusColor } from '../utils/designSystem';

// Automatically get the right color for any status
const statusClass = getStatusColor('completed'); // Returns consistent class string
```

### Using Design System Constants
```javascript
import { AGROVIA_DESIGN_SYSTEM, COMMON_CLASSES } from '../utils/designSystem';

// Access design tokens
const primaryColor = AGROVIA_DESIGN_SYSTEM.colors.primary[500];

// Use common classes
<div className={COMMON_CLASSES.card}>Card content</div>
```

## 📱 Responsive Guidelines

### Breakpoints
```javascript
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
```

### Mobile-First Approach
```jsx
// Always design mobile-first
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl">
    Responsive heading
  </h1>
</div>

// Use responsive grid
<Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

## 🚀 Getting Started

1. **Import the design system:**
   ```javascript
   import { Button, Card, Badge, Input } from '../components/ui';
   import { getStatusColor } from '../utils/designSystem';
   ```

2. **Use consistent colors:**
   ```jsx
   // Always use agrovia- colors for brand elements
   <div className="bg-agrovia-500 text-white">Brand element</div>
   ```

3. **Follow the component patterns:**
   ```jsx
   // Use the provided components instead of custom styling
   <Button variant="primary">Action</Button>
   <Badge status="completed">Status</Badge>
   ```

4. **Test responsiveness:**
   ```bash
   # Always test on different screen sizes
   # Use browser dev tools to test mobile, tablet, desktop
   ```

Remember: Consistency is key to a professional user experience. When in doubt, refer to this guide or ask the team!

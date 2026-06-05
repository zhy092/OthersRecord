# OpenClaw Design System

## Visual Theme & Atmosphere
- **Mood**: Professional, intelligent, and approachable
- **Density**: Clean and airy with balanced whitespace
- **Philosophy**: Editorial-inspired layout with clear hierarchy
- **Aesthetic**: Modern, minimal, and focused on content readability

## Color Palette & Roles
### Primary Colors
- **Claw Orange**: `#FF6B35` - Main brand color, used for CTAs and important accents
- **Deep Blue**: `#1A365D` - Primary text and background for dark mode
- **Warm White**: `#FFFFFF` - Background color for light mode

### Secondary Colors
- **Terracotta Accent**: `#D64045` - Secondary accent color, used for highlights
- **Soft Gray**: `#F7F7F7` - Light background and card surfaces
- **Medium Gray**: `#E2E8F0` - Dividers and subtle separators
- **Dark Gray**: `#4A5568` - Secondary text and labels

### Semantic Colors
- **Success**: `#38A169` - Success messages and indicators
- **Warning**: `#ED8936` - Warning messages and alerts
- **Error**: `#E53E3E` - Error messages and critical alerts
- **Info**: `#3182CE` - Informational messages and hints

## Typography Rules
### Font Families
- **Primary Font**: Inter, system-ui, sans-serif
- **Code Font**: Fira Code, monospace

### Type Scale
| Type | Size | Weight | Line Height | Letter Spacing | Use Case |
|------|------|--------|-------------|----------------|----------|
| H1 | 2.5rem (40px) | 600 | 1.2 | -0.025em | Hero headings |
| H2 | 2rem (32px) | 600 | 1.3 | -0.025em | Section headings |
| H3 | 1.5rem (24px) | 500 | 1.4 | 0 | Subheadings |
| H4 | 1.25rem (20px) | 500 | 1.5 | 0 | Sub-subheadings |
| Body | 1rem (16px) | 400 | 1.6 | 0 | Main content |
| Small | 0.875rem (14px) | 400 | 1.5 | 0 | Auxiliary text |
| Caption | 0.75rem (12px) | 400 | 1.4 | 0.05em | Captions and labels |

## Component Stylings
### Buttons
- **Primary Button**: Claw Orange background, white text, rounded corners (8px), hover effect with slight darkening
- **Secondary Button**: White background, Claw Orange border, rounded corners (8px), hover effect with light orange background
- **Outline Button**: Transparent background, Claw Orange border, rounded corners (8px), hover effect with light orange background
- **Disabled Button**: Gray background, light gray text, rounded corners (8px), reduced opacity

### Cards
- **Card Surface**: White background, subtle shadow, rounded corners (12px), 1px border (Medium Gray)
- **Card Header**: Slightly darker background, padding (16px), bottom border (1px Medium Gray)
- **Card Body**: Padding (20px), adequate line spacing
- **Card Footer**: Slightly darker background, padding (16px), top border (1px Medium Gray)

### Inputs
- **Text Input**: Light gray background, 1px border (Medium Gray), rounded corners (8px), focus state with Claw Orange border
- **Textarea**: Same as text input, with vertical resize handle
- **Select**: Same as text input, with custom dropdown arrow
- **Checkbox/Radio**: Claw Orange when checked, gray when unchecked, rounded corners

### Navigation
- **Primary Nav**: Horizontal, centered logo, evenly spaced links, active state with Claw Orange underline
- **Secondary Nav**: Vertical, grouped links, active state with Claw Orange background
- **Breadcrumbs**: Small text, gray separator, current page in Claw Orange

## Layout Principles
### Spacing Scale
- **0**: 0px
- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **5**: 20px
- **6**: 24px
- **8**: 32px
- **10**: 40px
- **12**: 48px
- **16**: 64px
- **20**: 80px

### Grid System
- **Container**: Max width 1200px, centered with auto margins
- **Columns**: 12-column grid with 24px gutters
- **Breakpoints**:
  - **Mobile**: < 640px
  - **Tablet**: 640px - 1024px
  - **Desktop**: > 1024px

### Whitespace Philosophy
- **Generous**: Use whitespace to create visual breathing room
- **Consistent**: Maintain consistent spacing between similar elements
- **Purposeful**: Use whitespace to guide the eye and emphasize important content

## Depth & Elevation
### Shadow System
- **Level 0**: No shadow (flat surface)
- **Level 1**: Subtle shadow for cards and raised elements
  ```css
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  ```
- **Level 2**: Medium shadow for modals and dropdowns
  ```css
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  ```
- **Level 3**: Strong shadow for popovers and tooltips
  ```css
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  ```

### Surface Hierarchy
- **Base**: Background (Warm White or Deep Blue)
- **Surface 1**: Cards and panels (White or slightly darker than background)
- **Surface 2**: Modals and dropdowns (White or darker surface)
- **Surface 3**: Tooltips and popovers (White or dark surface with strong shadow)

## Do's and Don'ts
### Do's
- **Use Claw Orange sparingly** for important elements and CTAs
- **Maintain consistent typography** across the site
- **Use whitespace effectively** to create a clean, readable layout
- **Ensure all interactive elements** have clear hover and focus states
- **Follow the grid system** for consistent alignment

### Don'ts
- **Don't use too many colors** - stick to the defined palette
- **Don't use overly decorative fonts** - keep it clean and readable
- **Don't clutter the interface** - prioritize content and functionality
- **Don't ignore responsive design** - ensure the site works well on all devices
- **Don't use excessive shadows** - keep them subtle and purposeful

## Responsive Behavior
### Breakpoints
- **Mobile**: < 640px - Single column layout, stacked elements
- **Tablet**: 640px - 1024px - Two column layout where appropriate
- **Desktop**: > 1024px - Full grid layout, multi-column content

### Touch Targets
- **Minimum Size**: 44px × 44px for all interactive elements
- **Spacing**: At least 8px between touch targets
- **Gestures**: Support common touch gestures (tap, swipe, pinch)

### Content Adaptation
- **Typography**: Scale down font sizes slightly on smaller screens
- **Images**: Use responsive images that scale with their container
- **Navigation**: Collapse primary navigation into a hamburger menu on mobile

## Agent Prompt Guide
### Quick Color Reference
- **Primary**: `#FF6B35` (Claw Orange)
- **Secondary**: `#D64045` (Terracotta Accent)
- **Background**: `#FFFFFF` (Warm White) / `#1A365D` (Deep Blue)
- **Text**: `#1A365D` (Dark Blue) / `#FFFFFF` (White)

### Ready-to-Use Prompts
1. "Generate a hero section for OpenClaw using the design system. Include a headline, subheadline, and primary CTA button."
2. "Create a feature section with 3 columns, each containing an icon, title, and description. Use the card component from the design system."
3. "Design a pricing page with 3 tiers, using the card component and Claw Orange for the recommended tier."
4. "Build a footer with logo, navigation links, social media icons, and copyright information."
5. "Create a contact form with name, email, subject, and message fields, using the input components from the design system."

### Design System Guidelines
- **Consistency**: Apply the design system consistently across all pages
- **Accessibility**: Ensure the design meets WCAG 2.1 AA standards
- **Performance**: Optimize images and code for fast loading
- **Maintainability**: Use consistent naming conventions and organized code structure
- **Scalability**: Design components that can be easily reused and extended
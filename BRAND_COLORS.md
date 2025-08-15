# Brand Color Palette Guide

This document outlines the brand color system used throughout the AFT Reports Generator application. All components should use these semantic color tokens to maintain consistency and support both light and dark themes.

## 🎨 Color Tokens

### Primary Colors
- **`--primary`**: `#0a3f58` (Deep Blue) - Main brand color for primary actions
- **`--primary-foreground`**: `#ffffff` (White) - Text on primary backgrounds

### Secondary Colors
- **`--secondary`**: `#bdd5cd` (Sage Green) - Secondary actions and accents
- **`--secondary-foreground`**: `#1f1f1f` (Dark Gray) - Text on secondary backgrounds

### Accent Colors
- **`--accent`**: `#f6d499` (Warm Gold) - Highlighting and special elements
- **`--accent-foreground`**: `#1f1f1f` (Dark Gray) - Text on accent backgrounds

### Semantic Colors
- **`--destructive`**: `#ef4444` (Red) - Error states and destructive actions
- **`--muted`**: `#f6f6f6` (Light Gray) - Subtle backgrounds and borders
- **`--muted-foreground`**: `#666666` (Medium Gray) - Secondary text

### UI Colors
- **`--background`**: `#ffffff` (White) - Main page background
- **`--foreground`**: `#1f1f1f` (Dark Gray) - Primary text
- **`--card`**: `#ffffff` (White) - Card backgrounds
- **`--card-foreground`**: `#1f1f1f` (Dark Gray) - Card text
- **`--border`**: `#e5e5e5` (Light Gray) - Borders and dividers
- **`--input`**: `#e5e5e5` (Light Gray) - Input field borders
- **`--ring`**: `#0a3f58` (Deep Blue) - Focus rings and highlights

## 🚀 How to Use

### ✅ DO Use These Classes

```tsx
// Backgrounds
className="bg-primary"           // Primary button backgrounds
className="bg-secondary"         // Secondary button backgrounds
className="bg-accent"           // Accent/highlight backgrounds
className="bg-card"             // Card backgrounds
className="bg-muted"            // Subtle backgrounds
className="bg-background"       // Page backgrounds

// Text Colors
className="text-primary"         // Primary text (usually links)
className="text-foreground"     // Main text color
className="text-muted-foreground" // Secondary text
className="text-destructive"    // Error text
className="text-primary-foreground" // Text on primary backgrounds

// Borders
className="border-border"       // Standard borders
className="border-primary"      // Primary-colored borders
className="border-destructive"  // Error borders

// Focus States
className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
```

### ❌ DON'T Use These

```tsx
// Avoid hardcoded colors
className="bg-blue-600"         // ❌ Use bg-primary instead
className="text-gray-900"       // ❌ Use text-foreground instead
className="border-gray-200"     // ❌ Use border-border instead
className="bg-white"            // ❌ Use bg-card or bg-background instead
```

### 🔄 Dynamic Color Changes

For interactive elements that change colors on hover/focus, use CSS custom properties:

```tsx
<button
  style={{ 
    backgroundColor: 'var(--primary)', 
    color: 'var(--primary-foreground)' 
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
>
  Click me
</button>
```

## 🌓 Dark Mode Support

The color system automatically supports dark mode through CSS custom properties. In dark mode:
- `--background` becomes dark
- `--foreground` becomes light
- `--primary` and `--secondary` swap roles
- All other colors adjust accordingly

## 📱 Component Examples

### Button Component
```tsx
// Primary button
<button className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Primary Action
</button>

// Secondary button
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Secondary Action
</button>
```

### Card Component
```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg shadow-lg p-6">
  <h2 className="text-foreground font-bold">Card Title</h2>
  <p className="text-muted-foreground">Card content goes here</p>
</div>
```

### Form Input
```tsx
<input
  className="bg-background text-foreground border border-input rounded-lg px-4 py-2 focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
  placeholder="Enter text..."
/>
```

### Progress Bar
```tsx
<div className="w-full bg-muted rounded-full h-2">
  <div
    className="h-2 rounded-full transition-all duration-300"
    style={{ 
      width: '75%',
      backgroundColor: 'var(--primary)'
    }}
  />
</div>
```

## 🎯 Best Practices

1. **Always use semantic color tokens** - Never hardcode colors like `#0a3f58`
2. **Use the focus ring system** - Add `focus:ring-2 focus:ring-ring focus:ring-offset-2` to interactive elements
3. **Maintain contrast** - Ensure text is readable on all backgrounds
4. **Be consistent** - Use the same color patterns across similar components
5. **Test both themes** - Verify colors work in both light and dark modes

## 🔧 Adding New Colors

If you need to add new colors to the system:

1. Add the color to `src/index.css` in the `:root` section
2. Add the corresponding dark mode variant
3. Update the TypeScript definitions in `src/vite-env.d.ts` if needed
4. Document the new color in this guide

## 📚 Resources

- **CSS Variables**: Defined in `src/index.css`
- **TypeScript Types**: Defined in `src/vite-env.d.ts`
- **Tailwind Integration**: Colors are available as Tailwind classes
- **Component Library**: See `src/components/ui/` for reusable components 
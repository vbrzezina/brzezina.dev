
# UI Component Library Decision Summary

## Context
Developer frustrated with shadcn/ui's copy-paste approach and looking for a sustainable design system with:
- Component-level theme overrides (like MUI's `theme.components.Button.styles`)
- Good accessibility
- Styled with CSS-in-JS (styled-components or Emotion)
- No manual wrapping of every component

## Key Findings

### Radix Ecosystem (Two Products)
1. **Radix Primitives** (`@radix-ui/react-*`)
   - Unstyled headless components
   - Best-in-class accessibility (9.5/10)
   - Requires manual styling
   
2. **Radix Themes** (`@radix-ui/themes`)
   - Pre-styled component library built on Primitives
   - Has `<Theme>` component with token-based theming
   - Exposes CSS variables for customization
   - ~30 components, released 2023

### Accessibility Ranking
1. **Radix UI**: 9.5/10 - WCAG AAA, extensively tested, WAI-ARIA compliant
2. **Chakra UI**: 8.5/10 - Built on React Aria (Adobe), very solid
3. **Mantine**: 7/10 - Good but has gaps, improving

## Recommended Solutions

### Option 1: Radix Themes + styled-components (Recommended for Max A11y)
**Best for:** Healthcare, government, finance, or when accessibility is critical

```tsx
import { Theme, Button, Text } from '@radix-ui/themes';
import styled from 'styled-components';
import '@radix-ui/themes/styles.css';

// Theme provides global tokens
function App() {
  return (
    <Theme accentColor="blue" grayColor="slate" radius="large">
      {/* Use pre-styled components */}
      <Button>Standard Button</Button>
      
      {/* Extend with styled-components when needed */}
      <CustomButton>Extended Button</CustomButton>
      
      {/* Custom components use theme CSS variables */}
      <CustomCard>Uses --accent-9, --space-4, etc.</CustomCard>
    </Theme>
  );
}

// Extend Radix Theme components
const CustomButton = styled(Button)`
  text-transform: uppercase;
  box-shadow: 0 4px 12px var(--accent-a5);
`;

// Custom components access theme via CSS variables
const CustomCard = styled.div`
  background: var(--color-panel);
  border-radius: var(--radius-3);
  padding: var(--space-4);
  color: var(--gray-12);
  border: 1px solid var(--gray-a6);
`;
```

**Radix Theme CSS Variables Available:**
- Colors: `--accent-1` through `--accent-12`, `--gray-1` through `--gray-12`
- Spacing: `--space-1` through `--space-9`
- Radius: `--radius-1` through `--radius-6`
- Typography: `--font-size-1` through `--font-size-9`
- Shadows: `--shadow-1` through `--shadow-6`
- Semantic: `--color-panel`, `--color-surface`, `--accent-contrast`

**Pros:**
✅ Best accessibility (Radix quality)
✅ Pre-styled components work out of box
✅ CSS variables accessible in styled-components
✅ Escape hatch for complex customization
✅ Built-in dark mode

**Cons:**
❌ No global component overrides like `theme.components.Button`
❌ Must extend components individually
❌ Smaller component library (~30 components)
❌ Relatively new/less mature

**Use Case:**
- 70% Radix Theme components as-is
- 20% extended with styled-components
- 10% custom components using Radix Primitives + styled-components

---

### Option 2: Chakra UI (Best Balance)
**Best for:** Most production apps needing good a11y + MUI-like theming

```tsx
import { ChakraProvider, extendTheme, Button } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'blue.500',
          _hover: { bg: 'blue.600' },
        },
      },
      defaultProps: {
        variant: 'solid',
      },
    },
  },
});

<ChakraProvider theme={theme}>
  <Button>Automatically themed</Button>
</ChakraProvider>
```

**Pros:**
✅ Global component overrides (like MUI)
✅ Excellent accessibility (built on React Aria)
✅ 100+ components
✅ Mature ecosystem

**Cons:**
❌ Slightly less accessible than Radix
❌ More opinionated styling

---

### Option 3: Mantine (Easiest DX)
**Best for:** SaaS apps where a11y is important but not critical

```tsx
import { MantineProvider, Button } from '@mantine/core';

const theme = {
  components: {
    Button: {
      styles: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
  },
};

<MantineProvider theme={theme}>
  <Button>Automatically themed</Button>
</MantineProvider>
```

**Pros:**
✅ Closest to MUI DX
✅ Global component overrides
✅ 100+ components
✅ Emotion under the hood

**Cons:**
❌ Accessibility good but not great (7/10)
❌ Some manual a11y work needed

---

## Decision Matrix

| Priority | Recommended Solution |
|----------|---------------------|
| Maximum accessibility | Radix Themes + styled-components |
| MUI-like theming + good a11y | Chakra UI |
| Easiest DX + good-enough a11y | Mantine |
| Full control | Radix Primitives + styled-components |

---

## Example: Complex Custom Component (Radix Themes + styled-components)

```tsx
import { Theme, Button, Text } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog'; // Primitive for more control
import styled from 'styled-components';
import '@radix-ui/themes/styles.css';

const StyledOverlay = styled(Dialog.Overlay)`
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  position: fixed;
  inset: 0;
`;

const StyledContent = styled(Dialog.Content)`
  background: var(--color-panel);
  border-radius: var(--radius-4);
  box-shadow: var(--shadow-6);
  padding: var(--space-5);
  border: 1px solid var(--gray-a5);
  
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
`;

function CustomDialog() {
  return (
    <Theme accentColor="blue" radius="large">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button>Open Dialog</Button>
        </Dialog.Trigger>
        
        <Dialog.Portal>
          <StyledOverlay />
          <StyledContent>
            <Text>Mix Radix Theme components with custom styled ones</Text>
            <Dialog.Close asChild>
              <Button variant="soft">Close</Button>
            </Dialog.Close>
          </StyledContent>
        </Dialog.Portal>
      </Dialog.Root>
    </Theme>
  );
}
```

---

## Why NOT shadcn/ui

- Not a real component library (copy-paste pattern)
- 20+ Tailwind classes per component
- No centralized updates
- Not a "design system"
- Maintenance burden on your team

---

## Final Recommendation

**For most production apps:** Use **Chakra UI** (90% of Radix a11y + 95% of MUI theming)

**For maximum accessibility:** Use **Radix Themes + styled-components** (best a11y + token theming + flexibility)

**For fastest development:** Use **Mantine** (easiest MUI-like DX)

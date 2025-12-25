# Editorial Tab UI Components

This package provides a set of React components for building Editorial tabs similar to coding platforms like LeetCode and TUF (Take U Forward). These components are built using React, TypeScript, TailwindCSS, and Framer Motion.

## Features

- 🌙 Dark mode by default
- 🎨 Clean, modern UI components
- 🎬 Video card with play overlay
- 📂 Collapsible sections with smooth animations
- 🖼️ Image carousel for dry runs with navigation
- 💻 Code tabs with syntax highlighting
- 📱 Mobile responsive design

## Components

### 1. Editorial

The main component that combines all other components into a full editorial view.

```tsx
import { Editorial } from './components/editorial';

<Editorial
  title="Problem Title"
  subtitle="Optional subtitle"
  videoThumbnail="/path/to/thumbnail.jpg"
  videoUrl="https://example.com/video"
  sections={[
    {
      title: 'Intuition',
      content: 'Content text or JSX element'
    },
    {
      title: 'Approach',
      content: 'Approach content'
    }
  ]}
  dryRunImages={[
    {
      id: '1',
      src: '/path/to/image1.jpg',
      alt: 'Step 1'
    }
  ]}
  solutions={{
    java: 'Java code here',
    python: 'Python code here'
  }}
  timeComplexity="O(n)"
  spaceComplexity="O(1)"
/>
```

### 2. EditorialTabs

Navigation tabs component for switching between different tabs (e.g., Brute, Optimal).

```tsx
import { EditorialTabs } from './components/editorial';

<EditorialTabs
  tabs={[
    { id: 'brute', label: 'Brute' },
    { id: 'optimal', label: 'Optimal' }
  ]}
  activeTab="brute"
  onTabChange={(tabId) => setActiveTab(tabId)}
/>
```

### 3. VideoCard

Displays a video thumbnail with play button overlay.

```tsx
import { VideoCard } from './components/editorial';

<VideoCard
  title="Video Title"
  subtitle="Video subtitle"
  thumbnailUrl="/path/to/thumbnail.jpg"
  videoUrl="https://example.com/video"
/>
```

### 4. Section

Collapsible section with smooth animations.

```tsx
import { Section } from './components/editorial';

<Section title="Section Title" isCollapsed={false}>
  <p>Section content goes here</p>
</Section>
```

### 5. ImageCarousel

Carousel for displaying dry run images with navigation controls.

```tsx
import { ImageCarousel } from './components/editorial';

<ImageCarousel
  images={[
    {
      id: '1',
      src: '/path/to/image1.jpg',
      alt: 'Step 1'
    },
    {
      id: '2',
      src: '/path/to/image2.jpg',
      alt: 'Step 2'
    }
  ]}
/>
```

### 6. CodeTabs

Multi-language code display with syntax highlighting.

```tsx
import { CodeTabs } from './components/editorial';

<CodeTabs
  solutions={{
    java: 'Java code here',
    python: 'Python code here',
    javascript: 'JavaScript code here'
  }}
  activeLanguage="java"
  onLanguageChange={(language) => setActiveLanguage(language)}
/>
```

## Usage

To see a complete example of all components working together, visit the `/editorial-demo` route in the application.

## Dependencies

- React
- TypeScript
- TailwindCSS
- Framer Motion
- prism-react-renderer (for code syntax highlighting)
- lucide-react (for icons)

## Styling

The components use TailwindCSS for styling with a dark theme. The main colors used are:

- Background: `#0f0f0f` (main), `#1a1a1a` (cards/widgets)
- Text: White `#fff` and Gray `#9ca3af`
- Borders: `#2a2a2a`

Additional styles can be found in `src/index.css` under the `.editorial-*` classes.

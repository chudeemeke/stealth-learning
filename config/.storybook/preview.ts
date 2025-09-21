import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      description: {
        component: 'Educational gaming components designed for children ages 3-9',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1f2937',
        },
        {
          name: 'gradient',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      ],
    },
  },
  argTypes: {
    ageGroup: {
      control: {
        type: 'select',
        options: ['3-5', '6-8', '9+'],
      },
      description: 'Age group for component styling and behavior',
    },
    variant: {
      control: {
        type: 'select',
        options: ['default', 'elevated', 'outlined', 'gradient', 'interactive', 'glassmorphism', '3d-transform'],
      },
      description: 'Visual variant of the component',
    },
  },
  decorators: [
    (Story) => (
      <div style={{
        padding: '2rem',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'var(--sb-color-bg)',
        minHeight: '100vh'
      }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
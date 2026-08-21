# Enterprise Specification: Testing Strategy (Jest & React Native Testing Library)

## 1. Testing Pyramid
- **Unit Tests (Jest)**: Zustand stores, Zod schemas, utility functions.
- **Component Tests (React Native Testing Library)**: UI component rendering, hook behavior.
- **E2E Integration Tests (Detox)**: Full Android end-to-end user workflows.

---

## 2. Component Testing Example

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActionCard } from '@components/ActionCard';

test('renders action card and handles press', () => {
  const onPressMock = jest.fn();
  const { getByText } = render(
    <ActionCard title="Timetable" subtitle="View Schedule" onPress={onPressMock} />
  );

  expect(getByText('Timetable')).toBeTruthy();
  fireEvent.press(getByText('Timetable'));
  expect(onPressMock).toHaveBeenCalledTimes(1);
});
```

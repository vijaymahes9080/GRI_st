# Enterprise Specification: UI Design System & NativeWind v4

## 1. Styling Architecture (NativeWind v4 + Tailwind CSS)
All UI components use **NativeWind v4** allowing utility-first styling with 60 FPS native driver animations via **React Native Reanimated v3**.

---

## 2. Web Page to Mobile Native Component Redesign

| Website Section (`ruraluniv.ac.in`) | React Native Mobile Component Pattern |
|---|---|
| Academic Calendar Table | Horizontal scrolling date strip + FlashList timeline cards |
| Examination Results | Card list with score progress rings & PDF export button |
| Hostel Circulars | Accordion card list with badge indicators |
| Faculty Directory | Search bar + FlashList with quick call/email action buttons |
| Library Book Search (OPAC) | Grid / List view with barcode scanner overlay |

---

## 3. High Performance List Rendering (`@shopify/flash-list`)

```tsx
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { View, Text } from 'react-native';

export const CourseList = ({ courses }: { courses: Array<{ id: string; title: string }> }) => (
  <FlashList
    data={courses}
    renderItem={({ item }) => (
      <View className="bg-white p-4 rounded-xl mb-3 border border-gray-100">
        <Text className="font-semibold text-gray-900">{item.title}</Text>
      </View>
    )}
    estimatedItemSize={72}
  />
);
```

# Enterprise Specification: Coding Standards & TypeScript Best Practices

## 1. Code Style & TypeScript Standards
All code must adhere to strict **TypeScript 5.x** rules enforced via ESLint and Prettier.

### Rules:
1. **Strict Type Safety**: `noImplicitAny: true`, `strictNullChecks: true`. Do not use `any`; use Zod inference or strict interfaces.
2. **Naming Conventions**:
   - `PascalCase` for React components, types, and interfaces.
   - `camelCase` for variables, hook names (`useTimetable`), and functions.
   - `kebab-case` for file basenames (`student-card.tsx`).
3. **Component Rule**: Standardize on Functional Components with explicit React Props interfaces:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ActionCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ title, subtitle, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
    activeOpacity={0.7}
  >
    <Text className="text-lg font-semibold text-gray-900">{title}</Text>
    <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
  </TouchableOpacity>
);
```

---

## 2. Zod Schema Validation Example

```typescript
import { z } from 'zod';

export const StudentProfileSchema = z.object({
  id: z.string().uuid(),
  rollNumber: z.string().min(5),
  fullName: z.string(),
  department: z.string(),
  semester: z.number().int().positive(),
  cgpa: z.number().min(0.0).max(10.0),
});

export type StudentProfile = z.infer<typeof StudentProfileSchema>;
```

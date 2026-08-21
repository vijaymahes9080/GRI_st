import { z } from 'zod';

// --------------------------------------------------------------------------
// Theme Tokens Schema & Types
// --------------------------------------------------------------------------
export const ThemeTokensSchema = z.object({
  primaryColor: z.string().default('#518214'),
  secondaryColor: z.string().default('#911C03'),
  accentColor: z.string().default('#F16236'),
  surfaceColor: z.string().default('#FFFFFF'),
  darkSurfaceColor: z.string().default('#121212'),
});

export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;

// --------------------------------------------------------------------------
// Feature Flags Schema & Types
// --------------------------------------------------------------------------
export const FeatureFlagsSchema = z.record(z.string(), z.boolean()).default({
  admissions: true,
  examinations: true,
  results: true,
  departments: true,
  faculty: true,
  news: true,
  events: true,
  downloads: true,
  library: true,
  student_services: true,
  grievance: true,
  placement: true,
  hostel: true,
  transport: true,
});

export type FeatureFlagsMap = z.infer<typeof FeatureFlagsSchema>;

// --------------------------------------------------------------------------
// Navigation Node Schema & Types
// --------------------------------------------------------------------------
export interface NavigationNode {
  id: string;
  title: string;
  icon: string;
  route: string;
  featureFlagKey?: string | null;
  order: number;
  enabled?: boolean;
  children?: NavigationNode[];
}

export const NavigationNodeSchema: z.ZodType<NavigationNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    title: z.string(),
    icon: z.string(),
    route: z.string(),
    featureFlagKey: z.string().nullable().optional(),
    order: z.number(),
    enabled: z.boolean().default(true),
    children: z.array(NavigationNodeSchema).optional(),
  })
);

// --------------------------------------------------------------------------
// Server-Driven App Config Schema & Types (/api/v1/app/config)
// --------------------------------------------------------------------------
export const AppServerConfigSchema = z.object({
  appVersion: z.string(),
  minimumVersion: z.string(),
  recommendedVersion: z.string().optional(),
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().optional(),
  features: FeatureFlagsSchema,
  navigation: z.array(NavigationNodeSchema),
  theme: ThemeTokensSchema,
});

export type AppServerConfig = z.infer<typeof AppServerConfigSchema>;

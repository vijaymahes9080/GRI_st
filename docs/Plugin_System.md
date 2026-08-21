# Enterprise Specification: Modular React Native Plugin System

## 1. Dynamic Plugin Registry
Campus organizations (NSS, NCC, Sports Board) register sub-applications dynamically via a central plugin interface.

```typescript
export interface GriPlugin {
  id: string;
  name: string;
  icon: string;
  Component: React.ComponentType;
}

class PluginRegistry {
  private plugins: Map<string, GriPlugin> = new Map();

  register(plugin: GriPlugin) {
    this.plugins.set(plugin.id, plugin);
  }

  getAll() {
    return Array.from(this.plugins.values());
  }
}

export const pluginRegistry = new PluginRegistry();
```

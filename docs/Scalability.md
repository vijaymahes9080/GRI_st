# Enterprise Specification: Performance & RAM Optimization (Android)

## 1. Android Memory & Render Optimization
- **FlashList Replacement**: Legacy `FlatList` replaced with `@shopify/flash-list` for zero-lag 60 FPS scrolling on low-end Android devices.
- **Hermes JS Engine**: Hermes JavaScript Engine enabled in Android builds for sub-second app start times and 50% lower memory footprint.
- **Image Caching**: Uses Expo Image with disk caching to prevent memory leaks during image list scrolling.

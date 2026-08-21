# Enterprise Specification: Android Deployment & CI/CD Pipelines

## 1. Fastlane Android Deployment Pipeline
Automated Gradle builds generate signed release `.apk` and `.aab` bundles for distribution via Google Play Console or internal OTA distribution.

```ruby
# Fastfile for Android
default_platform(:android)

platform :android do
  desc "Build Android App Bundle (AAB) for Google Play"
  lane :deploy_play_store do
    gradle(
      task: "bundle",
      build_type: "Release"
    )
    upload_to_play_store(
      track: "production",
      aab: "android/app/build/outputs/bundle/release/app-release.aab"
    )
  end
end
```

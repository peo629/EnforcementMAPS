---
title: Android Native Configuration
scope: android-setup
last_reviewed: "2026-03-27"
---

# Android Native Configuration

The Zello SDK requires several native-level changes that cannot be applied by React Native auto-linking.

## 1. Project-Level `build.gradle`

Add the Zello Maven repository and the Hilt Gradle plugin:

```groovy
// android/build.gradle
buildscript {
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri("https://zello-sdk.s3.amazonaws.com/android/latest")
        }
    }
    dependencies {
        classpath "com.android.tools.build:gradle:8.5.1"
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.24"
        classpath "com.google.dagger:hilt-android-gradle-plugin:2.51"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri("https://zello-sdk.s3.amazonaws.com/android/latest")
        }
    }
}
```

> The Zello Maven repo (`https://zello-sdk.s3.amazonaws.com/android/latest`) is required. The AAR is not published to Maven Central.

## 2. App-Level `build.gradle`

Apply the Hilt and kapt plugins, then add the Zello SDK dependency:

```groovy
// android/app/build.gradle
apply plugin: "com.android.application"
apply plugin: "kotlin-android"
apply plugin: "com.google.dagger.hilt.android"
apply plugin: "kotlin-kapt"

android {
    compileSdk 34
    defaultConfig {
        minSdk 21
        targetSdk 34
    }
}

dependencies {
    implementation "com.zello:sdk:1.0.+"
    implementation "com.google.dagger:hilt-android:2.51"
    kapt "com.google.dagger:hilt-compiler:2.51"
}
```

## 3. Hilt Application Class

Create or update your `MainApplication` to annotate with `@HiltAndroidApp`:

```kotlin
// android/app/src/main/java/com/yourapp/MainApplication.kt
package com.yourapp

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.defaults.DefaultReactNativeHost
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class MainApplication : Application(), ReactApplication {
    // ... standard React Native host configuration
}
```

> **Critical:** The `@HiltAndroidApp` annotation is mandatory. Without it, the Zello SDK will crash at runtime with a Hilt injection error.

## 4. Hilt Configuration

In the module-level build.gradle (or the Zello SDK module):

```groovy
hilt {
    enableAggregatingTask = true
}
```

## 5. React Native New Architecture

If using the New Architecture (`newArchEnabled=true`):

```groovy
if (isNewArchitectureEnabled()) {
    apply plugin: "com.facebook.react"
}
```

## 6. Build Verification

```bash
cd android && ./gradlew assembleDebug --console=plain
```

Confirm zero Hilt/Dagger errors and successful AAR resolution from the Zello S3 Maven repo.

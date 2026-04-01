# OneCore Engine (Educational)

OneCore Engine is a comprehensive cybersecurity research tool designed for students learning Android reverse engineering, Unreal Engine memory analysis, and anti-cheat security research.

## Project Overview

This project consists of two main components:
1.  **Web Dashboard**: A React-based documentation and simulation tool for learning memory analysis concepts.
2.  **Android Native App**: A Kotlin/C++ (NDK) application for real-time memory analysis on rooted Android devices.

## Features

-   **Memory Reading**: Implementation of `process_vm_readv` and `/proc/[pid]/mem` access.
-   **Pattern Scanning**: High-performance AOB (Array of Bytes) scanner for finding dynamic engine globals.
-   **UE Structure Analysis**: Pre-configured research signatures for `GWorld`, `GNames`, and `GObjects`.
-   **Anti-Cheat Research**: Documentation on modern detection vectors and mitigation strategies.
-   **Memory Viewer**: Interactive visualization of memory regions and structure hierarchies.

## Directory Structure

-   `/src`: Web dashboard source code (React + Tailwind).
-   `/android`: Android native application source code (Kotlin + C++ NDK).
-   `/.github/workflows`: CI/CD configuration for automated Android APK builds.

## Getting Started

### Web Dashboard
1.  Install dependencies: `npm install`
2.  Start dev server: `npm run dev`

### Android App
1.  Open the `/android` directory in Android Studio.
2.  Ensure you have the Android NDK and CMake installed.
3.  Build the project. The APK will be generated in `app/build/outputs/apk/`.

## Educational Disclaimer

This tool is strictly for **educational and research purposes only**. It is designed to help students understand low-level system operations and security mechanisms. 
-   **Do not** use this tool on games or applications you do not own.
-   **Do not** use this tool to gain an unfair advantage in online games.
-   **Always** respect the terms of service of the software you are analyzing.

## License

SPDX-License-Identifier: Apache-2.0

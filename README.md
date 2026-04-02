# OneCore Engine (Educational)

OneCore Engine is a research tool for analyzing Android game memory structures (specifically Unreal Engine). This tool is for educational purposes only.

## 🚀 Features
- **Memory Analysis**: Simulated and API-based memory scanning.
- **UE Structures**: Documentation and signatures for GWorld, GObjects, and GNames.
- **Anti-Cheat Research**: Educational resources on memory protection.
- **Processing Modes**: Choose between Local and Cloud processing.

## 🛠 Setup Instructions

### 1. Local Mode (Recommended)
Local Mode uses a server running directly on your Android device via Termux.
- **Port**: 8080
- **Endpoint**: `http://localhost:8080/api/analyze`
- **Requirements**:
  - Install Termux on your Android device.
  - Run the OneCore companion server (Python/Node.js).
  - Ensure "Localhost Access" is enabled in your browser/app settings.

### 2. Cloud Mode
Cloud Mode allows you to use a custom self-hosted server.
- **Configuration**: Go to the **Settings** tab in the web tool.
- **URL**: Enter your server's full URL (e.g., `https://my-research-server.com:8080`).
- **API Key**: Optional security header (`X-API-Key`).
- **Note**: If using GitHub Pages (HTTPS), your cloud server **must** also use HTTPS to avoid Mixed Content errors.

## 📁 Project Structure
- `src/App.tsx`: Main UI and tab management.
- `src/components/Settings.tsx`: Configuration for processing modes.
- `src/lib/api.ts`: API service for handling Local/Cloud requests.
- `android/`: Native Android NDK components (v1.0.0).

## ⚖️ Disclaimer
This tool is intended for educational research and debugging of your own applications. It does not provide any bypasses for anti-cheat systems or instructions for illegal activities.

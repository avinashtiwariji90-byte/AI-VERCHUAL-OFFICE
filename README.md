# AI Virtual Office 🏢

A comprehensive AI Virtual Office platform featuring intelligent agents, lead generation, interactive canvas/3D office visualization, and CRM management.

---

### 🚀 Live Website
[![Live Demo on Netlify](https://img.shields.io/badge/Live_Demo-aiverchualoffice.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://aiverchualoffice.netlify.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/avinashtiwariji90-byte/AI-VERCHUAL-OFFICE)

👉 **Experience the Live App:** [https://aiverchualoffice.netlify.app/](https://aiverchualoffice.netlify.app/)

---

## ⚡ Quick Start (Recommended)

Simply double-click the startup script:
```bash
START_SERVER.bat
```

This will automatically:
1. ✅ Launch the local Apache/PHP server
2. ✅ Open the project in your default browser
3. ✅ Initialize all backend services

---

## 📋 Manual Setup

### Option 1: Using XAMPP (Recommended)
1. Download & install [XAMPP](https://www.apachefriends.org).
2. Place this repository folder inside:
   ```
   C:\xampp\htdocs\ai-virtual-office\
   ```
3. Open the **XAMPP Control Panel** and start **Apache**.
4. Open your browser and navigate to:
   ```
   http://localhost/ai-virtual-office/
   ```

### Option 2: Using PHP Built-in Server
Run the following command inside the project directory:
```bash
php -S 127.0.0.1:8000
```
Then visit: `http://127.0.0.1:8000`

### Option 3: Using Python HTTP Server (Static Preview)
```bash
python -m http.server 8080
```
Then visit: `http://localhost:8080` *(Note: PHP backend API features will not be active)*

---

## 📁 Project Structure

```
ai-virtual-office/
├── 🚀 START_SERVER.bat         # One-click startup script
├── 📄 index.html               # Main Virtual Office Application
├── 📄 leadgen.html             # Lead Generation Portal
├── 📄 project_preview.html     # Interactive Project Showcase
├── 📂 api/
│   ├── config.php              # Server & Database Configuration
│   ├── leads_api.php           # Lead capture & management API
│   └── office_api.php          # Core Office & Agent State API
└── 📂 assets/
    ├── css/
    │   └── office.css          # Styling & Animations
    └── js/
        ├── agents.js           # AI Agent Logic & Personalities
        ├── canvas_office.js    # 2D Interactive Office Canvas
        ├── command.js          # Terminal & Voice Commands
        ├── leadgen.js          # Lead Generation Logic
        ├── office.js           # Core Application Engine
        ├── tasks_crm.js        # Tasks & CRM Operations
        ├── three_office.js     # 3D Three.js Office Environment
        └── voice.js            # Voice Recognition & Synthesis
```

---

## 🛠️ Tech Stack & Features

- **Frontend**: HTML5, Vanilla CSS3, Modern JavaScript (ES6+)
- **3D & Canvas**: Three.js, HTML5 Canvas API
- **Audio & AI**: Web Speech API (Voice Synthesis & Recognition)
- **Backend**: PHP RESTful APIs
- **Automation**: Batch scripts for local hosting & Cloudflare tunnel integration

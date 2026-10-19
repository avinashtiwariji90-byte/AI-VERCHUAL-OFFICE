# AI Virtual Office 🏢

Aapke AI Virtual Office project ka complete package!

## ⚡ Easy Start (Recommended)

**Double-click karo:** `START_SERVER.bat`

Yeh automatically:
1. ✅ Apache server start karega
2. ✅ Browser mein project kholega
3. ✅ Sab kuch automatically handle karega!

---

## 📋 Manual Start (Agar BAT kaam na kare)

### Option 1: XAMPP se (Best)
1. XAMPP install karo: https://www.apachefriends.org
2. Is folder ko copy karo: `C:\xampp\htdocs\ai-virtual-office\`
3. XAMPP Control Panel mein Apache **Start** karo
4. Browser mein kholo: `http://localhost/ai-virtual-office/`

### Option 2: Python se (PHP features nahi chalenge)
```
python -m http.server 8080
```
Phir kholo: `http://localhost:8080`

---

## 📁 Project Structure

```
ai-virtual-office/
├── 🚀 START_SERVER.bat     ← Double-click to run!
├── 📄 index.html           ← Main App
├── 📄 leadgen.html         ← Lead Generation
├── 📄 project_preview.html ← Project Preview
├── api/
│   ├── config.php
│   ├── leads_api.php
│   └── office_api.php
└── assets/
    ├── css/office.css
    └── js/
        ├── agents.js
        ├── canvas_office.js
        ├── command.js
        ├── leadgen.js
        ├── office.js
        ├── tasks_crm.js
        ├── three_office.js
        └── voice.js
```

---

## 🌐 URLs

| Page | URL |
|------|-----|
| Main App | http://localhost/ai-virtual-office/ |
| Lead Gen | http://localhost/ai-virtual-office/leadgen.html |
| Preview | http://localhost/ai-virtual-office/project_preview.html |

---

*Made with ❤️ - AI Virtual Office*

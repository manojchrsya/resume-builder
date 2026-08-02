# Resume Builder

A modern, responsive Resume Builder built with **Vue 3**, allowing users to create, edit, preview, and export professional resumes. The application provides real-time editing, customizable templates, and PDF export functionality.

![Vue](https://img.shields.io/badge/Vue-3.x-42b883)
![Vite](https://img.shields.io/badge/Vite-7.x-646cff)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

- 📝 Real-time resume editing
- 🎨 Professional resume templates
- 📄 Live preview
- 📥 Export resume as PDF
- 💾 JSON-based resume data
- 📱 Responsive design
- 🖨️ Print-friendly layout
- 🌙 Easy to extend with new templates

---

## 🚀 Tech Stack

- Vue 3
- Vite
- Pinia (Optional)
- Vue Router
- jsPDF
- html2canvas

---

## 📂 Project Structure

```
src/
│
├── assets/
├── components/
│   ├── PersonalDetails.vue
│   ├── Skills.vue
│   ├── Experience.vue
│   ├── Education.vue
│   ├── Projects.vue
│   └── ResumePreview.vue
│
├── composables/
├── layouts/
├── router/
├── stores/
├── templates/
├── utils/
├── App.vue
└── main.js
```

---

## 📋 Features Overview

### Resume Sections

- Personal Information
- Professional Summary
- Skills
- Experience
- Projects
- Education
- Certifications
- Languages
- Achievements

### Editing

- Inline editing
- Dynamic add/remove sections
- Reorder entries
- Live preview

### Export

- Print Resume
- Download PDF
- JSON Import/Export (Optional)

---

## 🛠 Installation

Clone the repository

```bash
git clone https://github.com/<username>/resume-builder.git
```

Navigate to the project

```bash
cd resume-builder
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

## 📄 PDF Export

The project uses

- html2canvas
- jsPDF

to generate high-quality printable PDFs.

---

## 📦 Resume Data Structure

Example

```json
{
  "personal": {
    "name": "John Doe",
    "designation": "Technical Lead",
    "email": "john@example.com",
    "phone": "+91-XXXXXXXXXX"
  },
  "skills": {
    "backend": [
      "Node.js",
      "TypeScript"
    ],
    "database": [
      "PostgreSQL",
      "Redis"
    ]
  },
  "experience": [],
  "projects": [],
  "education": []
}
```

---

## 🎯 Future Improvements

- Multiple resume templates
- Theme customization
- Drag & Drop section ordering
- Resume sharing
- Cloud save
- AI-assisted resume generation
- ATS Resume Score
- Cover Letter Generator
- Multi-language support

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push changes

```bash
git push origin feature/new-feature
```

5. Create a Pull Request

---

## 📸 Screenshots

Add screenshots here.

```
Home Page

Editor

Preview

Export PDF
```

---

## 📃 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Manoj Chaurasiya**

- GitHub: https://github.com/manojchrsya
- LinkedIn: https://linkedin.com/in/<your-profile>

---

⭐ If you found this project useful, please consider giving it a star.
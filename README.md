# Smart Todo App

A modern, accessible, and extensible todo app built with Vite and React.  
Manage tasks with details, priorities, recurrence, reminders, and more.  
**Local-first, fast, and ready for smart features!**

---

## Features

- **Add, edit, delete, complete todos**
- **Task details:** title, description, due date, priority, recurrence, tags
- **Dashboard views:** Today, Upcoming, Completed
- **Task search & filter:** by status and priority
- **LocalStorage persistence** with versioning
- **Accessible, responsive UI**
- **Modal dialog:** Product Roadmap & feedback
- **Placeholder UIs:** for upcoming features
  - AI Suggestions
  - Collaboration
  - Integrations
  - Reminders & Recurring Tasks
- **In-browser notifications:** for reminders (permission required)
- **Unit tests:** for all major components and services

---

## Tech Stack

- **Vite** (build tool)
- **React** (UI)
- **Pure JavaScript** (no TypeScript)
- **CSS Modules** (no UI libraries)
- **ESLint** (code quality)
- **Vitest** (testing)

---

## Folder Structure

```
smart-todo-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── constants.js
│   ├── models/
│   │   └── task.js
│   ├── services/
│   │   ├── taskService.js
│   │   ├── storageManager.js
│   │   └── reminderManager.js
│   ├── components/
│   │   ├── AIPlaceholder.jsx
│   │   ├── CollaborationPlaceholder.jsx
│   │   ├── IntegrationPlaceholder.jsx
│   │   ├── DashboardView.jsx
│   │   ├── ProductRoadmapDialog.jsx
│   │   ├── TaskEditor.jsx
│   │   ├── TaskList.jsx
│   │   ├── Tooltip.jsx
│   │   └── __tests__/
│   │       └── *.test.jsx
│   ├── config/
│   │   └── staticRoadmapConfig.js
│   ├── styles/
│   │   └── *.module.css
│   ├── utils/
│   │   ├── accessibility.js
│   │   └── performance.js
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js
└── README.md
```

---

## Setup & Usage

### 1. Install dependencies

```
npm install
```

### 2. Start development server

```
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173) (default Vite port).

### 3. Build for production

```
npm run build
```

### 4. Preview production build

```
npm run preview
```

### 5. Run tests

```
npm run test
```

---

## Usage

- **Add tasks:** Use the input at the top or the "Add Task" button.
- **Edit tasks:** Click ✎ next to a task.
- **Delete tasks:** Click × next to a task.
- **Complete tasks:** Check the box.
- **Dashboard:** Switch between Today, Upcoming, Completed.
- **Search/filter:** Use filters and search box in Task List.
- **Reminders:** Allow browser notifications for reminders.
- **Roadmap:** Click the roadmap modal for upcoming features.

---

## Accessibility

- Keyboard navigation supported throughout
- ARIA roles and labels for dialogs, tooltips, and regions
- Focus management for modals and forms

---

## Product Roadmap

See the modal dialog in the app for upcoming features:

- AI Suggestions 🤖
- Collaboration 🤝
- Integrations 🔗
- Reminders & Recurring Tasks ⏰

---

## License

**Private – All rights reserved.**  
This codebase is for internal use only.  
No redistribution, commercial use, or sublicensing permitted.

---

## Feedback & Feature Requests

Open the Product Roadmap dialog in the app for feedback instructions.  
We welcome suggestions to shape the roadmap!

---

## Credits

Built with ❤️ using Vite and React.  
No external UI or state libraries.  
Accessible, fast, and extensible by design.
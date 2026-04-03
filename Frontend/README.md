# Task Management System (React + localStorage)

A premium-style **Task Management System** built with React, designed to demonstrate:
- role-based access control (admin vs user)
- task CRUD with business constraints
- comment + one-level reply system
- filtering/sorting/search
- secure action restrictions on the client side

This project is implemented as a **frontend-only assignment solution** using `localStorage` (which satisfies the assignment minimum requirement).

---

## 1) Tech Stack

- **Frontend:** React 19, Vite 8
- **State Management:** React hooks (`useState`, `useEffect`, `useMemo`)
- **Persistence:** `localStorage` for tasks, `sessionStorage` for login session
- **Styling:** Custom CSS (glassmorphism / premium dark theme)

---

## 2) Core Features Implemented

### Authentication (Simple Login)
- Dummy credential-based login screen with username/password.
- Two users:
  - Admin: `admin / admin123`
  - Normal user: `user / user123`
- Session persistence via `sessionStorage` key: `task_app_logged_in_user`
- Logout clears active session state.

### Role-Based Access Control
- **Admin**
  - Can see all tasks
  - Can assign tasks to any user (including themselves)
  - Can edit/delete all tasks
- **Normal user**
  - Sees only tasks assigned to themselves
  - Cannot assign tasks to other users
  - Cannot edit/delete tasks assigned to others

### Task CRUD
Each task supports:
- `title`
- `description`
- `status` (`Pending` / `Completed`)
- `priority` (`Low` / `Medium` / `High`)
- `assignedTo`
- `linkedTaskId`
- `comments[]`

Operations:
- Create task
- Edit task
- Delete task

### Task Relationship Constraint
- A task can be linked to another task.
- Validation rule: linked task must be assigned to the **same user**.
- Self-linking is prevented.

### Comments + Replies
- Add top-level comments to tasks.
- Add one-level nested replies to a comment.
- Delete comments.
- Delete individual replies.

### Sorting / Filtering / Search
- Filter by `status`
- Filter by `priority`
- Sort by:
  - Title (A-Z)
  - Priority (High-Low)
  - Assigned user
- Search by title/description/assignee

---

## 3) Folder Structure

```text
Frontend/
├─ src/
│  ├─ components/
│  │  ├─ HeaderBar.jsx
│  │  ├─ LoginScreen.jsx
│  │  ├─ StatsCards.jsx
│  │  ├─ TaskForm.jsx
│  │  └─ TaskList.jsx
│  ├─ constants/
│  │  └─ users.js
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ package.json
└─ README.md
```

---

## 4) Data Model (Client-Side)

Each task object is stored in localStorage (JSON array):

```js
{
  id: "task_...",
  title: "Implement login",
  description: "Build simple username/password auth",
  status: "Pending", // or "Completed"
  priority: "High",  // Low | Medium | High
  assignedTo: "u-john",
  linkedTaskId: "task_...", // optional
  comments: [
    {
      id: "comment_...",
      text: "Start this first",
      authorId: "u-admin",
      createdAt: "ISO_DATE",
      replies: [
        {
          id: "reply_...",
          text: "Working on it",
          authorId: "u-john",
          createdAt: "ISO_DATE"
        }
      ]
    }
  ],
  createdAt: "ISO_DATE",
  updatedAt: "ISO_DATE"
}
```

Storage keys:
- Tasks: `task_app_tasks_v1`
- Session: `task_app_logged_in_user`

---

## 5) Business Rules and Validation

Implemented validations:
- Title and description cannot be empty
- Non-admin cannot assign tasks to other users
- Linked task must exist
- Linked task must have same assignee
- Task cannot link to itself
- Unauthorized edit/delete is blocked
- Empty comment/reply is blocked

Consistency safeguards:
- On task delete, any task linking to that task has its `linkedTaskId` cleared
- `updatedAt` is refreshed on every mutating operation

---

## 6) UI/UX Notes (Premium Layer)

- Dark gradient background with radial glow accents
- Glassmorphism cards (`backdrop-filter`, soft borders, shadows)
- Login page with focused premium presentation
- Role badge (Admin/User)
- Stats cards for visibility
- Responsive grid layout for desktop + mobile

---

## 7) How to Run Locally

### Prerequisites
- Node.js 18+ (recommended 20+)

### Install and Run

```bash
cd Frontend
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```

---

## 8) Deployment (Frontend Only)

Deploy easily to Vercel/Netlify:
- Framework: Vite
- Build command: `npm run build`
- Output dir: `dist`
- Base/root directory: `Frontend`

---

## 9) Recruiter-Friendly Explanation (What to Say)

Use this structure in interviews:

1. **Problem framing:**  
   "I built a role-based task system with strict business constraints and clean UX."

2. **Architecture:**  
   "I used React component architecture, centralized state in `App.jsx`, and localStorage/sessionStorage for persistence and session handling."

3. **Authorization logic:**  
   "Admin and user capabilities are separated in both rendering and action handlers to prevent unauthorized operations."

4. **Data integrity:**  
   "I added explicit validation for linking constraints, self-link prevention, and safe cleanup when deleting linked tasks."

5. **Scalability thought process:**  
   "The app is structured so storage can be swapped from localStorage to API/database with minimal UI rewrite."

---

## 10) Assignment Mapping Checklist

- [x] 2 dummy users
- [x] Simple login
- [x] Task create/edit/delete
- [x] Required task fields
- [x] Admin vs user permissions
- [x] Dynamic task visibility by logged-in user
- [x] Linking constraint (same assignee)
- [x] Filter + sort features
- [x] Comments + one-level replies
- [x] Error handling for invalid actions
- [x] Search (bonus)
- [x] Premium UI polish (bonus)

---

## 11) Future Enhancements

- Move auth from dummy credentials to secure backend auth/JWT
- Add optimistic updates + undo for destructive actions
- Add unit tests for validation logic
- Add pagination and analytics panel

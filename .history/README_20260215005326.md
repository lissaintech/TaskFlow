# TaskFlow

**TaskFlow** is a multi-user Kanban productivity platform built with React and Firebase.  
Designed as an internship-ready SaaS-style prototype demonstrating real-time systems, authentication, authorization logic, and modern frontend architecture.

Live Demo: https://task-flow-nine-mocha.vercel.app

---

## 👩‍💻 Built By

**Lissa Nanda**

GitHub: https://github.com/lissaintech

---

## 🚀 Overview

TaskFlow is a Trello-style task management application that supports:

- Multi-user authentication
- Real-time collaboration
- Owner-based access control
- Drag-and-drop task management
- Personal and team productivity views

The goal of this project was to move beyond a simple to-do list and implement production-level features such as secure Firestore rules, protected routes, and real-time synchronization.

---

## ✨ Core Features

### 🔐 Authentication
- Email + PIN login system
- Firebase Authentication
- Protected routes using React Router
- Automatic dashboard redirect on login

### 📊 Multi-User Task System
- Tasks stored in Firestore
- Each task linked to `ownerId`
- Personal Board (user-specific tasks)
- Team Board (all users’ tasks)
- Owner-only edit and delete permissions

### ⚡ Real-Time Updates
- Firestore `onSnapshot` listener
- Instant UI updates across sessions
- Drag-and-drop status persistence

### 🧠 Productivity Dashboard
- Task counters (Total / Todo / Doing / Done)
- Search filtering
- Clean SaaS-style UI
- Responsive layout

### 🎯 Drag & Drop
- Implemented using `@dnd-kit`
- Smooth task transitions between columns
- Firestore-backed persistence

---

## 🛠 Tech Stack

Frontend:
- React (Vite)
- React Router
- @dnd-kit (Drag and Drop)

Backend (BaaS):
- Firebase Authentication
- Cloud Firestore (NoSQL)

Deployment:
- Vercel

---

## 🔐 Firestore Security Model

Production-ready Firestore rules enforce:

- Only authenticated users can read tasks
- Only the task owner can update or delete
- Owner validation during task creation

This ensures secure multi-user isolation.

---

## 🏗 Architecture Overview

- Flat `tasks` collection in Firestore
- Each task contains:
  - `title`
  - `status`
  - `ownerId`
  - `createdAt`
- View mode dynamically changes Firestore query
- Real-time updates handled through snapshot listeners
- UI state mirrors Firestore as single source of truth

---

## 📦 Local Setup

```bash
git clone https://github.com/lissaintech/TaskFlow.git
cd TaskFlow
npm install
npm run dev

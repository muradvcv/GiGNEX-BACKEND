# 🚀 SkillSwap / GiGNEX Backend API
### 📌 Freelance Micro-Task Marketplace REST API Server

---

## 🌐 Live Project & Links

| Type | Link |
|------|------|
| 🌍 Live Frontend | https://gi-gnex.vercel.app/ |
| 🖥️ Backend Repository | https://github.com/muradvcv/GiGNEX-BACKEND |
| 💻 Client Repository | https://github.com/muradvcv/GiGNEX |

---

## 🔐 Admin Access

| Field | Value |
|------|------|
| Email | admin@gmail.com |
| Password | Murad123$$ |

---

## 📌 Project Overview

SkillSwap (GiGNEX Backend) is a **RESTful API system** for a freelance micro-task marketplace.

It supports:
- Task posting & management  
- Freelancer proposals  
- Stripe payment system  
- Admin control panel  
- Role-based authentication  

Built using:
Node.js • Express.js • MongoDB • JWT • Stripe • BetterAuth

---

## 🧑‍💻 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (HTTPOnly Cookies)
- BetterAuth (Google OAuth)
- Stripe Payment Gateway
- dotenv
- CORS

---

## 👥 User Roles

| Role | Description |
|------|-------------|
| 👤 Client | Posts tasks, hires freelancers, makes payments |
| 💼 Freelancer | Applies for tasks, completes work, earns money |
| 🛠️ Admin | Manages users, tasks, payments, and system safety |

---

## ⚙️ Core Features

### 🔑 Authentication System
- Email/password login
- Google OAuth login
- JWT secure sessions
- Role-based route protection

---

### 📌 Task Management
- Create / Edit / Delete tasks
- Status flow: **Open → In Progress → Completed**
- Category filtering & search

---

### 📩 Proposal System
- Freelancers submit proposals
- Client accepts/rejects proposals
- One freelancer per task approval

---

### 💰 Payment System (Stripe)
- Secure Stripe checkout
- Payment verification API
- Transaction history tracking

---

### ⭐ Review System
- Client rating freelancers
- Store feedback per task

---

## 🗄️ Database Schema

### 👤 Users Collection
name, email, image, role, skills, bio, isBlocked, createdAt

### 📌 Tasks Collection
title, category, description, budget, deadline, client_email, status, deliverable_url, createdAt

### 📩 Proposals Collection
task_id, freelancer_email, proposed_budget, estimated_days, cover_note, status, submitted_at

### 💳 Payments Collection
client_email, freelancer_email, task_id, amount, transaction_id, payment_status, paid_at

### ⭐ Reviews Collection
task_id, reviewer_email, reviewee_email, rating, comment, created_at

---

## 🔒 Security Features

- JWT Authentication (HTTPOnly cookies)
- Role-based access control (RBAC)
- Block / Unblock system
- Protected API routes
- Stripe payment validation

---

## 📊 API Endpoints

### 🔐 Auth Routes
- `/auth/login`
- `/auth/register`

### 📌 Task Routes
- `/tasks`

### 📩 Proposal Routes
- `/proposals`

### 💰 Payment Routes
- `/payments/create-checkout-session`
- `/payments/verify`

### 🛠️ Admin Routes
- `/admin/users`
- `/admin/tasks`

---

## 🧠 System Workflow

1. Client creates task  
2. Freelancer sends proposal  
3. Client accepts proposal  
4. Stripe payment success  
5. Task → In Progress  
6. Freelancer submits deliverable  
7. Task → Completed  
8. Review submitted  

---

## 🚀 Deployment Notes

- Backend deployed on production server
- MongoDB Atlas database used
- CORS configured for frontend
- Stripe test/live enabled
- Environment variables secured

---

## 📌 Important Requirements

- No login loss on refresh
- No CORS / 404 / server errors
- Clean UI with role dashboards
- Fully working production deployment

---

## 📞 Support

📱 WhatsApp: +8801787256994

---
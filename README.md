🚀 SkillSwap / GiGNEX Backend API
📌 Project Overview

SkillSwap (GiGNEX Backend) is a RESTful API server for a freelance micro-task marketplace platform.
It handles authentication, task management, proposals, payments, and admin control using Node.js, Express, MongoDB, Stripe, and BetterAuth/JWT.

🌐 Live & Repository Links
Type	Link
🌍 Live Frontend	https://gi-gnex.vercel.app/
🖥️ Backend Repo	https://github.com/muradvcv/GiGNEX-BACKEND
💻 Client Repo	https://github.com/muradvcv/GiGNEX
🔐 Admin Credentials
Field	Value
Admin Email	admin@gmail.com
Admin Password	Murad123$$
🧑‍💻 Tech Stack
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
BetterAuth (Google OAuth support)
Stripe Payment Gateway
dotenv for environment variables
CORS enabled API
👥 User Roles

The system supports 3 roles:

Role	Description
👤 Client	Posts tasks, hires freelancers, makes payments
💼 Freelancer	Applies for tasks, delivers work, earns money
🛠️ Admin	Manages users, tasks, and platform safety
⚙️ Core Features
🔑 Authentication
Email/Password login
Google OAuth login
JWT-based session security
Role-based route protection
📌 Task System
Create / Edit / Delete tasks
Task status: Open → In Progress → Completed
Category filtering & search support
📩 Proposal System
Freelancers submit proposals per task
Clients accept/reject proposals
Only one accepted proposal per task
💰 Payment System (Stripe)
Secure checkout integration
Payment confirmation endpoint
Transaction history tracking
⭐ Review System
Clients can rate freelancers
Store rating + feedback per task
🗄️ Database Schema
👤 Users Collection
Field	Type
name	String
email	String
image	String
role	String (client / freelancer / admin)
skills	Array
bio	String
isBlocked	Boolean
createdAt	Date
📌 Tasks Collection
Field	Type
title	String
category	String
description	String
budget	Number
deadline	Date
client_email	String
status	String
deliverable_url	String
createdAt	Date
📩 Proposals Collection
Field	Type
task_id	ObjectId
freelancer_email	String
proposed_budget	Number
estimated_days	Number
cover_note	String
status	String
submitted_at	Date
💳 Payments Collection
Field	Type
client_email	String
freelancer_email	String
task_id	ObjectId
amount	Number
transaction_id	String
payment_status	String
paid_at	Date
⭐ Reviews Collection
Field	Type
task_id	ObjectId
reviewer_email	String
reviewee_email	String
rating	Number
comment	String
created_at	Date
🔒 Security Features
JWT Authentication (HTTPOnly cookies)
Role-based access control (RBAC)
Block/unblock user system
Protected API routes
Stripe secure payment validation
📊 API Highlights
/auth/login
/auth/register
/tasks
/proposals
/payments/create-checkout-session
/payments/verify
/admin/users
/admin/tasks
🧠 Business Logic Flow
Client posts a task
Freelancer submits proposal
Client accepts proposal
Stripe payment completed
Task moves to In Progress
Freelancer submits deliverable
Task marked Completed
Review is added
🚀 Deployment Notes
Backend deployed on production server
CORS configured for frontend domain
Environment variables secured in .env
MongoDB Atlas used for database
Stripe in test/live mode supported
📌 Notes for Evaluation
Fully responsive frontend required
No refresh login loss (persistent auth)
No CORS / 404 / 500 errors in production
Clean UI + role-based dashboards
Minimum commits required (frontend + backend)
📞 Contact

If you face any issue:

📱 WhatsApp: +8801787256994
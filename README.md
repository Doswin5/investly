
# Investly – Full Stack Investment Portfolio Management System

This project demonstrates my ability to design and build a finance-focused fullstack portfolio management system with transaction processing, audit logging, role-based access control, reporting dashboards, secure financial record management, and production deployment.

---

# Investly – Full Stack Investment Portfolio Management System

Investly is a full-stack investment portfolio management application that allows users to register, log in securely, create investment portfolios, manage assets, record buy and sell transactions, track portfolio performance, monitor gains and losses, and review historical transaction activity.

The application also provides an admin portal for monitoring users, reviewing audit logs, overseeing portfolio activity, and managing account access while maintaining a complete audit trail of critical actions.

The application uses JWT authentication, MongoDB for data storage, and was fully deployed using Render (backend) and Vercel (frontend).

---

## Live Demo

Frontend:
https://investly-sigma.vercel.app/

Backend API:
https://investly-5gbl.onrender.com/

GitHub Repository:
https://github.com/Doswin5/investly

---

## Features

### Authentication
- User registration
- User login
- JWT authentication
- Protected backend routes
- Protected frontend routes
- Role-based authorization
- Persistent login using localStorage token storage
- Logout functionality
- Account status validation

### Portfolio Management
- Create investment portfolios
- Update portfolio information
- View portfolio performance
- Risk level categorisation
- Multi-currency portfolio support
- Portfolio ownership validation
- Protected portfolio access

### Asset Management
- Add assets to portfolios
- Track asset holdings
- Track average buy price
- Update current asset prices
- View current asset values
- Prevent duplicate assets within portfolios
- Prevent deletion of assets with transaction history

### Transaction Management
- Record buy transactions
- Record sell transactions
- Automatic holding updates
- Average cost calculations
- Transaction history tracking
- Prevent selling more than owned
- Backend transaction validation
- Financial record protection

### Dashboard & Reporting
- Portfolio value reporting
- Total invested amount tracking
- Gain/loss calculations
- Gain/loss percentage tracking
- Asset allocation charts
- Recent transaction summaries
- Admin system reporting dashboard

### Audit Logging
- Portfolio activity tracking
- Asset activity tracking
- Transaction activity tracking
- User management activity tracking
- Administrative audit trail
- Historical system records

### UX & Validation
- Loading states
- Empty states
- Dashboard charts
- Frontend validation
- Backend validation
- Error handling
- Responsive design

---

## Architecture

```txt
React Frontend
      |
      v
Express REST API
      |
      v
MongoDB Atlas
```

---

## Tech Stack

### Frontend
- React
- React Router
- Context API
- Axios
- Recharts
- Tailwind CSS
- Vite
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## Production Challenges I Solved

### Transaction Integrity
Implemented backend transaction validation to prevent invalid buy and sell activity and stop users from selling more units than they own.

### Portfolio Ownership Protection
Implemented backend ownership checks so users can only access and manage their own portfolios, assets, and transactions.

### Financial Calculations
Built backend calculations for invested value, portfolio value, gain/loss reporting, and average cost tracking.

### Audit Logging
Created a reusable audit logging system that records key user and admin actions for accountability and traceability.

### Role-Based Access Control
Implemented user and admin permissions using protected routes and middleware validation.

### Data Protection Rules
Prevented deletion of portfolios and assets that contain financial history to preserve reporting accuracy.

### Deployment & Environment Management
Configured secure frontend/backend communication between Vercel and Render environments using environment variables and CORS policies.

---

## Key Lessons Learned

- Designing finance-style data models
- Building transaction processing workflows
- Protecting financial records from invalid operations
- Implementing role-based access control
- Creating audit logging systems
- Building reporting dashboards
- Structuring scalable REST APIs
- Combining frontend and backend validation
- Managing MongoDB relationships and calculations
- Deploying production-ready fullstack applications


---

## Future Improvements

- Portfolio performance trends
- Historical valuation tracking
- Report exports (PDF/Excel)
- Advanced filtering and search
- Portfolio comparison reports
- Notification system
- Pagination for audit logs
- Advanced analytics dashboard

---

## CV Highlights

This project demonstrates:

- Full-stack application architecture
- Financial transaction processing
- Backend business logic
- Audit logging systems
- Reporting dashboards
- Secure authentication and authorization
- MongoDB data modelling
- Production deployment
- REST API development

---

## Author

Built by Dosunmu Ayomide

Full Stack Developer focused on building secure, scalable, and production-ready web applications.

GitHub:
https://github.com/Doswin5

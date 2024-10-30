# COSC 4353 - Animal Volunteer System
---
# Team 13 Members:
- **Afra Nawar** [afnawar910](https://github.com/afnawar910)
- **Jennifer Nguyen** [Jenblr](https://github.com/Jenblr)
- **Jonathan Hsueh** [Tuudou](https://github.com/tuudou)
- **Sofia Davila** [Sofiad98](https://github.com/Sofiad98)
---
# Technology Stack
- **Frontend:** ReactJS
- **Backend:** NodeJS with ExpressJS
- **Database:** PostgreSQL
---
# Packages Installed
**Frontend**
- npm install
- npm install react-router-dom
- npm install @fortawesome/react-fontawesome
- npm install @fortawesome/free-solid-svg-icons
- npm install react-select
- npm install react-datepicker
- npm install axios

**Backend**
- npm install express bcryptjs jsonwebtoken dotenv
- npm install --save-dev jest supertest nodemon
- npm install cors
- npm install express-validator

**Unit Testing**
- npm install --save-dev jest supertest

---
# Installation
- **Requirements:**
    - Clone this repository: https://github.com/Jenblr/COSC-4353-Animal-Volunteer-System
    - **Backend:**  
        - Go to backend folder → ```cd backend```
        - Start server → ```npx nodemon src/app.js```
    - **Frontend:**
        - Go to client folder → ```cd volunteer-system```
        - Start server → ```npm start```

---
# Notes
- You have to start the backend up first, then the frontend
- A lot of forms are empty because an admin would need to sign in and create something, or a user needs to be registered
    - EX: Calendar = For a future event to display, an admin would need to go to Event Management to create events
    - EX: Volunteer History = A user needs to be registered first and then log in for the dropdown menu to populate with the volunteer's info
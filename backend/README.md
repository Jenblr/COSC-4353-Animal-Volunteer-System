# Animal Volunteer System Backend
<hr style="border: 3px dashed ;">

## Backend: 
- Go to backend folder → ```cd backend```
- Start server → ```npx nodemon src/app.js```
- Download Postman (or Postman extension on VScode)

<hr style="border: 3px dashed ;">

## Authentication Module
### Files
- authRoutes.js
- authMiddleware.js
- authController.js

---

### Authentication Endpoints Testing: Postman
1. **Create collection:** 'Authentication and User Roles Tests'
2. **Add new requests to the collection:**
    - 'User Registration'
    - 'Login User'
    - 'User Access Protected Route'
    - 'Admin Access Protected Route'

---

### POST requests:
**Requests**
- 'User Registration'
- 'Login User'

**Headers**
- **Key:** Content-Type
- **Value:** application/json

**Body**
- raw
- input: 
{
    "username": "testuser",
    "password": "password1234"
}
---
### GET requests:
**Requests**
- 'User Access Protected Route'
- 'Admin Access Protected Route'

**Authorization**
- **Type:** Bearer Token
- **Value:** token generated from 'Login User'

<hr style="border: 3px dashed ;">
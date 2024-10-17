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
2. **Add new environment:** 'Local Environment'
    - **Variable:** baseURL ; **Type:** default; **Initial Value:** 'http://localhost:5000/api'
    - **Variable:** token ; **Type:** default
3. **Add new requests to the collection:**
    - 'User Registration'
    - 'Login User'
    - 'Admin Login Request'
    - 'User Access Protected Route'
    - 'Admin Access Protected Route'
4. **Choose Environment:** (Top right corner) 'Local Environment'
5. **URL:** {{baseURL}}/auth/ [INSERT ROUTE FOR SPECIFIC REQUEST FILE]

---

### POST requests:

**Requests**
- 'User Registration'
- 'Login User'
- 'Admin Login Request'

**Headers**
- **Key:** Content-Type
- **Value:** application/json

**Body**
<<<<<<< HEAD
- raw
- input: 
=======
- **SELECT:** raw
- **Input for User Registration + Login User requests:**
>>>>>>> origin/JenniferN
{
    "username": "testuser",
    "password": "password1234"
}
<<<<<<< HEAD
=======
- **Tests Tab Input for Login User requests:**
const jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);

- **Input for Admin Login Request:**
{
    "email": "admin@example.com",
    "password": "adminpassword"
}

- **Tests Tab Input for Admin Login Request:**
const jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);

>>>>>>> origin/JenniferN
---
### GET requests:
**Requests**
- 'User Access Protected Route'
- 'Admin Access Protected Route'

**Authorization**
- **Type:** Bearer Token
- **Value:** token generated from 'user/admin login' : {{token}}

<hr style="border: 3px dashed ;">
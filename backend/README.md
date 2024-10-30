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
- **SELECT:** raw
- **Input for User Registration + Login User requests:**
{
    "username": "testuser",
    "password": "password1234"
}
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

---
### GET requests:
**Requests**
- 'User Access Protected Route'
- 'Admin Access Protected Route'

**Authorization**
- **Type:** Bearer Token
- **Value:** token generated from 'user/admin login' : {{token}}

<hr style="border: 3px dashed ;">


const events = [
  {
    id: 1,
    eventName: 'Animal Shelter Cleanup',
    eventDescription: 'Join us for a day of cleaning and organizing the animal shelter. Help us provide a clean and comfortable space for the animals.',
    address1: '1234 Paw Street',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    requiredSkills: ['Cleaning', 'Organizing shelter donations'],
    urgency: 'Medium',
    eventDate: '2024-10-15',
    startTime: '09:00',
    endTime: '12:00',
  },
  {
    id: 2,
    eventName: 'Laundry Day for the Pups',
    eventDescription: 'Help wash and fold bedding and towels to keep the animals comfortable and clean. Your help is greatly appreciated!',
    address1: '7890 Fetch Drive',
    city: 'El Paso',
    state: 'TX',
    zipCode: '79901',
    requiredSkills: ['Helping with laundry', 'Cleaning'],
    urgency: 'Medium',
    eventDate: '2024-11-10',
    startTime: '08:00',
    endTime: '12:00'
  },
  {
    id: 3,
    eventName: 'Adoption Drive',
    eventDescription: 'Help potential adopters find their new best friend. Assist with paperwork, introduce the animals, and answer questions.',
    address1: '3456 Purr Road',
    city: 'San Antonio',
    state: 'TX',
    zipCode: '78201',
    requiredSkills: ['Assisting potential adopters', 'Medication'],
    urgency: 'Critical',
    eventDate: '2024-11-01',
    startTime: '09:00',
    endTime: '17:00'
  }
];

<hr style="border: 3px dashed ;">

### Staring up db
**npx sequelize-cli db:create**

Sequelize CLI [Node: 20.10.0, CLI: 6.6.2, ORM: 6.37.4]

Loaded configuration file "config\config.json".
Using environment "development".
Database volunteer_system_dev created.

**npx sequelize-cli db:migrate**

Sequelize CLI [Node: 20.10.0, CLI: 6.6.2, ORM: 6.37.4]

Loaded configuration file "config\config.json".
Using environment "development".
Database volunteer_system_dev created.

**npx sequelize-cli db:seed:all**
Using environment "development".
== 20241025-create-user: migrating =======
== 20241025-create-user: migrated (0.019s)

PS C:\Users\JenNg\OneDrive\Documents\University of Houston\Fall 2024\COSC 4353 - Software Design\COSC-4353-Animal-Volunteer-System\backend> npx sequelize-cli db:seed:all
== 20241025-create-user: migrated (0.019s)

<hr style="border: 3px dashed ;">

## FLOW OF PROGRAM

### REGISTRATION

**1. User registers**
  - Creates temporary user
  - Returns registration token

**2. User fills profile form**
  - Verifies registration token
  - Creates profile
  - Finalizes registration
  - Updates user status

**3. User can then log in**
  - Checks if user is fully registered
  - Validates credentials
  - Returns auth token and role
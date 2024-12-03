# **Nourish App - Backend API Documentation**

## **Authentication (Auth)**

### **Register**
- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "User 1",
    "email": "user1@gmail.com",
    "password": "password123"
  }

### **Login**
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user1@gmail.com",
    "password": "password123"
  }

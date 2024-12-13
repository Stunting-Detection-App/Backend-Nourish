# **Cloud Computing Architecture for Nourish Application**

## Overview
The *Nourish* application leverages cloud computing to support its functionality, primarily focusing on utilizing Google Cloud services for data storage and backend processing. The machine learning model is deployed *on-device*, ensuring that predictions are made locally on the user's device, while the cloud is used to handle data storage, user uploads, and scalable backend services.

## Architecture Components

### 1. **On-Device Model Deployment**
The machine learning model is deployed on the user's device, ensuring predictions are made locally without requiring constant internet connectivity. This approach enhances performance, reduces latency, and ensures user privacy by processing data on the device.

### 2. **Cloud Storage for User Data**
Google Cloud Storage is used to store the user-uploaded data, such as photos and nutritional information. This ensures that user data is securely stored, easily accessible, and scalable as the number of users grows. Data stored in Cloud Storage is readily available for retrieval by the app when needed.

### 3. **Backend Services (App Engine)**
In the *Nourish* application, users can upload images along with their journal entries. These images are securely stored in Google Cloud Storage, allowing users to access their past journal entries with associated images seamlessly. 

When a user submits a journal entry through the app:
1. The image is uploaded to Google Cloud Storage.
2. The URL of the uploaded image is stored in the database (Cloud SQL) alongside other journal data (e.g., description, latitude, longitude).
3. The app retrieves the image from Cloud Storage when displaying the journal entries.

This allows users to upload and retrieve images easily, while also benefiting from Google Cloud's scalability and security.

### 4. **Cloud SQL for Data Management**
Cloud SQL is used to manage structured data related to nutrition, user profiles, journal entries, and prediction results. The database stores essential information, including user details, nutrition data, journal entries, prediction results, and session information. The backend queries Cloud SQL to retrieve or store data, ensuring that user interactions are efficiently managed.

### 5. **Data Flow in the Application**
- Users interact with the mobile app, which collects input data and makes predictions using the *on-device* model.
- Uploaded files, such as nutritional data or images, are stored in Cloud Storage.
- The backend queries Cloud SQL for relevant data, including nutrition information, user preferences, and journal entries, and stores any new user-generated content in the database.
- Cloud services ensure scalability, security, and availability for the application.

## Benefits of Cloud Architecture
- **Scalability:** Cloud services like App Engine and Cloud Storage automatically scale to accommodate increasing numbers of users without manual intervention.
- **Performance:** The *on-device* model minimizes the need for network calls, reducing latency and ensuring fast, offline predictions.
- **Security:** Sensitive user data is stored securely in Google Cloud Storage and Cloud SQL, with proper encryption and access controls.



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



## **Journal**

### **Create Journal**
- **Endpoint**: `/journal`
- **Method**: `POST`
- **Headers:**
  ```json
  {
      "Authorization": "Bearer <your_token>",
      "Content-Type": "multipart/form-data"
  }
- **Body (form-data):**


| Key         | Type     | Description                           |
|-------------|----------|---------------------------------------|
| `photo`     | File     | Gambar jurnal (wajib).               |
| `description` | String  | Deskripsi jurnal (wajib).            |
| `latitude`  | String   | Lokasi latitude (opsional).          |
| `longitude` | String   | Lokasi longitude (opsional).         |


### **Get Journal**
- **Endpoint**: `/journal`
- **Method**: `GET`
- **Headers:**
  ```json
  {
      "Authorization": "Bearer <your_token>",
      "Content-Type": "multipart/form-data"
  }



## **Nutrition**
- **Endpoint**: `/nutrition/classification`
- **Method**: `GET`
- **Query Parameters:**
- `classification` (required): The classification level to filter food recommendations. Valid values are:
  - `0` - Severely Stunted
  - `1` - Stunted
  - `2` - Normal
  - `3` - High

[Postman Url](https://drive.google.com/drive/folders/16HKeUbVj5d60eYlkc9oxulc6upzshpsr?usp=sharing) 


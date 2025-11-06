# API Documentation

This document provides instructions for interacting with the NovoPath Clinic Platform API.

## Authentication

All API requests must be authenticated using an API key. The API key must be included in the `x-api-key` header of each request.

**Example:**

```
x-api-key: my-secret-api-key
```

## Endpoints

### Patients

*   **GET /api/v1/patients**
    *   **Description:** Retrieves a list of all patients.
    *   **Response:**
        *   `200 OK`: A JSON array of patient objects.
        ```json
        [
          {
            "id": 1,
            "name": "John Doe",
            "email": "john.doe@example.com"
          }
        ]
        ```

### Appointments

*   **GET /api/v1/appointments**
    *   **Description:** Retrieves a list of all appointments.
    *   **Response:**
        *   `200 OK`: A JSON array of appointment objects.
        ```json
        [
          {
            "id": 1,
            "patientId": 1,
            "date": "2024-10-26T10:00:00Z",
            "reason": "Annual Checkup"
          }
        ]
        ```

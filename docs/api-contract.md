# sbuweb API Contract Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1`  
**Content-Type:** `application/json`  

This document specifies the HTTP API contracts for authentication and profile management modules. The endpoints are implemented with strict separation, ready for Supabase Auth and PostgreSQL integration.

---

## 1. Global Response & Error Format

All API responses follow a predictable JSON schema.

### 1.1 Success Response Schema
```json
{
  "success": true,
  "message": "Optional human-readable description",
  "data": { ... }
}
```

### 1.2 Error Response Schema
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable error description",
    "details": [ ... ] // Optional validation details or stack traces in development
  }
}
```

### 1.3 Standard Error Codes
| Status Code | Error Code | Description |
| :--- | :--- | :--- |
| `400` | `VALIDATION_ERROR` | Request payload failed schema validation (Zod). |
| `400` | `INVALID_JSON` | Malformed JSON in request body. |
| `401` | `UNAUTHORIZED` | Bearer token is missing, expired, or invalid. |
| `403` | `FORBIDDEN` | Authenticated user lacks permission (e.g. non-owner accessing owner routes). |
| `404` | `NOT_FOUND` | Requested entity (profile or endpoint) does not exist. |
| `503` | `SERVICE_UNAVAILABLE` | Backend service or database dependency (Supabase) is not yet configured. |
| `500` | `INTERNAL_SERVER_ERROR` | Unexpected internal server error. |

---

## 2. Authentication Headers

Protected endpoints require the standard `Authorization` header:

```http
Authorization: Bearer <SUPABASE_JWT_ACCESS_TOKEN>
```

---

## 3. Client Authentication Endpoints

### 3.1 Register Client
Creates a new client account in Supabase Auth and provisions a linked record in `client_profiles`. Client registration **never** grants owner permissions.

- **Method:** `POST`
- **Path:** `/api/v1/auth/client/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "StrongPassword123!",
    "country": "United States",
    "whatsappNumber": "+12025550143"
  }
  ```
- **Validation Rules:**
  - `fullName`: string, required, min 2, max 100 characters.
  - `email`: string, required, valid email format.
  - `password`: string, required, min 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.
  - `country`: string, required, min 2, max 100 characters.
  - `whatsappNumber`: string, optional, E.164 phone regex format (`^\+?[1-9]\d{6,14}$`).
- **Expected Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Client account registered successfully",
    "data": {
      "user": {
        "id": "e6f4325a-4938-4e89-bd0f-239f1c7d3ba4",
        "email": "jane.doe@example.com",
        "role": "client"
      },
      "profile": {
        "id": "e6f4325a-4938-4e89-bd0f-239f1c7d3ba4",
        "fullName": "Jane Doe",
        "country": "United States",
        "whatsappNumber": "+12025550143",
        "createdAt": "2026-10-15T12:00:00.000Z",
        "updatedAt": "2026-10-15T12:00:00.000Z"
      },
      "token": "<JWT_ACCESS_TOKEN>"
    }
  }
  ```
- **Service Unconfigured Response (`503 Service Unavailable`):**
  ```json
  {
    "success": false,
    "error": {
      "code": "SERVICE_UNAVAILABLE",
      "message": "Authentication provider (Supabase Auth) is not connected. User registration is currently unavailable."
    }
  }
  ```

---

### 3.2 Client Login
Authenticates an existing client using email and password.

- **Method:** `POST`
- **Path:** `/api/v1/auth/client/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "jane.doe@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Validation Rules:**
  - `email`: string, required, valid email.
  - `password`: string, required.
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Client logged in successfully",
    "data": {
      "user": {
        "id": "e6f4325a-4938-4e89-bd0f-239f1c7d3ba4",
        "email": "jane.doe@example.com",
        "role": "client"
      },
      "profile": {
        "id": "e6f4325a-4938-4e89-bd0f-239f1c7d3ba4",
        "fullName": "Jane Doe",
        "country": "United States",
        "whatsappNumber": "+12025550143",
        "createdAt": "2026-10-15T12:00:00.000Z",
        "updatedAt": "2026-10-15T12:00:00.000Z"
      },
      "token": "<JWT_ACCESS_TOKEN>"
    }
  }
  ```

---

### 3.3 Logout
Invalidates the current session token with the authentication provider.

- **Method:** `POST`
- **Path:** `/api/v1/auth/logout`
- **Access:** Public or Authenticated (Bearer Token optional)
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Successfully logged out"
  }
  ```

---

## 4. Client Profile Endpoints

### 4.1 Get Client Profile
Retrieves the profile of the currently authenticated client.

- **Method:** `GET`
- **Path:** `/api/v1/client/profile`
- **Access:** Authenticated (`client` or `owner`)
- **Headers:** `Authorization: Bearer <token>`
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "e6f4325a-4938-4e89-bd0f-239f1c7d3ba4",
        "email": "jane.doe@example.com",
        "role": "client"
      },
      "profile": {
        "id": "e6f4325a-4938-4e89-bd0f-239f1c7d3ba4",
        "fullName": "Jane Doe",
        "country": "United States",
        "whatsappNumber": "+12025550143",
        "createdAt": "2026-10-15T12:00:00.000Z",
        "updatedAt": "2026-10-15T12:00:00.000Z"
      }
    }
  }
  ```

---

### 4.2 Update Client Profile
Updates profile fields for the authenticated client.

- **Method:** `PATCH`
- **Path:** `/api/v1/client/profile`
- **Access:** Authenticated (`client`)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body (all fields optional):**
  ```json
  {
    "fullName": "Jane Smith Doe",
    "country": "Canada",
    "whatsappNumber": "+14165550199"
  }
  ```
- **Validation Rules:**
  - `fullName`: string, min 2, max 100 characters.
  - `country`: string, min 2, max 100 characters.
  - `whatsappNumber`: valid international format or null/empty.
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Client profile updated successfully",
    "data": {
      "user": {
        "id": "e6f4325a-4938-4e89-bd0f-239f1c7d3ba4",
        "email": "jane.doe@example.com",
        "role": "client"
      },
      "profile": {
        "id": "e6f4325a-4938-4e89-bd0f-239f1c7d3ba4",
        "fullName": "Jane Smith Doe",
        "country": "Canada",
        "whatsappNumber": "+14165550199",
        "createdAt": "2026-10-15T12:00:00.000Z",
        "updatedAt": "2026-10-15T12:30:00.000Z"
      }
    }
  }
  ```

---

## 5. Owner Authentication Endpoints

Owners are company-provisioned administrative users. Public registration for owners is forbidden.

### 5.1 Owner Login
Authenticates company-provisioned credentials and verifies active owner status in `owner_accounts`.

- **Method:** `POST`
- **Path:** `/api/v1/auth/owner/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "company-owner@sbuweb.internal",
    "password": "SecureEnterprisePassword123!"
  }
  ```
- **Validation Rules:**
  - `email`: string, required, valid email.
  - `password`: string, required.
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Owner authenticated successfully",
    "data": {
      "user": {
        "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "email": "company-owner@sbuweb.internal",
        "role": "owner"
      },
      "token": "<JWT_ACCESS_TOKEN>"
    }
  }
  ```
- **Forbidden Error Response (`403 Forbidden`):**
  Returned if credentials authenticate in auth.users, but the account is not registered in `owner_accounts` or is deactivated.
  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Unauthorized: Account does not possess active owner privileges."
    }
  }
  ```

---

### 5.2 Get Owner Status (`/me`)
Retrieves the owner status and administrative verification for the caller.

- **Method:** `GET`
- **Path:** `/api/v1/owner/me`
- **Access:** Owner-only (`authMiddleware` + `ownerMiddleware`)
- **Headers:** `Authorization: Bearer <token>`
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "email": "company-owner@sbuweb.internal",
        "role": "owner"
      },
      "owner": {
        "userId": "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
        "isActive": true,
        "createdAt": "2026-10-15T10:00:00.000Z",
        "role": "owner"
      }
    }
  }
  ```
- **Client Access Attempt (`403 Forbidden`):**
  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Access forbidden: verified owner status is required"
    }
  }
  ```

# TODO: Resolve All Issues and Ensure Full Functionality

## Step 1: Migrate Auth Microservice to DynamoDB

- [ ] Update microservices/auth/server.js: Replace in-memory users with User model using DynamoDB

## Step 2: Migrate EMR Microservice to DynamoDB

- [ ] Update microservices/emr/server.js: Change health check to DynamoDB
- [ ] Implement microservices/emr/controllers/authController.js: Add register, login, verifyToken using DynamoDB
- [ ] Create microservices/emr/models/User.js: Define DynamoDB operations for User
- [ ] Create microservices/emr/models/Patient.js: Define DynamoDB operations for Patient
- [ ] Update microservices/emr/controllers/patientController.js: Use DynamoDB models

## Step 3: Migrate Notes Microservice to DynamoDB

- [ ] Update microservices/notes/package.json: Ensure DynamoDB deps
- [ ] Update microservices/notes/db.js: Confirm DynamoDB setup
- [ ] Create microservices/notes/models/Note.js: Define DynamoDB operations
- [ ] Update microservices/notes/controllers/noteController.js: Use DynamoDB
- [ ] Update microservices/notes/server.js: Health check to DynamoDB

## Step 4: Migrate Scheduling Microservice to DynamoDB

- [ ] Update microservices/scheduling/package.json: Ensure DynamoDB deps
- [ ] Update microservices/scheduling/db.js: Confirm DynamoDB setup
- [ ] Create microservices/scheduling/models/Appointment.js: Define DynamoDB operations
- [ ] Update microservices/scheduling/controllers/schedulingController.js: Use DynamoDB
- [ ] Update microservices/scheduling/server.js: Health check to DynamoDB

## Step 5: Migrate Video Microservice to DynamoDB

- [ ] Update microservices/video/package.json: Ensure DynamoDB deps
- [ ] Update microservices/video/db.js: Confirm DynamoDB setup
- [ ] Create microservices/video/models/VideoSession.js: Define DynamoDB operations
- [ ] Update microservices/video/controllers/videoController.js: Use DynamoDB
- [ ] Update microservices/video/server.js: Health check to DynamoDB

## Step 6: Setup DynamoDB Tables and Data

- [ ] Run scripts/generate-dynamodb-import.cjs to generate dynamodb-import.json
- [ ] Create DynamoDB tables (users, patients, appointments, notes, video_sessions, etc.)
- [ ] Import mock data into DynamoDB tables

## Step 7: Update Frontend Services

- [ ] Update src/services/apiService.ts: Connect to DynamoDB-powered microservices
- [ ] Update src/services/emr.ts: Migrate to DynamoDB operations
- [ ] Update src/services/emrApiClient.ts: Use DynamoDB APIs
- [ ] Update src/services/patientRecordService.ts: Use DynamoDB
- [ ] Update other services to use DynamoDB

## Step 8: Add Missing Frontend Pages

- [ ] Create src/pages/auth/LoginPage.tsx
- [ ] Create src/pages/auth/RegisterPage.tsx
- [ ] Create src/pages/auth/RegisterPatientPage.tsx
- [ ] Create src/pages/patient/Dashboard.tsx
- [ ] Update src/App.tsx: Add auth and patient routes

## Step 9: Update Frontend Pages for Uniqueness and Integration

- [ ] Update src/pages/WelcomePage.tsx: Add unique page ID, integrate DynamoDB features
- [ ] Update src/pages/FeaturesPage.tsx: Add unique page ID, integrate features
- [ ] Update src/pages/ForProvidersPage.tsx: Add unique page ID, integrate features
- [ ] Update src/pages/TestimonialsPage.tsx: Add unique page ID, integrate features
- [ ] Update all pages in src/pages/admin/, auth/, patient/, provider/: Add unique IDs, connect to APIs

## Step 10: Install Dependencies and Test

- [ ] Install npm dependencies in each microservice
- [ ] Run e2e tests to verify functionality
- [ ] Run full integration tests
- [ ] Verify end-to-end operation

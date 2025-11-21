# TODO: Migrate All Backend Microservices to DynamoDB and Update Frontend Pages

## Backend Migration Tasks (All Microservices: auth, emr, notes, scheduling, video)

### Auth Microservice

- [ ] Update microservices/auth/package.json: Remove pg, add @aws-sdk/client-dynamodb and @aws-sdk/lib-dynamodb
- [ ] Update microservices/auth/db.js: Replace PostgreSQL connection with DynamoDB client using AWS SDK
- [ ] Create microservices/auth/models/ directory with model files (User.js, etc.) defining DynamoDB operations
- [ ] Update microservices/auth/controllers/authController.js: Convert SQL queries to DynamoDB put, get, update, delete operations using models
- [ ] Update microservices/auth/server.js: Ensure health check uses DynamoDB instead of PostgreSQL

### EMR Microservice

- [ ] Update microservices/emr/package.json: Remove pg, add @aws-sdk/client-dynamodb and @aws-sdk/lib-dynamodb
- [ ] Update microservices/emr/db.js: Replace PostgreSQL connection with DynamoDB client using AWS SDK
- [ ] Create microservices/emr/models/ directory with model files (User.js, Appointment.js, etc.) defining DynamoDB operations
- [ ] Update microservices/emr/controllers/patientController.js: Convert SQL queries to DynamoDB put, get, update, delete operations using models
- [ ] Implement microservices/emr/controllers/authController.js: Add register, login, verifyToken using DynamoDB for user storage
- [ ] Update microservices/emr/server.js: Ensure health check uses DynamoDB instead of PostgreSQL

### Notes Microservice

- [ ] Update microservices/notes/package.json: Remove pg, add @aws-sdk/client-dynamodb and @aws-sdk/lib-dynamodb
- [ ] Update microservices/notes/db.js: Replace PostgreSQL connection with DynamoDB client using AWS SDK
- [ ] Create microservices/notes/models/ directory with model files (Note.js, etc.) defining DynamoDB operations
- [ ] Update microservices/notes/controllers/noteController.js: Convert SQL queries to DynamoDB put, get, update, delete operations using models
- [ ] Update microservices/notes/server.js: Ensure health check uses DynamoDB instead of PostgreSQL

### Scheduling Microservice

- [ ] Update microservices/scheduling/package.json: Remove pg, add @aws-sdk/client-dynamodb and @aws-sdk/lib-dynamodb
- [ ] Update microservices/scheduling/db.js: Replace PostgreSQL connection with DynamoDB client using AWS SDK
- [ ] Create microservices/scheduling/models/ directory with model files (Appointment.js, etc.) defining DynamoDB operations
- [ ] Update microservices/scheduling/controllers/schedulingController.js: Convert SQL queries to DynamoDB put, get, update, delete operations using models
- [ ] Update microservices/scheduling/server.js: Ensure health check uses DynamoDB instead of PostgreSQL

### Video Microservice

- [ ] Update microservices/video/package.json: Remove pg, add @aws-sdk/client-dynamodb and @aws-sdk/lib-dynamodb
- [ ] Update microservices/video/db.js: Replace PostgreSQL connection with DynamoDB client using AWS SDK
- [ ] Create microservices/video/models/ directory with model files (VideoSession.js, etc.) defining DynamoDB operations
- [ ] Update microservices/video/controllers/videoController.js: Convert SQL queries to DynamoDB put, get, update, delete operations using models
- [ ] Update microservices/video/server.js: Ensure health check uses DynamoDB instead of PostgreSQL

### General Backend Tasks

- [ ] Run scripts/generate-dynamodb-import.cjs to generate dynamodb-import.json for all microservices
- [ ] Create DynamoDB tables for all microservices (users, appointments, provider_plans, patient_plans, progress_notes, messages, lab_orders, referrals, audit_log, encounters, notes, video_sessions, etc.)
- [ ] Import mock data into DynamoDB tables using AWS CLI or SDK
- [ ] Install updated dependencies (npm install in each microservice directory)
- [ ] Test API endpoints for CRUD operations across all microservices

## Frontend Update Tasks

### Page Uniqueness and Advanced DynamoDB Integration

- [ ] Update src/pages/WelcomePage.tsx: Add unique page ID, integrate advanced DynamoDB features (e.g., real-time data fetch)
- [ ] Update src/pages/FeaturesPage.tsx: Add unique page ID, integrate advanced DynamoDB features
- [ ] Update src/pages/ForProvidersPage.tsx: Add unique page ID, integrate advanced DynamoDB features
- [ ] Update src/pages/TestimonialsPage.tsx: Add unique page ID, integrate advanced DynamoDB features
- [ ] Update all pages in src/pages/admin/: Add unique page IDs, unique data flow/logic, connect to DynamoDB APIs
- [ ] Update all pages in src/pages/auth/: Add unique page IDs, unique data flow/logic, connect to DynamoDB APIs
- [ ] Update all pages in src/pages/patient/: Add unique page IDs, unique data flow/logic, connect to DynamoDB APIs
- [ ] Update all pages in src/pages/provider/: Add unique page IDs, unique data flow/logic, connect to DynamoDB APIs

### Service Updates

- [ ] Update src/services/advancedEMRClient.ts: Integrate with new DynamoDB backend APIs
- [ ] Update src/services/advancedEMRFeatures.ts: Use advanced DynamoDB features (e.g., streams for real-time)
- [ ] Update src/services/apiService.ts: Connect to DynamoDB-powered microservices
- [ ] Update src/services/emr.ts: Migrate to DynamoDB operations
- [ ] Update src/services/emrApiClient.ts: Use DynamoDB APIs
- [ ] Update src/services/emrIntegrationService.ts: Integrate advanced DynamoDB features
- [ ] Update src/services/patientRecordService.ts: Use DynamoDB for records
- [ ] Update src/services/realTimeSyncEngine.ts: Leverage DynamoDB streams for real-time sync
- [ ] Update other relevant services in src/services/ to use DynamoDB

## Final Tasks

- [ ] Update TODO.md to reflect completed tasks
- [ ] Run full integration tests for frontend and backend
- [ ] Verify all pages are unique and connected to advanced DynamoDB backend

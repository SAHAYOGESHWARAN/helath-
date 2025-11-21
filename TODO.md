# TODO: Migrate EMR Microservice to DynamoDB

## Tasks

- [ ] Update microservices/emr/package.json: Remove pg, add @aws-sdk/client-dynamodb and @aws-sdk/lib-dynamodb
- [ ] Update microservices/emr/db.js: Replace PostgreSQL connection with DynamoDB client using AWS SDK
- [ ] Create microservices/emr/models/ directory with model files (User.js, Appointment.js, etc.) defining DynamoDB operations
- [ ] Update microservices/emr/controllers/patientController.js: Convert SQL queries to DynamoDB put, get, update, delete operations using models
- [ ] Implement microservices/emr/controllers/authController.js: Add register, login, verifyToken using DynamoDB for user storage
- [ ] Update microservices/emr/server.js: Ensure health check uses DynamoDB instead of PostgreSQL
- [ ] Run scripts/generate-dynamodb-import.cjs to generate dynamodb-import.json
- [ ] Create DynamoDB tables (users, appointments, provider_plans, patient_plans, progress_notes, messages, lab_orders, referrals, audit_log, encounters)
- [ ] Import mock data into DynamoDB tables using AWS CLI or SDK
- [ ] Install updated dependencies (npm install in emr directory)
- [ ] Test API endpoints for CRUD operations
- [ ] Update TODO.md to reflect completed migration tasks

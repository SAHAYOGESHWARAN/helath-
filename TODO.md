# TODO: Resolve Signin and Signup Pages

## Issues Identified

- User model in microservices/auth/models/User.js uses static methods but authController expects instance methods (save, comparePassword).
- Missing password hashing with bcrypt in User model.
- Missing route files: microservices/notes/routes/noteRoutes.js and microservices/video/routes/videoRoutes.js.
- Mismatch in microservices/emr/routes/patientRoutes.js: uses getPatients but controller exports getAllPatients.

## Steps to Resolve

1. Update User model in microservices/auth/models/User.js to include instance methods: constructor, save, comparePassword, hashPassword with bcrypt.
2. Create noteRoutes.js for notes service.
3. Create videoRoutes.js for video service.
4. Fix patientRoutes.js to use correct controller function name.
5. Test microservices startup with npm run start:all.
6. Test signin/signup pages functionality with browser.

## Progress

- [x] Step 1: Update User model
- [x] Step 2: Create noteRoutes.js
- [x] Step 3: Create videoRoutes.js
- [x] Step 4: Fix patientRoutes.js
- [x] Step 5: Test services startup
- [ ] Step 6: Test pages in browser (requires manual testing as browser tool is disabled)

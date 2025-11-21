# TODO: Update API Endpoints for User Operations

- [x] Add `getUser` and `updateUser` functions to `microservices/emr/controllers/authController.js`
- [x] Add GET `/user/:id` and PUT `/user/:id` routes to `microservices/emr/routes/authRoutes.js`
- [x] Update `apiGetUser` and `apiUpdateUser` in `src/services/apiService.ts` to use `/emr/auth/user/${userId}`

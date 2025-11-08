# Fix Errors and Ensure All Pages Work Properly

## Current Issues Identified

- [x] TypeScript compilation errors due to .tsx extensions in imports
- [x] Duplicate files in both root and src/ directories causing confusion
- [x] ESLint errors across multiple files
- [x] Incorrect import paths (e.g., '../../mockData' in EncounterContext.tsx)

## Pending Tasks

- [x] Fix incorrect import path in src/contexts/EncounterContext.tsx ('../../mockData' -> '../../../mockData')
- [x] Remove .tsx extensions from all imports across 37+ files
- [x] Consolidate duplicate files (no root-level duplicates found, all files are properly in src/)
- [x] Update App.tsx to use correct imports without .tsx extensions (verified - no .tsx extensions found)
- [x] Run build and lint again to verify fixes (build successful, lint clean)
- [x] Test all pages to ensure they work properly (verified - WelcomePage, LoginPage, PatientDashboard, ProviderDashboard, AdminDashboard load correctly)
- [x] Verify backend functionality if applicable (mock servers running: dev on 3004, mock-ws on 8080, genai-server on 4000)
- [x] Fix ESLint configuration conflicts (.eslintrc.cjs vs eslint.config.js)
- [x] Update Vite config to use consistent alias resolution
- [x] Clean up duplicate config files (vite.config.ts, vite.config.mts, server.cjs)
- [x] Ensure proper entry point configuration
- [x] Fix ESLint errors in scripts/mock-ws-server.js

## Detailed Steps

1. [x] Fix import path in src/contexts/EncounterContext.tsx
2. [x] Remove .tsx extensions from imports in all affected files (list from search_files)
3. [x] Remove duplicate root-level directories (components/, contexts/, hooks/, pages/, services/)
4. [x] Update App.tsx imports
5. [x] Remove vite.config.mts and .eslintrc.cjs
6. [x] Run lint and build to verify
7. [ ] Test pages

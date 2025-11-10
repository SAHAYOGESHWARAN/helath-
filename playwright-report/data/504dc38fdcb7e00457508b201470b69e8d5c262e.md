# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:import-analysis] Failed to resolve import \"@/mockData\" from \"src/hooks/usePatientData.ts\". Does the file exist?"
  - generic [ref=e5]: /app/src/hooks/usePatientData.ts:3:79
  - generic [ref=e6]: "1 | import { useState, useEffect } from \"react\"; 2 | import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_CLAIMS, MOCK_PRESCRIPTIONS } from \"@/mockData\"; | ^ 3 | export const usePatientData = (patientId) => { 4 | const [patient, setPatient] = useState(null);"
  - generic [ref=e7]: at TransformPluginContext._formatLog (file:///app/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41) at TransformPluginContext.error (file:///app/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16) at normalizeUrl (file:///app/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23) at process.processTicksAndRejections (node:internal/process/task_queues:105:5) at async file:///app/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37 at async Promise.all (index 1) at async TransformPluginContext.transform (file:///app/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7) at async EnvironmentPluginContainer.transform (file:///app/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18) at async loadAndTransform (file:///app/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27) at async viteTransformMiddleware (file:///app/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:37254:24
  - generic [ref=e8]:
    - text: Click outside, press Esc key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e9]: server.hmr.overlay
    - text: to
    - code [ref=e10]: "false"
    - text: in
    - code [ref=e11]: vite.config.ts
    - text: .
```
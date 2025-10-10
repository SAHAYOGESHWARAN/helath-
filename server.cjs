const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the React build files
app.use(express.static(path.join(__dirname, "dist")));

// All other requests -> index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));

app.use(express.static(path.join(__dirname, "build")));

// All other requests -> index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));

});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to fetch assignment submissions
const submissionsRoutes = require("./routes/SubmissionRoutes");
const assignmentsRoutes = require("./routes/Assignments");
app.use("/api/submissions", submissionsRoutes);
app.use("/api/assignments", assignmentsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

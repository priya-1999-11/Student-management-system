require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const app = express();


// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// Routes
// ===============================

// Student routes
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
    res.send("Student Management Backend is running!");
});


// ===============================
// Start Server
// ===============================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Backend running at http://localhost:${PORT}`
    );
});
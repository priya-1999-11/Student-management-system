require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// MySQL Database Connection
// ===============================

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


// ===============================
// Connect to MySQL
// ===============================

db.connect((err) => {

    if (err) {
        console.error(
            "❌ MySQL connection failed:",
            err.message
        );

        return;
    }

    console.log(
        "✅ Connected to student_management database!"
    );

});


// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {

    res.send(
        "Student Management Backend is running!"
    );

});


// ===============================
// Get All Students
// ===============================

app.get("/api/students", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "❌ Database query failed:",
                err.message
            );

            return res.status(500).json({
                error: "Database query failed"
            });

        }

        res.json(results);

    });

});


// ===============================
// Get Student By ID
// ===============================

app.get("/api/students/:id", (req, res) => {

    const studentId = req.params.id;

    const sql =
        "SELECT * FROM students WHERE id = ?";

    db.query(
        sql,
        [studentId],
        (err, results) => {

            if (err) {

                console.error(
                    "❌ Database query failed:",
                    err.message
                );

                return res.status(500).json({
                    error: "Database query failed"
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message: "Student not found"
                });

            }

            res.json(results[0]);

        }
    );

});


// ===============================
// Add New Student
// ===============================

app.post("/api/students", (req, res) => {

    const {
        name,
        email,
        course,
        year
    } = req.body;

    const sql = `
        INSERT INTO students
        (name, email, course, year)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            email,
            course,
            year
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "❌ Insert failed:",
                    err.message
                );

                return res.status(500).json({
                    error: "Failed to add student"
                });

            }

            res.status(201).json({

                message:
                    "Student added successfully",

                studentId:
                    result.insertId

            });

        }
    );

});


// ===============================
// Delete Student
// ===============================

app.delete(
    "/api/students/:id",
    (req, res) => {

        const studentId = req.params.id;

        const sql =
            "DELETE FROM students WHERE id = ?";

        db.query(
            sql,
            [studentId],
            (err, result) => {

                if (err) {

                    console.error(
                        "❌ Delete failed:",
                        err.message
                    );

                    return res.status(500).json({
                        error:
                            "Failed to delete student"
                    });

                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message:
                            "Student not found"
                    });

                }

                res.json({
                    message:
                        "Student deleted successfully"
                });

            }
        );

    }
);


// ===============================
// Start Server
// ===============================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 Backend running at http://localhost:${PORT}`
    );

});
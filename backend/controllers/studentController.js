const db = require("../config/db");

// Get all students
const getAllStudents = (req, res) => {
    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Database query failed:", err.message);

            return res.status(500).json({
                error: "Database query failed"
            });
        }

        res.json(results);
    });
};


// Get student by ID
const getStudentById = (req, res) => {
    const studentId = req.params.id;

    const sql = "SELECT * FROM students WHERE id = ?";

    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error("❌ Database query failed:", err.message);

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
    });
};


// Add new student
const addStudent = (req, res) => {
    const { name, email, course, year } = req.body;

    const sql = `
        INSERT INTO students
        (name, email, course, year)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, course, year],
        (err, result) => {

            if (err) {
                console.error("❌ Insert failed:", err.message);

                return res.status(500).json({
                    error: "Failed to add student"
                });
            }

            res.status(201).json({
                message: "Student added successfully",
                studentId: result.insertId
            });
        }
    );
};


// Delete student
const deleteStudent = (req, res) => {
    const studentId = req.params.id;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [studentId], (err, result) => {

        if (err) {
            console.error("❌ Delete failed:", err.message);

            return res.status(500).json({
                error: "Failed to delete student"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    });
};


module.exports = {
    getAllStudents,
    getStudentById,
    addStudent,
    deleteStudent
};
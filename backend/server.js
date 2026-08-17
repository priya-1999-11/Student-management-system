require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// Supabase Connection
// ===============================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

console.log("✅ Supabase client initialized");


// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {

    res.send(
        "Student Management Backend is running with Supabase!"
    );

});


// ===============================
// Get All Students
// ===============================

app.get("/api/students", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("students")
            .select("*");

        if (error) {

            console.error(
                "❌ Supabase query failed:",
                error.message
            );

            return res.status(500).json({
                error: "Database query failed",
                details: error.message
            });

        }

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });

    }

});


// ===============================
// Get Student By ID
// ===============================

app.get("/api/students/:id", async (req, res) => {

    try {

        const studentId = req.params.id;

        const { data, error } = await supabase
            .from("students")
            .select("*")
            .eq("id", studentId)
            .single();

        if (error) {

            if (error.code === "PGRST116") {

                return res.status(404).json({
                    message: "Student not found"
                });

            }

            console.error(
                "❌ Supabase query failed:",
                error.message
            );

            return res.status(500).json({
                error: "Database query failed",
                details: error.message
            });

        }

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });

    }

});


// ===============================
// Add New Student
// ===============================

app.post("/api/students", async (req, res) => {

    try {

        const {
            name,
            email,
            course,
            year
        } = req.body;

        const { data, error } = await supabase
            .from("students")
            .insert([
                {
                    name,
                    email,
                    course,
                    year
                }
            ])
            .select()
            .single();

        if (error) {

            console.error(
                "❌ Insert failed:",
                error.message
            );

            return res.status(500).json({
                error: "Failed to add student",
                details: error.message
            });

        }

        res.status(201).json({

            message: "Student added successfully",

            student: data

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });

    }

});


// ===============================
// Delete Student
// ===============================

app.delete("/api/students/:id", async (req, res) => {

    try {

        const studentId = req.params.id;

        const { data, error } = await supabase
            .from("students")
            .delete()
            .eq("id", studentId)
            .select();

        if (error) {

            console.error(
                "❌ Delete failed:",
                error.message
            );

            return res.status(500).json({
                error: "Failed to delete student",
                details: error.message
            });

        }

        if (!data || data.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });

    }

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
const db = require("../config/db");

// =====================================
// Get Teacher By ID
// =====================================

const getTeacherById = (req, res) => {

const teacherId = req.params.id;

const sql =
    "SELECT t.id, t.user_id, t.teacher_code, t.name, " +
    "t.department, t.email, t.created_at " +
    "FROM teachers t " +
    "WHERE t.id = ?";

db.query(sql, [teacherId], (err, results) => {

    if (err) {
        console.error(
            "Failed to get teacher:",
            err.message
        );

        return res.status(500).json({
            error: "Failed to get teacher"
        });
    }

    if (results.length === 0) {
        return res.status(404).json({
            message: "Teacher not found"
        });
    }

    res.json(results[0]);
});

};

// =====================================
// Get Teacher Courses
// =====================================

const getTeacherCourses = (req, res) => {

const teacherId = req.params.id;

const sql =
    "SELECT c.id, c.course_name, c.status " +
    "FROM teacher_courses tc " +
    "INNER JOIN courses c ON tc.course_id = c.id " +
    "WHERE tc.teacher_id = ?";

db.query(sql, [teacherId], (err, results) => {

    if (err) {
        console.error(
            "Failed to get teacher courses:",
            err.message
        );

        return res.status(500).json({
            error: "Failed to get teacher courses"
        });
    }

    res.json(results);
});

};

// =====================================
// Get Teacher Students
// =====================================

const getTeacherStudents = (req, res) => {

const teacherId = req.params.id;

const sql =
    "SELECT DISTINCT " +
    "s.id, s.user_id, s.name, s.email, s.course, s.year, s.created_at " +
    "FROM teachers t " +
    "INNER JOIN teacher_courses tc ON t.id = tc.teacher_id " +
    "INNER JOIN student_courses sc ON tc.course_id = sc.course_id " +
    "INNER JOIN students s ON sc.student_id = s.id " +
    "WHERE t.id = ? " +
    "ORDER BY s.id";

db.query(sql, [teacherId], (err, results) => {

    if (err) {
        console.error(
            "Failed to get teacher students:",
            err.message
        );

        return res.status(500).json({
            error: "Failed to get teacher students"
        });
    }

    res.json(results);
});

};

// =====================================
// Get Teacher Attendance
// =====================================

const getTeacherAttendance = (req, res) => {

const teacherId = req.params.id;

const sql =
    "SELECT " +
    "a.id, " +
    "a.student_id, " +
    "s.name AS student_name, " +
    "a.course_id, " +
    "c.course_name, " +
    "a.attendance_date, " +
    "a.status, " +
    "a.marked_by, " +
    "t.name AS marked_by_teacher, " +
    "a.created_at " +
    "FROM attendance a " +
    "INNER JOIN students s ON a.student_id = s.id " +
    "INNER JOIN courses c ON a.course_id = c.id " +
    "INNER JOIN teacher_courses tc ON a.course_id = tc.course_id " +
    "INNER JOIN teachers t ON a.marked_by = t.id " +
    "WHERE tc.teacher_id = ? " +
    "ORDER BY a.attendance_date DESC, a.id DESC";

db.query(sql, [teacherId], (err, results) => {

    if (err) {
        console.error(
            "Failed to get teacher attendance:",
            err.message
        );

        return res.status(500).json({
            error: "Failed to get teacher attendance"
        });
    }

    res.json(results);
});

};

// =====================================
// Get Teacher Assignments
// =====================================

const getTeacherAssignments = (req, res) => {

const teacherId = req.params.id;

const sql =
    "SELECT " +
    "a.id, " +
    "a.course_id, " +
    "c.course_name, " +
    "a.title, " +
    "a.due_date, " +
    "a.status, " +
    "a.created_by, " +
    "t.name AS created_by_teacher, " +
    "a.created_at " +
    "FROM assignments a " +
    "INNER JOIN courses c ON a.course_id = c.id " +
    "INNER JOIN teacher_courses tc ON a.course_id = tc.course_id " +
    "INNER JOIN teachers t ON a.created_by = t.id " +
    "WHERE tc.teacher_id = ? " +
    "ORDER BY a.due_date ASC, a.id DESC";

db.query(sql, [teacherId], (err, results) => {

    if (err) {
        console.error(
            "Failed to get teacher assignments:",
            err.message
        );

        return res.status(500).json({
            error: "Failed to get teacher assignments"
        });
    }

    res.json(results);
});

};

// =====================================
// Get Teacher Grades
// =====================================

const getTeacherGrades = (req, res) => {

const teacherId = req.params.id;

const sql =
    "SELECT " +
    "g.id, " +
    "g.student_id, " +
    "s.name AS student_name, " +
    "g.assignment_id, " +
    "a.title AS assignment_title, " +
    "a.course_id, " +
    "c.course_name, " +
    "g.marks, " +
    "g.graded_by, " +
    "t.name AS graded_by_teacher " +
    "FROM grades g " +
    "INNER JOIN students s ON g.student_id = s.id " +
    "INNER JOIN assignments a ON g.assignment_id = a.id " +
    "INNER JOIN courses c ON a.course_id = c.id " +
    "INNER JOIN teacher_courses tc ON a.course_id = tc.course_id " +
    "INNER JOIN teachers t ON g.graded_by = t.id " +
    "WHERE tc.teacher_id = ? " +
    "ORDER BY g.id DESC";

db.query(sql, [teacherId], (err, results) => {

    if (err) {
        console.error(
            "Failed to get teacher grades:",
            err.message
        );

        return res.status(500).json({
            error: "Failed to get teacher grades"
        });
    }

    res.json(results);
});

};

// =====================================
// Save / Update Grades
// =====================================

const saveTeacherGrades = (req, res) => {

const teacherId = Number(req.params.id);

const assignmentId =
    Number(req.body.assignment_id);

const grades = req.body.grades;


// =====================================
// Validate Teacher
// =====================================

if (!teacherId) {

    return res.status(400).json({
        error: "Invalid teacher ID"
    });
}


// =====================================
// Validate Assignment
// =====================================

if (!assignmentId) {

    return res.status(400).json({
        error: "Assignment ID is required"
    });
}


// =====================================
// Validate Grades
// =====================================

if (!Array.isArray(grades)) {

    return res.status(400).json({
        error: "grades must be an array"
    });
}


if (grades.length === 0) {

    return res.status(400).json({
        error: "No grades were provided"
    });
}


// =====================================
// Verify Assignment
// =====================================

const assignmentSql =
    "SELECT a.id, a.course_id " +
    "FROM assignments a " +
    "INNER JOIN teacher_courses tc " +
    "ON a.course_id = tc.course_id " +
    "WHERE a.id = ? " +
    "AND tc.teacher_id = ?";


db.query(
    assignmentSql,
    [
        assignmentId,
        teacherId
    ],
    (err, assignmentResults) => {

        if (err) {

            console.error(
                "Assignment validation failed:",
                err.message
            );

            return res.status(500).json({
                error:
                    "Failed to validate assignment"
            });
        }


        if (assignmentResults.length === 0) {

            return res.status(403).json({
                error:
                    "This assignment is not assigned to this teacher"
            });
        }


        const courseId =
            assignmentResults[0].course_id;


        let completed = 0;
        let inserted = 0;
        let updated = 0;
        let skipped = 0;
        let responseSent = false;


        // =====================================
        // Finish Response
        // =====================================

        const finish = () => {

            if (
                completed === grades.length &&
                !responseSent
            ) {

                responseSent = true;

                return res.status(200).json({

                    message:
                        "Grades saved successfully",

                    assignment_id:
                        assignmentId,

                    inserted:
                        inserted,

                    updated:
                        updated,

                    skipped:
                        skipped
                });
            }
        };


        // =====================================
        // Process Grades
        // =====================================

        grades.forEach((grade) => {

            const studentId =
                Number(grade.student_id);


            // Empty grade

            if (
                !studentId ||
                grade.marks === "" ||
                grade.marks === null ||
                grade.marks === undefined
            ) {

                skipped++;
                completed++;

                finish();

                return;
            }


            const marks =
                Number(grade.marks);


            // Invalid marks

            if (
                Number.isNaN(marks) ||
                marks < 0 ||
                marks > 100
            ) {

                skipped++;
                completed++;

                finish();

                return;
            }


            // =====================================
            // Verify Student
            // =====================================

            const studentSql =
                "SELECT student_id " +
                "FROM student_courses " +
                "WHERE student_id = ? " +
                "AND course_id = ?";


            db.query(
                studentSql,
                [
                    studentId,
                    courseId
                ],
                (studentErr, studentResults) => {

                    if (studentErr) {

                        console.error(
                            "Student validation failed:",
                            studentErr.message
                        );

                        if (!responseSent) {

                            responseSent = true;

                            return res.status(500).json({
                                error:
                                    "Failed to validate student"
                            });
                        }

                        return;
                    }


                    if (
                        studentResults.length === 0
                    ) {

                        skipped++;
                        completed++;

                        finish();

                        return;
                    }


                    // =====================================
                    // Check Existing Grade
                    // =====================================

                    const checkSql =
                        "SELECT id " +
                        "FROM grades " +
                        "WHERE student_id = ? " +
                        "AND assignment_id = ? " +
                        "LIMIT 1";


                    db.query(
                        checkSql,
                        [
                            studentId,
                            assignmentId
                        ],
                        (checkErr, existingGrades) => {

                            if (checkErr) {

                                console.error(
                                    "Grade check failed:",
                                    checkErr.message
                                );

                                if (!responseSent) {

                                    responseSent = true;

                                    return res.status(500).json({
                                        error:
                                            "Failed to check existing grade"
                                    });
                                }

                                return;
                            }


                            // =====================================
                            // Update Existing Grade
                            // =====================================

                            if (
                                existingGrades.length > 0
                            ) {

                                const updateSql =
                                    "UPDATE grades " +
                                    "SET marks = ?, graded_by = ? " +
                                    "WHERE id = ?";


                                db.query(
                                    updateSql,
                                    [
                                        marks,
                                        teacherId,
                                        existingGrades[0].id
                                    ],
                                    (updateErr) => {

                                        if (updateErr) {

                                            console.error(
                                                "Grade update failed:",
                                                updateErr.message
                                            );

                                            if (!responseSent) {

                                                responseSent = true;

                                                return res.status(500).json({
                                                    error:
                                                        "Failed to update grade"
                                                });
                                            }

                                            return;
                                        }


                                        updated++;
                                        completed++;

                                        finish();
                                    }
                                );

                            }


                            // =====================================
                            // Insert New Grade
                            // =====================================

                            else {

                                const insertSql =
                                    "INSERT INTO grades " +
                                    "(student_id, assignment_id, marks, graded_by) " +
                                    "VALUES (?, ?, ?, ?)";


                                db.query(
                                    insertSql,
                                    [
                                        studentId,
                                        assignmentId,
                                        marks,
                                        teacherId
                                    ],
                                    (insertErr) => {

                                        if (insertErr) {

                                            console.error(
                                                "Grade insert failed:",
                                                insertErr.message
                                            );

                                            if (!responseSent) {

                                                responseSent = true;

                                                return res.status(500).json({
                                                    error:
                                                        "Failed to save grade"
                                                });
                                            }

                                            return;
                                        }


                                        inserted++;
                                        completed++;

                                        finish();
                                    }
                                );
                            }
                        }
                    );
                }
            );
        });
    }
);

};

// =====================================
// Export All Functions
// =====================================

module.exports = {
getTeacherById,
getTeacherCourses,
getTeacherStudents,
getTeacherAttendance,
getTeacherAssignments,
getTeacherGrades,
saveTeacherGrades
};

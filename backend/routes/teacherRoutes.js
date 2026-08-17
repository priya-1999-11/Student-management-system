const express = require("express");

const {
    getTeacherById,
    getTeacherCourses,
    getTeacherStudents,
    getTeacherAttendance,
    getTeacherAssignments,
    getTeacherGrades,
    saveTeacherGrades
} = require("../controllers/teacherController");

const router = express.Router();


// =====================================
// Get Teacher By ID
// =====================================

router.get("/:id", getTeacherById);


// =====================================
// Get Teacher Courses
// =====================================

router.get("/:id/courses", getTeacherCourses);


// =====================================
// Get Teacher Students
// =====================================

router.get("/:id/students", getTeacherStudents);


// =====================================
// Get Teacher Attendance
// =====================================

router.get("/:id/attendance", getTeacherAttendance);


// =====================================
// Get Teacher Assignments
// =====================================

router.get("/:id/assignments", getTeacherAssignments);


// =====================================
// Get Teacher Grades
// =====================================

router.get("/:id/grades", getTeacherGrades);


// =====================================
// Save / Update Teacher Grades
// =====================================

router.post("/:id/grades", saveTeacherGrades);


module.exports = router;
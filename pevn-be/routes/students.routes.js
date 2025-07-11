const express = require("express");
const student = require("../controllers/student.controller");

const router = express.Router();

router.get("/courses/:id", student.getCourses);

router.post("/course/:id_c", student.joinCourse);

router.post("/my-courses", student.getMyCourses);

router.get('/assignments/:id_c/:id', student.getAssignments);

router.post('/delivery', student.addDelivery)

module.exports = router;

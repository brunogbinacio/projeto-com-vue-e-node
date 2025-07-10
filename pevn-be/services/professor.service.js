const pool = require("../database/keys");
const cloudinary = require("../lib/cloudinary");

const professorService = {
    createCourse: async ({ id, c_name, c_description }) => {
        await pool.query("INSERT INTO course (p_id, c_name, c_description) VALUES ($1, $2, $3)", [id, c_name, c_description]);
        const course = (await pool.query("SELECT * FROM course ORDER BY id_c DESC LIMIT 1")).rows[0];
        return course;
    },

    readCourse: async (id_c) => {
        const course = (await pool.query("SELECT * FROM course WHERE id_c=$1", [id_c])).rows[0];
        return course;
    },

    updateCourse: async (id_c, { c_name, c_description }) => {
        await pool.query("UPDATE course SET c_name=$1, c_description=$2 WHERE id_c=$3", [c_name, c_description, id_c]);
        return { c_name, c_description };
    },

    deleteCourse: async (id_c) => {
        await pool.query("DELETE FROM course WHERE id_c=$1", [id_c]);
    },

    getCourses: async (p_id) => {
        const courses = (await pool.query("SELECT * FROM course WHERE p_id=$1", [p_id])).rows;
        return courses;
    },

    createAssignment: async (id_c, { a_name, a_description }, file) => {
        const a_file = await cloudinary(file.tempFilePath);
        await pool.query(
            "INSERT INTO assignment (c_id, a_name, a_description, a_file) VALUES ($1, $2, $3, $4)",
            [id_c, a_name, a_description, a_file]
        );
        const assignment = (await pool.query("SELECT * FROM assignment ORDER BY id_a DESC LIMIT 1")).rows[0];
        return assignment;
    },

    getAssignments: async (id_c) => {
        const assignments = (await pool.query("SELECT * FROM assignment WHERE c_id=$1", [id_c])).rows;
        return assignments;
    },

    getDeliveries: async (id_a) => {
        const deliveries = (
            await pool.query(
                "SELECT * FROM delivery JOIN (SELECT id_s, s_name FROM student) AS S ON s_id=id_s WHERE a_id=$1",
                [id_a]
            )
        ).rows;
        return deliveries;
    }
};

module.exports = professorService;

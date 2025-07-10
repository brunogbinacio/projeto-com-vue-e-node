const pool = require("../database/keys");
const cloudinary = require("../lib/cloudinary");

const studentService = {
  getCourses: async (id) => {
    const result = await pool.query(
      `SELECT * FROM professorvscourse 
       LEFT JOIN (
         SELECT * FROM studentvscourse WHERE s_id=$1
       ) AS S ON id_c=c_id 
       WHERE c_id IS NULL`,
      [id]
    );
    return result.rows;
  },

  joinCourse: async (id, id_c) => {
    await pool.query("INSERT INTO studentvscourse VALUES ($1, $2)", [id, id_c]);
    return {
      message: "Entrou no curso",
      course: { id_c },
    };
  },

  getMyCourses: async (id) => {
    const result = await pool.query(
      `SELECT * FROM professorvscourse 
       JOIN (
         SELECT * FROM studentvscourse WHERE s_id=$1
       ) AS S ON id_c=c_id`,
      [id]
    );
    return result.rows;
  },

  getAssignments: async (id_c, id) => {
    const course = (
      await pool.query("SELECT * FROM professorvscourse WHERE id_c=$1", [id_c])
    ).rows[0];

    const assignments = (
      await pool.query(`
        SELECT 
          a.*,
          d.d_file,
          d.d_filename
        FROM assignment a
        LEFT JOIN (
          SELECT DISTINCT ON (a_id) 
            a_id, d_file, d_filename 
          FROM delivery 
          WHERE s_id=$1
        ) d ON a.id_a = d.a_id
        WHERE a.c_id=$2
        ORDER BY a.id_a
      `, [id, id_c])
    ).rows;

    return { course, assignments };
  },

  addDelivery: async (body, file) => {
    const { id, id_a } = body;
    const d_filename = file.name;
    const d_file = await cloudinary(file.tempFilePath);

    await pool.query(
      "INSERT INTO delivery (a_id, s_id, d_file, d_filename) VALUES ($1, $2, $3, $4)",
      [id_a, id, d_file, d_filename]
    );

    return {
      message: "Delivery adicionado",
      d_file,
      d_filename,
    };
  }
};

module.exports = studentService;

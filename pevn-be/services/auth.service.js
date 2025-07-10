const pool = require("../database/keys");

const authService = {
  signUp: async ({ name, email, password, role }) => {
    if (role === "professor") {
      try {
        await pool.query(
          "INSERT INTO professor (p_name, p_email, p_password) VALUES ($1, $2, $3)",
          [name, email, password]
        );
        return {
          message: "Professor registrado com sucesso",
          professor: { name, email, password },
        };
      } catch (error) {
        if (error.constraint === "professor_p_email_key") {
          throw new Error("Email já existe");
        }
        throw new Error("Erro ao registrar professor");
      }
    } else {
      try {
        await pool.query(
          "INSERT INTO student (s_name, s_email, s_password) VALUES ($1, $2, $3)",
          [name, email, password]
        );
        return {
          message: "Estudante registrado com sucesso",
          student: { name, email, password },
        };
      } catch (error) {
        if (error.constraint === "student_s_email_key") {
          throw new Error("Email já existente");
        }
        throw new Error("Erro ao registrar estudante");
      }
    }
  },

  signIn: async ({ email, password, role }) => {
    if (role === "professor") {
      const result = await pool.query(
        "SELECT * FROM professor WHERE p_email=$1 AND p_password=$2",
        [email, password]
      );
      const professor = result.rows[0];
      if (professor) {
        return {
          id: professor.id_p,
          name: professor.p_name,
          email: professor.p_email,
          role: "professor",
        };
      } else {
        return {
          message: "E-mail ou senha incorretos",
          NotFound: true,
        };
      }
    } else {
      const result = await pool.query(
        "SELECT * FROM student WHERE s_email=$1 AND s_password=$2",
        [email, password]
      );
      const student = result.rows[0];
      if (student) {
        return {
          id: student.id_s,
          name: student.s_name,
          email: student.s_email,
          role: "student",
        };
      } else {
        return {
          message: "E-mail ou senha incorretos",
          NotFound: true,
        };
      }
    }
  }
};

module.exports = authService;

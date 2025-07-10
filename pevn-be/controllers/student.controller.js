const studentService = require("../services/student.service");

const student = {
  getCourses: async (req, res) => {
    try {
      const courses = await studentService.getCourses(req.params.id);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: "Ocorreu um erro", error });
    }
  },

  joinCourse: async (req, res) => {
    try {
      const result = await studentService.joinCourse(req.body.id, req.params.id_c);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Ocorreu um erro", error });
    }
  },

  getMyCourses: async (req, res) => {
    try {
      const courses = await studentService.getMyCourses(req.body.id);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: "Ocorreu um erro", error });
    }
  },

  getAssignments: async (req, res) => {
    try {
      const data = await studentService.getAssignments(req.params.id_c, req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Ocorreu um erro", error });
    }
  },

  addDelivery: async (req, res) => {
    try {
      const result = await studentService.addDelivery(req.body, req.files.d_file);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Ocorreu um erro", error });
    }
  },
};

module.exports = student;

const professorService = require("../services/professor.service");

const professor = {
    createCourse: async (req, res) => {
        try {
            const course = await professorService.createCourse(req.body);
            res.status(200).json({ message: "Curso adicionado", course });
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar curso", error });
        }
    },

    readCourse: async (req, res) => {
        try {
            const course = await professorService.readCourse(req.params.id_c);
            res.status(200).json({ course });
        } catch (error) {
            res.status(500).json({ message: "Erro ao tentar listar os cursos", error });
        }
    },

    updateCourse: async (req, res) => {
        try {
            const updated = await professorService.updateCourse(req.params.id_c, req.body);
            res.status(200).json({ message: "Curso atualizado com sucesso", course: updated });
        } catch (error) {
            res.status(500).json({ message: "Ocorreu um erro", error });
        }
    },

    deleteCourse: async (req, res) => {
        try {
            await professorService.deleteCourse(req.params.id_c);
            res.status(200).json({ message: "Curso deletado" });
        } catch (error) {
            res.status(500).json({ message: "Ocorreu um erro", error });
        }
    },

    getCourses: async (req, res) => {
        try {
            const courses = await professorService.getCourses(req.body.id);
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: "Ocorreu um erro", error });
        }
    },

    createAssignment: async (req, res) => {
        try {
            const assignment = await professorService.createAssignment(req.params.id_c, req.body, req.files.a_file);
            res.status(200).json({ message: "Adicionado com sucesso", assignment });
        } catch (error) {
            res.status(500).json({ message: "Ocorreu um erro", error });
        }
    },

    getAssignments: async (req, res) => {
        try {
            const assignments = await professorService.getAssignments(req.params.id_c);
            res.status(200).json(assignments);
        } catch (error) {
            res.status(500).json({ message: "Ocorreu um erro", error });
        }
    },

    getDeliveries: async (req, res) => {
        try {
            const deliveries = await professorService.getDeliveries(req.params.id_a);
            res.status(200).json(deliveries);
        } catch (error) {
            res.status(500).json({ message: "Ocorreu um erro", error });
        }
    },
};

module.exports = professor;

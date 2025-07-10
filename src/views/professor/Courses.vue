<template>
    <v-container>
        <NavbarP :p_name="professor.name"/>
        <h1 class="front-weight-light">Meus cursos.</h1>
        <v-alert text v-model="alert.show" :type="alert.type" dismissible>{{ alert.message }}</v-alert>
        <v-row justify="center">
            <v-card class="ma-3" max-width="344" v-for="course in coursesList" :key="course.id_c">
                <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px"></v-img>
                <v-card-title>{{ course.c_name }}</v-card-title>
                <v-card-subtitle>{{ course.c_description }}</v-card-subtitle>
                <v-card-actions>
                    <v-btn color="blue" small dark fab
                        @click="readCourse(course.id_c)"><v-icon>mdi-pencil</v-icon></v-btn>
                    <v-btn color="red" small dark fab @click="deleteCourse(course.id_c)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="purple" text @click="$router.push(`/professor/assignments/${course.id_c}`)">assignments</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
        <v-dialog v-model="add" max-width="450">
            <v-card>
                <v-card-title>Criar um curso</v-card-title>
                <v-card-text>
                    <v-form ref="addForm" @submit.prevent="addCourse()" class="ma-3">
                        <v-text-field prepend-icon="mdi-biohazard" label="Nome"
                            :rules="[(v) => !!v || 'Nome obrigatório']" v-model="courseToAdd.c_name"></v-text-field>
                        <v-textarea prepend-icon="mdi-bike" label="Descrição"
                            :rules="[(v) => !!v || 'Descrição necessária']"
                            v-model="courseToAdd.c_description"></v-textarea>
                        <v-btn block class="success mt-3" type="submit">add</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="edit" max-width="450">
            <v-card>
                <v-card-title>Editar curso</v-card-title>
                <v-card-text>
                    <v-form ref="editForm" @submit.prevent="editCourse()" class="ma-3">
                        <v-text-field prepend-icon="mdi-biohazard" label="Nome"
                            :rules="[(v) => !!v || 'Nome obrigatório']" v-model="courseToEdit.c_name"></v-text-field>
                        <v-textarea prepend-icon="mdi-bike" label="Descrição"
                            :rules="[(v) => !!v || 'Descrição necessária']"
                            v-model="courseToEdit.c_description"></v-textarea>
                        <v-btn block class="info mt-3" type="submit">editar</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog> 
        <v-btn @click="add = true" color="red" large right fixed bottom fab dark><v-icon>mdi-plus</v-icon></v-btn>
    </v-container>
</template>

<script>
import NavbarP from '@/components/NavbarP';

export default {
    data: () => ({
        alert: { show: false },
        professor: {},
        coursesList: [],
        courseToAdd: {},
        courseToEdit: {},
        add: false,
        edit: false,
        deletes: false,
    }),
    methods: {
        async addCourse() {
            let valid = this.$refs.addForm.validate();
            if (valid) {
                this.courseToAdd.id = this.professor.id;
                try {
                    const res = await this.axios.post('/professor/course', this.courseToAdd);
                    console.log(res.data);
                    this.coursesList.push(res.data.course);
                    this.$refs.addForm.reset();
                    this.add = false;
                    this.alert = {
                        show: true,
                        type: 'success',
                        message: 'Curso adicionado com sucesso!'
                    };
                } catch (error) {
                    console.log(error);

                }
            }
        },
        async readCourse(id_c) {
            try {
                const res = await this.axios.get(`/professor/course/${id_c}`)
                this.courseToEdit = res.data.course;
                this.edit = true;
            } catch (error) {
                console.log(error);

            }
        },
        async editCourse() {
            let valid = this.$refs.editForm.validate();
            if (valid) {
                const res = await this.axios.put(`/professor/course/${this.courseToEdit.id_c}`, this.courseToEdit);
                const index = this.coursesList.findIndex(c => c.id_c == this.courseToEdit.id_c);
                this.coursesList[index] = this.courseToEdit;
                this.edit = false;
                this.alert = {
                    show: true,
                    type: 'success',
                    message: res.data.message
                }
            }
        },
        async deleteCourse(id_c) {
            try {
                const res = await this.axios.delete(`/professor/course/${id_c}`);
                const index = this.coursesList.findIndex(c => c.id_c == id_c);
                this.coursesList.splice(index, 1);
                this.alert = {
                    show: true,
                    type: 'info',
                    message: res.data.message
                };
            } catch (error) {
                console.log(error);

            }
        }

    },

    created: async function () {
        this.professor = JSON.parse(sessionStorage.getItem('session'));
        if (this.professor == 'null') {
            this.$router.push('/');
        } else if (this.professor.role != 'professor') {
            this.$router.push('/profile');
        } else {
            try {
                const res = await this.axios.post('/professor/my-courses', this.professor);
                this.coursesList = res.data;
            } catch (error) {
                console.log(error);
            }
        }
    },
    components: {
        NavbarP
    }
};
</script>
<template>
    <div>
        <v-app-bar app dark class="primary">
            <v-toolbar-title>BGWeb</v-toolbar-title>
            <v-spacer />
            <v-btn text to="/student/courses">Todos os cursos</v-btn>
            <v-btn text to="/student/my-courses">Meus cursos</v-btn>
            <v-menu offset-y>
                <template v-slot:activator="{ attrs, on }">
                    <v-btn text v-bind="attrs" v-on="on">{{ s_name }}.</v-btn>
                </template>
                <v-list dark class="primary">
                    <v-list-item to="/profile">Perfil</v-list-item>
                    <v-list-item @click="SignOut()">Sair</v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
    </div>
</template>


<script>
export default {
    methods: {
        SignOut() {
            sessionStorage.clear();
            this.$router.push("/");
        }
    },
    props: ['s_name']
}
</script>
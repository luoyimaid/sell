<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    // import routerView from '@/components/index.vue';

    export default {
        name: 'App',
        // components: {
        //     'router-view': routerView
        // }
    }
</script>

<style lang="scss" scoped>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 24px;
        }
    }
</style>

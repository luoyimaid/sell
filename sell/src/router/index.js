/**
 * @file index.js
 */
import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/login/HelloWorld';
import Function from '@/components/function/function';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            title: '增删改查的功能页',
            path: '/Function',
            name: 'Function',
            component: Function
        }
    ]
});

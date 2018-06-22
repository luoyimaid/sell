/**

 *@file index.js

 *@author luoyi

 **/
import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/index';
import Guest from '@/components/guest/guest';

Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: index
        },
        {
            title: '主宾信息登记',
            path: '/Guest',
            name: 'Guest',
            component: Guest
        }
    ]
});

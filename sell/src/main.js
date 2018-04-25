/**
 * @file main.js
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

// 添加lib-flexible依赖，做移动端适配
import 'lib-flexible/flexible.js';

// 在这里引入axios
import axios from 'axios';
// 在vue中使用axios

// 将全局样式文件添加到main.js 里
import '@/assets/scss/reset.css';

// 引入mint-ui组件
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.prototype.$axios = axios;
Vue.use(MintUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
});

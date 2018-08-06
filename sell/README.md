# 干预软件的登录管理系统

> A Vue.js project

 
bash

# install dependencies
`npm install`
    > 从icode上把代码pull下来之后，执行此命令加载模块`node_modules`

# serve with hot reload at localhost:8080
`npm run dev`
    > 执行此命令，启动本地服务，启动后的默认URL是`localhost:8080/#/`

# build for production with minification
`npm run build`
    > 将所有代码压缩，并打包成一个dist文件，服务器部署时只需要将dist文件放在服务端该放的位置就ok了

> 主要页面代码在 `src/components/` 下
>> `login/HelloWorld.vue` 是登录页面，登录的账户密码是唯一的，交接文档的wiki里有写
>> `function/function.vue` 是功能页面，实现了登录账号的增删改查功能，代码里面都有注释

> 公共资源在 `src/assets` 目录下，该项目只引入了一个公共资源: `src/assets/scss/reset.css` ,清除了浏览器的默认样式
> 路由跳转在 `src/router/index.js` 里设置
> 全局样式在 `src/main.js` 里设置
> 其他是配置文件
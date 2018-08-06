# info_registration

> 图片上传目前暂不适用于safari,请最好使用Chrome进入页面

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
>> `index.vue` 是带领人信息登记页面，里面的部分功能直接引用的组件(自己封装的组件)
>>> `timequantum/timequantum.vue` 是时间段选择功能，在 `index.vue` 页面中引入
>>> `leadlist/leadlist.vue` 是添加的带领人的表格显示，在 `index.vue` 页面引入
>>> `leadinfo/leadinfo.vue` 是带领人信息输入的功能，在 `index.vue` 页面引入
>>> `datepicker/datepicker.vue` 是日期选择功能，在 `index.vue` 页面引入

>> `guest/guest.vue` 是主宾信息登录页面，里面的部分功能也是直接引用的自己封装的组件
>>> `guestinfo/guestinfo.vue` 是主宾信息输入的功能，在 `guest/guest.vue` 页面引入
>>> `guestlist/guestlist.vue` 是添加的主宾信息的表格显示，在 `guest/guest.vue` 页面引入

> 路由跳转在 `src/router/index.js` 里设置
> 全局样式在 `src/main.js` 里设置
> 其他是配置文件

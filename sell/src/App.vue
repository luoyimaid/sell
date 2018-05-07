<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="scss">
  body{
    background: url("http://robokit.baidu.com/durobot/v2/thirdpartyagent?req=get_pic&pid=53754608186&t=2&c=a29279ffec7fbaad2f24d34d1699064e") left top no-repeat;
    background-size: 100%;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

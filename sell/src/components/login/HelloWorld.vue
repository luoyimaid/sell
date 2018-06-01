<template>
  <div class="hello">
    <h2>内测在此登录</h2>
    <div class="login">
      <label class="content">
        用户名
        <input type="text" placeholder="请输入用户名" class="input"/>
      </label>
      <label class="content">
        密&nbsp;&nbsp;&nbsp;码
        <input type="password" placeholder="请输入正确的密码" class="input"/>
      </label>
    </div>
    <input class="submit" type="button" value="提交" @click="toLogin"/>
  </div>
</template>

<script>
    let date = new Date();
    import axios from 'axios';
    import md5 from 'js-md5';
    // 生成十位随机数
    function randomNum(n) {
        let t = '';
        for (let i = 0; i < n; i++) {
            t += Math.floor(Math.random() * 10);
        }
        return t;
    }

    // 设置正常的时间格式
    function getLocalTime(now) {
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }

    // 封装加密请求必须的参数
    function publicFormData(){
        let formData = new FormData();
        let random = randomNum(10);
        let timeTamp = date.getTime();
        formData.append('login_name', 'admin');
        formData.append('salt', random);
        formData.append('timestamp', timeTamp);
        formData.append('sign', md5('login_name' + 'admin' + 'salt' + random + 'timestamp' + timeTamp + 'robokit123#'));

        return formData;
    }
  export default {
    name: 'HelloWorld',
    data() {
      return {
          list: []
      }
    },
    methods: {
      toLogin: function () {
          let content = document.getElementsByClassName('input');
          if (content[0].value === 'admin' && content[1].value === 'robokit123#') {
              // 发送请求的数据格式是 form-data 格式
              let formData = publicFormData();
              formData.append('req', 'list');
              // 用post请求数据
              axios.post(' http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount', formData).then(resp => {
                  this.list = Object.assign([], resp.data.data);
                  // console.log(resp.data);
              }).catch(err => {
                  console.log(err);
              });
              this.$router.push({
                  path: '/Function'
              })
          }else{
              alert('用户名或密码错误！');
          }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .login{
    width: 450px;
    margin: 200px auto;
    .content{
      width: 400px;
      font-size: 40px;
      line-height: 80px;
      input{
        width: 300px;
        height: 40px;
      }
    }
  }
  .submit{
      display: block;
    margin: 50px auto;
    width: 100px;
    linr-height: 60px;
    font-size: 60px;
  }
</style>

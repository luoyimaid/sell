<template>
    <div class="container">
        <h4 style="margin-bottom: 20px;">添加新用户信息</h4>
        <div class="addUsers clearfix">
            <div>
                <span>添加新用户名</span>
                <input type="text" placeholder="用户名" @blur="judgeRepeat" class="addUser"/>
                <span class="reminder">(用户名必须为邮箱前缀且不能重复添加)</span>
            </div>
            <div>
                <span>设置用户密码</span>
                <input type="password" placeholder="设置用户密码" class="addUser"/>
                <span class="reminder">(密码为6-16位数字或字母组合)</span>
            </div>
            <div>
                <span>重复用户密码</span>
                <input type="password" placeholder="重复用户密码" class="addUser"/>
                <span class="reminder">(密码与设置密码一致)</span>
            </div>
            <div>
                <span>选择生效日期</span>
                <input type="datetime-local" name="expiry_user_date" class="addUser" id="add_effective_time"/>
                <span class="reminder">(默认为当前时间,可自行选择)</span>
            </div>
            <div>
                <span>选择失效日期</span>
                <input type="datetime-local" name="expiry_user_date" class="addUser" id="add_expiry_time"/>
                <span class="reminder">(失效时间必须在生效时间之后)</span>
            </div>
        </div>
        <input type="button" value="提交" class="addButton" @click="addUserInfo"/>

        <h4 style="margin: 100px auto 20px;">历史添加记录</h4>
        <div class="userInfo">
            <table width="100%" border="1px solid white">
                <thead>
                <tr>
                    <td>用户名</td>
                    <td>生效日期</td>
                    <td>失效日期</td>
                    <td>操作</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in list">
                    <td>{{item.account}}</td>
                    <td>{{item.start_timestamp}}</td>
                    <td>{{item.end_timestamp}}</td>
                    <td>
                        <input type="button" value="编辑" @click="editUserInfo(index)"/>
                        <input type="button" value="删除" @click="deleteUserInfo(index)"/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="editPage" id="editPage">
            <div>
                <span>用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
                <input type="text" placeholder="用户名" class="setUser"/>
            </div>
            <div>
                <span>更改用户密码</span>
                <input type="password" placeholder="设置用户密码" class="setUser"/>
            </div>
            <div>
                <span>选择生效日期</span>
                <input type="text" name="effective_user_date" class="setUser"/>
            </div>
            <div>
                <span>选择失效日期</span>
                <input type="text" name="expiry_user_date" class="setUser"/>
            </div>
            <input type="button" value="确定" class="addButton" @click="editConfirm"/>
        </div>
    </div>
</template>

<script>
    let date = new Date();
    import axios from 'axios';
    import md5 from 'js-md5';

    // 加0操作
    function addZero(num){
        num < 10 ? num = '0' + num : num;
        return num;
    }

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
        return year + "-" + addZero(month) + "-" + addZero(date) + " " + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);
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
        data() {
            return {
                list: [],
                selectedList: {},
                select: '',
            }
        },
        methods: {
            // 失去焦点时判断用户名是否重复
            judgeRepeat: function(){
                let reminder = document.getElementsByClassName('reminder');
                for(let i = 0; i < this.list.length; i++){
                    if(this.list[i].account === document.getElementsByClassName('addUser')[0].value){
                        reminder[0].style.color = 'red';
                    }
                }
            },
            // 获取账户信息
            getUserInfo: function () {
                // 发送请求的数据格式是 form-data 格式
                let formData = publicFormData();
                formData.append('req', 'list');
                // 用post请求数据
                axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount', formData).then(resp => {
                    this.list = Object.assign([], resp.data.data);
                    console.log(resp.data);
                    // 将请求到的时间戳转换为普通时间格式
                    for (let i = 0; i < resp.data.data.length; i++) {
                        this.list[i].start_timestamp = getLocalTime(new Date(resp.data.data[i].start_timestamp));
                        this.list[i].end_timestamp = getLocalTime(new Date(resp.data.data[i].end_timestamp));
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 添加账户信息
            addUserInfo: function () {
                // 正则匹配输入密码
                let repassword = /^[A-Za-z0-9]{6,16}$/;

                let reminder = document.getElementsByClassName('reminder');
                let add_user = document.getElementsByClassName('addUser');
                let add_user_info = add_user[0].value;
                let add_user_password = add_user[1].value;
                let add_user_effective = add_user[3].value;
                let add_user_expiry = add_user[4].value;

                // 新增用户请求时的参数
                let addFormData = publicFormData();
                addFormData.append('req', 'add');
                addFormData.append('account', add_user[0].value);
                addFormData.append('password', add_user[1].value);
                addFormData.append('start_timestamp', new Date(add_user[3].value).getTime());
                addFormData.append('end_timestamp', new Date(add_user[4].value).getTime());

                // 密码不符合验证时，提示文字标红
                if(!(repassword.test(add_user[1].value))){
                    reminder[1].style.color = 'red';
                    reminder[2].style.color = '#ccc';
                    reminder[4].style.color = '#ccc';
                }
                // 重复密码与密码不一致时，提示文字标红
                else if (add_user[2].value !== add_user[1].value) {
                    reminder[2].style.color = 'red';
                    reminder[1].style.color = '#ccc';
                    reminder[4].style.color = '#ccc';
                }
                // 失效时间小于或等于生效时间时，提示文字标红
                else if(new Date(add_user[4].value).getTime() <= new Date(add_user[3].value).getTime()){
                    reminder[1].style.color = '#ccc';
                    reminder[2].style.color = '#ccc';
                    reminder[4].style.color = 'red';
                }
                else{
                    // 判断用户名是否重复，用户名重复时，删除之前的用户名
                    for(let i = 0; i < this.list.length; i++){
                        if(this.list[i].account === add_user[0].value){
                            let deleteData = publicFormData();
                            deleteData.append('req', 'delete');
                            deleteData.append('account',this.list[i].account);
                            axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount',deleteData).then(resp => {
                                // http://testsidewear.baidu.com//durobot/v2/controlaccount
                                console.log(resp.data);
                                this.list.splice(i, 1);
                            }).catch(err => {
                                console.log(err);
                            });
                        }
                    }
                    // 请求新增用户
                    axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount', addFormData).then(resp => {
                        console.log(resp.data);
                        // 将输入信息添加到列表
                        this.list.push({
                            account: add_user_info,
                            password: add_user_password,
                            start_timestamp: add_user_effective,
                            end_timestamp: add_user_expiry
                        });
                        // 然后清空输入信息
                        for(let i=0; i<add_user.length-2; i++) {
                            add_user[i].value = '';
                        }
                        for(let i=0; i < reminder.length; i++) {
                            reminder[i].style.color = '#ccc';
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            },
            // 编辑用户信息
            editUserInfo: function (index) {
                this.select = index;
                let set_user_info = document.getElementsByClassName('setUser');
                set_user_info[0].value = this.list[index].account;
                set_user_info[1].value = this.list[index].password;
                set_user_info[2].value = this.list[index].start_timestamp;
                set_user_info[3].value = this.list[index].end_timestamp;
                // this.selectedList = JSON.parse( JSON.stringify(this.slist[index]) );
                let edit_display = document.getElementById('editPage');
                edit_display.style.display = 'block';
            },
            // 删除用户信息
            deleteUserInfo: function (index) {
                // 发送请求的数据格式是 form-data 格式
                let formData = publicFormData();
                formData.append('req', 'delete');
                formData.append('account',this.list[index].account);
                axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount',formData).then(resp => {
                    // http://testsidewear.baidu.com//durobot/v2/controlaccount
                    console.log(resp.data);
                    // 删除用户
                    this.list.splice(index, 1);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 编辑弹窗，确认修改
            editConfirm: function () {
                let that = this;
                let set_user_info = document.getElementsByClassName('setUser');
                let set_user_name = set_user_info[0].value;
                let set_user_password = set_user_info[1].value;
                let set_user_effective = set_user_info[2].value;
                let set_user_expiry = set_user_info[3].value;

                // 更新账户时间请求
                let accountFormData = publicFormData();
                accountFormData.append('req','update');
                accountFormData.append('account',that.list[that.select].account);
                accountFormData.append('start_timestamp',new Date(set_user_effective).getTime());
                accountFormData.append('end_timestamp',new Date(set_user_expiry).getTime());
                axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount',accountFormData).then(resp =>{
                    console.log(resp.data);
                    that.list[that.select].start_timestamp = set_user_effective;
                    that.list[that.select].end_timestamp = set_user_expiry;
                }).catch(err => {
                    console.log(err);
                });

                // 更新密码的请求，密码是加密的，如果没有变更，则不需要请求更新
                if(that.list[that.select].password !== set_user_password){
                    let passwordFormData = publicFormData();
                    passwordFormData.append('req','reset_password');
                    passwordFormData.append('account',that.list[that.select].account);
                    passwordFormData.append('password',set_user_password);
                    axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount',passwordFormData).then(resp => {
                        console.log(resp.data);
                        that.list[that.select].password = set_user_password;
                    }).catch(err => {
                        console.log(err);
                    });
                }

                // 隐藏弹窗
                let edit_display = document.getElementById('editPage');
                edit_display.style.display = 'none';
            }
        },
        created() {
            // 获取账号信息列表，在此定义
            this.getUserInfo();
        },
        mounted() {
            // 初始化生效及失效时间
            function initTime(now) {
                let year = now.getFullYear();
                let month = now.getMonth() + 1;
                let date = now.getDate();
                let hour = now.getHours();
                let minute = now.getMinutes();
                let second = now.getSeconds();
                return year + "-" + addZero(month) + "-" + addZero(date) + "T" + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);
            }
            document.getElementById('add_effective_time').value = initTime(date);
            document.getElementById('add_expiry_time').value = initTime(date);
            console.log(initTime(date));
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        /*color: #fff;*/
        font-size: 25px;
        position: relative;
        .addUsers {
            width: 1000px;
            margin: 0 600px;
            div {
                float: left;
                line-height: 60px;
                margin-bottom: 20px;
                /*margin-left: 300px;*/
                span {
                    width: 80px;
                    line-height: 40px;
                }
                input {
                    width: 450px;
                    height: 40px;
                    font-size: 25px;
                }
                .reminder{
                    font-size: 20px;
                    color: #ccc;
                }
            }
        }
        .addButton {
            display: block;
            margin:0 auto;
            width: 150px;
            height: 80px;
            font-size: 25px;
        }
        .userInfo {
            margin-bottom: 100px;
            table {
                tbody,
                thead {
                    tr {
                        height: 60px;
                        font-size: 35px;
                    }
                }
                tbody {
                    tr {
                        td {
                            input {
                                font-size: 35px;
                            }
                        }
                    }
                }
            }
        }
        .editPage {
            color: #fff;
            display: none;
            width: 600px;
            height: 600px;
            background-color: rgba(0, 0, 0, 0.5);
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            input {
                margin: 30px auto;
                width: 400px;
                height: 50px;
                font-size: 30px;
            }
            input:nth-child(5) {
                width: 100px;
                height: 50px;
            }
        }
    }
</style>

<template>
    <div class="container">
        <div class="addUsers">
            <label>
                <span>添加新用户名</span>
                <input type="text" placeholder="用户名" class="addUser"/>
            </label>
            <label>
                <span>设置用户密码</span>
                <input type="password" placeholder="设置用户密码" class="addUser"/>
            </label>
            <label>
                <span>选择失效日期</span>
                <input type="datetime-local" name="expiry_user_date" class="addUser"/>
            </label>
            <input type="button" value="新增" class="addButton" @click="addUserInfo"/>
        </div>
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
                <span>用户名</span>
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
        data() {
            return {
                list: [],
                selectedList: {},
                select: '',
            }
        },
        methods: {
            // 获取账户信息
            getUserInfo: function () {
                // 发送请求的数据格式是 form-data 格式
                let formData = publicFormData();
                formData.append('req', 'list');
                // 用post请求数据
                axios.post(' http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount', formData).then(resp => {
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
                let add_user = document.getElementsByClassName('addUser');
                let add_user_info = add_user[0].value;
                // let add_user_password = add_user[1].value;
                let add_user_effective = getLocalTime(date);
                let add_user_expiry = add_user[2].value;

                let addFormData = publicFormData();
                addFormData.append('req', 'add');
                addFormData.append('account', add_user[0].value);
                addFormData.append('password', add_user[1].value);
                addFormData.append('start_timestamp', new Date(getLocalTime(date)).getTime());
                addFormData.append('end_timestamp', new Date(add_user[2].value).getTime());
                axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount', addFormData).then(resp => {
                    console.log(resp.data);
                    // 将输入信息添加到列表
                    this.list.push({
                        account: add_user_info,
                        start_timestamp: add_user_effective,
                        end_timestamp: add_user_expiry
                    });
                    // 然后清空输入信息
                    add_user[0].value = '';
                    add_user[1].value = '';
                    add_user[2].value = '';
                }).catch(err => {
                    console.log(err);
                });
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
                this.randomNum = randomNum(10);
                this.timeTamp = date.getTime();
                // 发送请求的数据格式是 form-data 格式
                let formData = publicFormData();
                formData.append('req', 'delete');
                formData.append('account',this.list[index].account);
                axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount',formData).then(resp => {
                    // http://testsidewear.baidu.com//durobot/v2/controlaccount
                    console.log(resp.data);
                    this.list.splice(index, 1);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 编辑弹窗，确认修改
            editConfirm: function () {
                let that = this;
                let set_user_info = document.getElementsByClassName('setUser');
                // let set_user_name = set_user_info[0].value;
                let set_user_password = set_user_info[1].value;
                let set_user_effective = set_user_info[2].value;
                let set_user_expiry = set_user_info[3].value;

                // 更新生效和失效时间的请求
                function updateTime() {
                    // 发送请求的数据格式是 form-data 格式
                    let accountFormData = publicFormData();
                    accountFormData.append('req','update');
                    accountFormData.append('account',that.list[that.select].account);
                    accountFormData.append('start_timestamp',set_user_effective);
                    accountFormData.append('end_timestamp',set_user_expiry);
                    return axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount',accountFormData);
                }

                // 更新密码的请求
                function updatePassword() {
                    // 发送请求的数据格式是 form-data 格式
                    let passwordFormData = publicFormData();
                    passwordFormData.append('req','reset_password');
                    passwordFormData.append('account',that.list[that.select].account);
                    passwordFormData.append('password',set_user_password);
                    return axios.post('http://yq01-rp-nlp-rd0-b33aa.yq01.baidu.com:8080/durobot/v2/controlaccount',passwordFormData);
                }

                // 合并请求并处理
                axios.all([updateTime(),updatePassword()]).then(
                    axios.spread(function(resp1,resp2) {
                        console.log(resp1.data);
                        console.log(resp2.data);
                        // this.list[this.select].account = set_user_name;
                        that.list[that.select].password = set_user_password;
                        that.list[that.select].start_timestamp = set_user_effective;
                        that.list[that.select].end_timestamp = set_user_expiry;
                    })
                ).catch(
                    err1 => {console.log(err1)},
                    err2 => {console.log(err2)}
                );

                // 隐藏弹窗
                let edit_display = document.getElementById('editPage');
                edit_display.style.display = 'none';
            }
        },
        created() {
            // 获取账号信息列表，在此定义
            this.getUserInfo();
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        color: #fff;
        font-size: 25px;
        position: relative;
        .addUsers {
            margin: 0 auto 50px;
            label {
                line-height: 60px;
                span {
                    width: 80px;
                    line-height: 40px;
                }
                input {
                    width: 300px;
                    height: 40px;
                    font-size: 25px;
                }
            }
            .addButton {
                width: 100px;
                height: 60px;
                font-size: 40px;
            }
        }
        .userInfo {
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
            display: none;
            width: 600px;
            height: 600px;
            background-color: rgba(0, 0, 0, 0.5);
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -300px;
            /*margin-top: 150px;*/
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

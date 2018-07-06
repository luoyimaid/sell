<template>
    <div class="guest_content">
        <div class="userInfo">
            <table border="1px solid white">
                <thead>
                <tr>
                    <td>序号</td>
                    <td>姓名</td>
                    <td>称呼</td>
                    <td>等级</td>
                    <!--<td>照片</td>-->
                    <td>操作<div style="color: #999; font-size: 12px;">(如需修改，请删除后重新添加)</div></td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in list">
                    <td>{{item.uid}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.prefer_name}}</td>
                    <td>{{item.rank_level}}</td>
                    <!--<td>{{item.image}}</td>-->
                    <td>
                        <!--<input type="button" value="查看&编辑" @click="editUserInfo(index)"/>-->
                        <input type="button" value="删除" @click="deleteUserInfo(index)" style="width: 60px;"/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="editPage" id="editPage">
            <div>
                <span>1 主宾序号</span>
                <input type="text" class="setUser" id="set_user_id" readonly="readonly"/>
            </div>
            <div>
                <span>2 主宾姓名</span>
                <input type="text" class="setUser" readonly="readonly"/>
            </div>
            <div>
                <span>3 主宾称呼</span>
                <input type="text" class="setUser"/>
            </div>
            <div>
                <span>4 主宾级别</span>
                <input type="text" class="setUser"/>
            </div>
            <div>
                <input type="button" value="确定" class="addButton" @click="editConfirm"/>
            </div>
        </div>
    </div>
</template>

<script>
    let date = new Date();
    import md5 from 'js-md5';
    import axios from 'axios';
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
        props: {
            list: {
                type: Array
            }
        },
        data () {
            return {
                select: ""
            }
        },
        methods: {
            // 编辑用户信息
            editUserInfo: function (index) {
                this.select = index;
                let set_user_info = document.getElementsByClassName('setUser');
                set_user_info[0].value = this.list[index].uid;
                set_user_info[1].value = this.list[index].name;
                set_user_info[2].value = this.list[index].prefer_name;
                set_user_info[3].value = this.list[index].rank_level;
                set_user_info[4].src = this.list[index].image;
                let edit_display = document.getElementById('editPage');
                edit_display.style.display = 'block';
            },
            // 删除用户信息
            deleteUserInfo: function (index) {
                let formData = publicFormData();
                formData.append('req', 'face_verify_delete_user');
                formData.append('id',this.list[index].uid);
                axios.post('http://10.155.45.32:8081/durobot/guestface',formData).then(resp => {
                    console.log(resp.data);
                    // 删除用户
                    this.list.splice(index, 1);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 查看&编辑弹窗，确认修改
            editConfirm: function () {
                // 隐藏弹窗
                let edit_display = document.getElementById('editPage');
                edit_display.style.display = 'none';
            }
        }
    }
</script>

<style lang="scss" scoped>
    input,
    button,
    select,
    textarea{
        outline:none;
    }
    .userInfo {
        margin-bottom: 100px;
        margin-left: -100px;
        table {
            width: 800px;
            border: none;
            border-collapse: collapse;
            row-span: 0;
            text-align: center;
            margin-left: 100px;
            tbody,
            thead {
                tr {
                    font-size: 16px;
                    td {
                        height: 30px;
                    }
                }
            }
            tbody {
                tr {
                    td {
                        height: 30px;
                        input {
                            font-size: 16px;
                            width: 100px;
                            height: 25px;
                            background-color: dodgerblue;
                            color: #fff;
                            border-radius: 5px;
                            border: none;
                            cursor: pointer;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    }
    .editPage {
        color: #fff;
        display: none;
        width: 400px;
        height: 400px;
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        text-align: center;
        padding: 50px;
        div {
            padding: 20px 0;
            span {
                display: inline-block;
                width: 150px;
                /*float: left;*/
                text-align: left;
            }
            input {
                /*margin: 30px auto;*/
                width: 200px;
                height: 22px;
                font-size: 14px;
                border-radius: 5px;
                border: none;
            }
            .addButton {
                display: block;
                margin: 20px auto;
                width: 100px;
                height: 30px;
                cursor: pointer;
            }
        }
        div:nth-child(3){
            padding: 0 0 20px;
        }

    }
</style>

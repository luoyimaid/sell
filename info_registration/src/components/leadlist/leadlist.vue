<template>
    <div class="container">
        <div class="userInfo">
            <table width="800" border="1px solid white">
                <thead>
                <tr>
                    <td>序号</td>
                    <td>参观日期</td>
                    <td>参观时间段</td>
                    <td>带领人</td>
                    <td>带领人邮箱</td>
                    <td>操作</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in list">
                    <td>{{item.visit_id}}</td>
                    <td>{{item.start_timestamp}}</td>
                    <td>{{item.end_timestamp}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.email}}</td>
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
                <span>1 带领人序号</span>
                <input type="text" class="setUser" id="set_user_id"/>
            </div>
            <div>
                <span>2 参观日期</span>
                <date-picker class="setUser" :date="startTime" :option="option" :limit="limit"></date-picker>
            </div>
            <div>
                <span>3 参观时间段</span>
                <time-quantum class="setUser" :value="time_option" id="set_user_time"></time-quantum>
            </div>
            <div>
                <span>4 带领人姓名</span>
                <input type="text" class="setUser" readonly="readonly"/>
            </div>
            <div>
                <span>5 带领人邮箱</span>
                <input type="text" class="setUser" readonly="readonly"/>
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
    import axios from 'axios'
    import myDatePicker from 'vue-datepicker/vue-datepicker-es6.vue';
    import timeQuantum from "../timequantum/timequantum.vue";

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
        components: {
            'date-picker': myDatePicker,
            'time-quantum': timeQuantum
        },
        props: {
            list: {
                type: Array
            }
        },
        data () {
            return {
                select: "",
                time_option: "9:00 - 10:00",
                startTime: {
                    time: ""
                },
                option: {
                    type: 'day',
                    week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    format: 'YYYY-MM-DD',
                    placeholder: 'when?',
                    inputStyle: {
                        'display': 'inline-block',
                        'padding': '4px',
                        'line-height': '17px',
                        'font-size': '14px',
                        'width': '190px',
                        'border': '1px solid #ddd',
                        // 'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
                        'border-radius': '5px',
                        'color': '#5F5F5F'
                    },
                    color: {
                        header: '#ccc',
                        headerText: '#f00'
                    },
                    buttons: {
                        ok: 'Ok',
                        cancel: 'Cancel'
                    },
                    overlayOpacity: 0.5, // 0.5 as default
                    dismissible: true // as true as default
                },
                limit: [{
                    type: 'weekday',
                    available: [1, 2, 3, 4, 5]
                }, {
                    type: 'fromto',
                    from: '',
                    to: ''
                }]
            }
        },
        methods: {
            // 编辑用户信息
            editUserInfo: function (index) {
                this.select = index;
                let set_user_info = document.getElementsByClassName('setUser');
                this.startTime.time = this.list[index].start_timestamp;
                this.time_option = this.list[index].end_timestamp;
                set_user_info[0].value = this.list[index].visit_id;
                set_user_info[3].value = this.list[index].name;
                set_user_info[4].value = this.list[index].email;
                let edit_display = document.getElementById('editPage');
                edit_display.style.display = 'block';
            },
            // 删除用户信息
            deleteUserInfo: function (index) {
                let formData = publicFormData();
                formData.append('req', 'delete');
                formData.append('visit_id',this.list[index].visit_id);
                axios.post('http://10.155.45.32:8080/durobot/guiderinfo',formData).then(resp => {
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
                let set_user_time = document.getElementById('set_user_time').value;
                let set_user_id = document.getElementById('set_user_id').value;
                let set_user_date = this.startTime.time;

                function start(date,time) {
                    let start_time = time.substr(0,5);
                    return date + ' ' + start_time;
                }

                function end(date,time) {
                    let end_time = time.substr(8,5);
                    return date + ' ' + end_time;
                }

                console.log(start(set_user_date,set_user_time));
                console.log(end(set_user_date,set_user_time));

                // 更新账户时间请求
                let accountFormData = publicFormData();
                accountFormData.append('req','update');
                accountFormData.append('visit_id',that.list[that.select].visit_id);
                accountFormData.append('start_timestamp',new Date(start(set_user_date,set_user_time)).getTime());
                accountFormData.append('end_timestamp',new Date(end(set_user_date,set_user_time)).getTime());
                axios.post('http://10.155.45.32:8080/durobot//durobot/guiderinfo',accountFormData).then(resp =>{
                    console.log(resp.data);
                    that.list[that.select].visit_id = set_user_id;
                    that.list[that.select].start_timestamp = set_user_date;
                    that.list[that.select].end_timestamp = set_user_time;
                    console.log(that.list[that.select].start_timestamp,that.list[that.select].end_timestamp);
                }).catch(err => {
                    console.log(err);
                });
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
        table {
            border: none;
            border-collapse: collapse;
            row-span: 0;
            text-align: center;
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
                            width: 60px;
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

<template>
    <div class="content">
        <div class="title">百度大厦展厅小度讲解信息登记</div>
        <a href="javascript:void(0)" @click="goAnchor('#hr')">
            <input type="button" value="查看已添加信息" class="already_over" style="background-color: dodgerblue;"/>
        </a>
        <div class="selectDate">
            <span>1 选择开始参观日期:</span>
            <date-picker @datePickerEvent="receiveDate" id="datePicker"></date-picker>
        </div>
        <div class="selectTime">
            <span>2 选择参观时间段：</span>
            <time-quantum :value="time_option" id="timeQuantum"></time-quantum>
        </div>
        <div class="lead_info">
            <div class="aside_info">
                <div>3 添加带领人信息</div>
                <p>可有多个带领人，如带领人有更换，请注意在活动开始前重新添加</p>
            </div>
            <div>
                <lead-info :number="1" @leadNameEvent="leadName" @leadEmailEvent="leadEmail" id="leadInfo"></lead-info>
                <!-- <component :is="item.component" :number="num" v-for="item in items"></component> -->
            </div>
        </div>
        <!--<div class="content_info_add" @click="addContentInfo('lead-info')">添加带领人+</div>-->
        <input type="submit" value="提交" class="lead_info_submit" @click="submitLeadInfo"/>
        <hr style="margin-bottom: 100px;" id="hr"/>
        <lead-list :list="list"></lead-list>
        <div class="lead_info" id="to_guest_info">
            <a class="aside_info">
                <div style="color: dodgerblue; cursor: pointer; text-decoration: underline;" @click="clickToGuest">主宾打招呼功能信息登记</div>
            </a>
            <!--<div style="color: dodgerblue; cursor: pointer;" @click="clickToGuest">点击前往</div>-->
        </div>
    </div>
</template>

<script>
    let i = 1;
    let btn = true;
    let date = new Date();
    import md5 from 'js-md5';
    import axios from 'axios'
    import datePicker from '@/components/datepicker/datepicker.vue';
    import timeQuantum from '@/components/timequantum/timequantum.vue';
    import leadInfo from '@/components/leadinfo/leadinfo.vue';
    import leadList from '@/components/leadlist/leadlist.vue';

    var url = window.location.href;
    var array = url.split("/");
    var result = array[2];
    console.log(result);
    // 随机生成十位数字，字母组合字符
    function randomWord(randomFlag, min, max){
        var str = "",
            range = min,
            pos,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        if(randomFlag){
            range = Math.round(Math.random() * (max-min)) + min;
        }
        for(var i=0; i<range; i++){
            pos = Math.round(Math.random() * (arr.length-1));
            str += arr[pos];
        }
        return str;
    }

    // 加0操作
    function addZero(num){
        num < 10 ? num = '0' + num : num;
        return num;
    }

    // 设置正常的时间格式
    function getLocalTime(now) {
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        return year + "-" + addZero(month) + "-" + addZero(date);
    }

    // 设置生效及失效时间段
    function getTimeQuantum(start,end) {
        let hStart = start.getHours();
        let mStart = start.getMinutes();
        let hEnd = end.getHours();
        let mEnd = end.getMinutes();
        return addZero(hStart) + ':' + addZero(mStart) + ' - ' + addZero(hEnd) + ':' + addZero(mEnd);
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
            'date-picker': datePicker,
            'time-quantum': timeQuantum,
            'lead-info': leadInfo,
            'lead-list': leadList
        },
        data() {
            return {
                items: [],
                num: i,
                date_value: '',
                list: [],
                time_option: '10:30 - 12:00',
                name: '',
                email: ''
            }
        },
        methods: {
            // 点击查看已添加信息，定位到已添加表单
            goAnchor(selector) {
                let anchor = this.$el.querySelector(selector);
                document.documentElement.scrollTop = anchor.offsetTop
            },
            // 添加带领人信息
            // addContentInfo: function (name) {
            //     this.items.push({
            //         component: name,
            //     });
            //     i++;
            //     this.num = i;
            // },
            // 点击'立即前往'去往主宾信息登录界面
            clickToGuest: function() {
                this.$router.push({
                    path: '/Guest'
                });
            },
            // 接收date-picker组件传来的值
            receiveDate: function({value}) {
                this.date_value = value;
                console.log(this.date_value);
            },
            // 接收leadInfo里的name值
            leadName: function({name}) {
                this.name = name;
                console.log(this.name);
            },
            // 接收leadInfo里的email值
            leadEmail: function({email}) {
                this.email = email;
                console.log(this.email);
            },
            judge: function(){
                let time_quantum = document.getElementById('timeQuantum');
                let submit = document.getElementsByClassName('lead_info_submit')[0];
                if(this.email && this.name && this.date_value && time_quantum.value){
                    submit.style.backgroundColor = 'dodgerblue';
                }else{
                    submit.style.backgroundColor = '#ccc';
                }
            },
            // 获取带领人信息
            getLeadInfo: function() {
                // 发送请求的数据格式是 form-data 格式
                let formData = publicFormData();
                formData.append('req', 'list');
                formData.append('Host','yq01-rp-nlp-rd0-b33aa.yq01:8080');
                // 用post请求数据
                axios.post('http://10.155.45.32:8080/durobot/guiderinfo', formData).then(resp => {
                    // console.log(resp.data.data);
                    this.list = Object.assign([], resp.data.data);
                    // for (let i = 0; i < this.list.length; i++){
                    //     if(new Date().getTime() > resp.data.data[i].end_timestamp){
                    //         this.list.splice(i,1);
                    //          -- i;
                    //     }
                    // }
                    // console.log(result,array);
                    console.log(resp.data);
                    // 将请求到的时间戳转换为普通时间格式
                    for (let i = 0; i < this.list.length; i++) {
                        this.list[i].end_timestamp = getTimeQuantum(new Date(resp.data.data[i].start_timestamp),new Date(resp.data.data[i].end_timestamp));
                        this.list[i].start_timestamp = getLocalTime(new Date(resp.data.data[i].start_timestamp));
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 点击提交时新增用户
            submitLeadInfo () {
                let time_quantum = document.getElementById('timeQuantum');
                let lead_info = document.getElementById('leadInfo');

                function start(date,time) {
                    let start_time = time.substr(0,5);
                    return date + ' ' + start_time;
                }

                function end(date,time) {
                    let end_time = time.substr(8,5);
                    return date + ' ' + end_time;
                }

                console.log(this.date_value,time_quantum.value);
                console.log(Math.round(new Date(start(this.date_value,time_quantum.value)).getTime()/1000));
                console.log(Math.round(new Date(end(this.date_value,time_quantum.value)).getTime()/1000));
                // 新增用户请求时的参数
                let addFormData = publicFormData();
                addFormData.append('req', 'add');
                addFormData.append('email', this.email);
                addFormData.append('name', this.name);
                addFormData.append('start_timestamp',Math.round(new Date(start(this.date_value,time_quantum.value)).getTime()));
                // Math.round(new Date(start(this.date_value,time_quantum.value)).getTime()/1000).toString()
                addFormData.append('end_timestamp',Math.round(new Date(end(this.date_value,time_quantum.value)).getTime()));
                // Math.round(new Date(end(this.date_value,time_quantum.value)).getTime()/1000).toString()

                let that = this;
                // 判断用户邮箱和姓名是否重复，重复时，删除之前的带领人
                // for(let i = 0; i < that.list.length; i++){
                //     if(that.list[i].email === that.email && that.list[i].name === that.list[i].name){
                //         let deleteData = publicFormData();
                //         deleteData.append('req', 'delete');
                //         deleteData.append('visit_id',this.list[i].visit_id);
                //         axios.post('http://10.155.45.32:8081/durobot/guiderinfo',deleteData).then(resp => {
                //             console.log(resp.data);
                //             that.list.splice(i, 1);
                //         }).catch(err => {
                //             console.log(err);
                //         });
                //     }
                // }

                // 请求新增用户
                if(this.email && this.name && this.date_value && time_quantum.value){
                    for(let i = 0; i < this.list.length; i++){
                        if(this.date_value === this.list[i].start_timestamp && time_quantum.value === this.list[i].end_timestamp){
                            // alert("该时间段已被预约，请确认！");
                            this.$alert('该时间段已被预约，请确认！', '提示：', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$message({
                                        type: 'info',
                                        message: `action: ${ action }`
                                    });
                                    window.location.reload();
                                }
                            });
                        }
                    }
                    axios.post('http://10.155.45.32:8080/durobot/guiderinfo', addFormData).then(resp => {
                        console.log(resp.data);
                        // if(typeof resp.data === "string"){
                        //     let str = resp.data.slice(-76);
                        //     let data = JSON.parse(str);
                        //     // console.log(data);
                        //     if(data.error === 9004){
                        //         // alert("姓名与邮箱不匹配，请确认！");
                        //         this.$alert('姓名与邮箱不匹配，请确认！', '提示：', {
                        //             confirmButtonText: '确定',
                        //             callback: action => {
                        //                 this.$message({
                        //                     type: 'info',
                        //                     message: `action: ${ action }`
                        //                 });
                        //             }
                        //         });
                        //     }
                        // }
                        if(resp.data.error === 9004){
                            // alert("姓名与邮箱不匹配，请确认！");
                            this.$alert('姓名与邮箱不匹配，请确认！', '提示：', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$message({
                                        type: 'info',
                                        message: `action: ${ action }`
                                    });
                                }
                            });
                        }
                        else if(resp.data.error === 9002){
                            // alert("此员工不存在，请确认！");
                            this.$alert('此员工不存在，请确认！', '提示：', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$message({
                                        type: 'info',
                                        message: `action: ${ action }`
                                    });
                                }
                            });
                        }
                        else {
                            // 将输入信息添加到列表
                            this.list.push({
                                visit_id: randomWord(false,10),
                                name: this.name,
                                email: this.email,
                                start_timestamp: this.date_value,
                                end_timestamp: time_quantum.value
                            });
                            // window.location.reload();
                            let anchor = this.$el.querySelector("hr");
                            document.documentElement.scrollTop = anchor.offsetTop;
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                        alert("请将输入信息补充完整！");
                }
            }
        },
        created () {
            this.getLeadInfo();
        },
        watch: {
            'email':'judge'
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    #msg{
        width:266px;
        position: fixed;
        z-index:999;
        top: 49%;
        margin-top:-80px;
        left:50%;
        margin-left:-133px;
        background:#fff;
        box-shadow:5px 5px 8px #999;
        font-size:17px;
        color:#666;
        border:1px solid #f8f8f8;
        text-align: center;
        line-height: 2rem;
        display:inline-block;
        padding-bottom:20px;
        border-radius:2px;
    }
    #msg_top{
        background:#f8f8f8;
        padding:5px 15px 5px 20px;
        text-align:left;
    }
    #msg_top span{
        font-size:22px;
        float:right;
        cursor:pointer;
    }
    #msg_cont{
        padding:15px 20px 20px;
        text-align:left;
    }
    #msg_clear{
        display:inline-block;
        color:#fff;
        padding:1px 15px;
        background:#8fc31f;
        border-radius:2px;
        float:right;
        margin-right:15px;
        cursor:pointer;
    }


    .content {
        padding: 0 300px 200px;
        input,
        button,
        select,
        textarea{
            outline:none;
        }
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 24px;
            padding-bottom: 50px;
        }
        .already_over,
        .lead_info_submit {
            width: 100px;
            height: 30px;
            font-size: 12px;
            background-color: #ccc;
            color: #fff;
            border-radius: 5px;
            border: none;
            cursor: pointer;
        }
        .already_over {
            display: inline-block;
            margin-left: 600px;
            margin-bottom: 50px;
        }
        .lead_info_submit {
            display: block;
            margin: 100px auto;
        }
        .selectDate {
            span {
                display: inline-block;
                width: 250px;
            }
        }
        .selectTime {
            margin: 50px 0;
            span {
                width: 250px;
                display: inline-block;
            }
        }
        .lead_info{
            display: flex;
            align-items: flex-start;
            .aside_info {
                display: inline-block;
                width: 250px;
                p {
                    padding-right: 50px;
                    font-size: 12px;
                    color: #999999;
                }
            }
        }
        .content_info_add {
            line-height: 60px;
            font-size: 14px;
            color: dodgerblue;
            cursor: pointer;
            margin-left: 250px;
            margin-bottom: 50px;
        }
    }
</style>

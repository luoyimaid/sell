<template>
    <div class="otherInfo">
        <div class="check_box">
            <p>选择产品线</p>
            <label><input type="radio" v-model="gender" value="dasha"/>大厦</label>
            <label><input type="radio" v-model="gender" value="kejiyuan"/>科技园</label>
            <label><input type="radio" v-model="gender" value="shenyan"/>深研</label>
            <label><input type="radio" v-model="gender" value="haidiangongyuan"/>海淀公园</label>
        </div>
        <div class="check_effect">
            <p>是否生效</p>
            <select>
                <option>是</option>
                <option>否</option>
            </select>
        </div>
        <div class="check_time">
            <span>开始时间</span><input type="datetime-local" value="" id="start_time"/>
        </div>
        <div class="check_time">
            <span>结束时间</span><input type="datetime-local" value="" id="end_time"/>
        </div>
    </div>
</template>

<script>
    let date = new Date();
    // 加0操作
    function addZero(num){
        num < 10 ? num = '0' + num : num;
        return num;
    }
    export  default {
        data () {
            return {
                gender: ''
            }
        },
        mounted () {
            // 初始化开始及结束时间
            function initTime(now) {
                let year = now.getFullYear();
                let month = now.getMonth() + 1;
                let date = now.getDate();
                let hour = now.getHours();
                let minute = now.getMinutes();
                let second = now.getSeconds();
                return year + "-" + addZero(month) + "-" + addZero(date) + "T" + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);
            }
            document.getElementById('start_time').value = initTime(date);
            document.getElementById('end_time').value = initTime(date);
            console.log(initTime(date));
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
    .otherInfo {
        width: 500px;
        margin-left: 185px;
        padding-top: 30px;
        .check_box,
        .check_effect {
            display: flex;
            justify-content: space-between;
            align-items: center;
            p {
                display: inline-block;
            }
            label {
                cursor: pointer;
            }
            select {
                width: 40px;
                height: 25px;
                background-color:#fff;
                border-color:#dddddd;
            }
        }
        .check_effect {
            justify-content: flex-start;
            p {
                width: 120px;
                text-align: left;
            }
        }
        .check_time {
            display: inline-block;
            float: left;
            line-height: 50px;
            span {
                text-align: left;
                display: inline-block;
                width: 120px;
            }
            input {
                width: 250px;
                height: 25px;
            }
        }
    }
</style>

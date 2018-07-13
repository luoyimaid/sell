<template>
    <div class="selectDate">
        <date-picker v-bind:value="value" @change="localTimechange" :date="startTime" :option="option" :limit="limit" id="select_date"></date-picker>
    </div>
</template>

<script>
    import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue';

    let date = new Date();

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

    export default {
        components: {
            'date-picker': myDatepicker
        },
        data() {
            return {
                value: getLocalTime(date),
                // value: '',
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
                    from: getLocalTime(date),
                    to: ''
                }]
            }
        },
        methods: {
            localTimechange: function(val) {
                this.value = val;
                this.$emit('datePickerEvent', {value: this.value});
            }
        },
        mounted () {
            this.startTime.time = getLocalTime(date);
            this.$emit('datePickerEvent', {value: this.value});
            // console.log(this.value);
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
    input {
        width: 200px;
        height: 25px;
        border-radius: 5px;
        border: #ddd 1px solid;
        box-shadow: none;
    }
    #datePicker {
        display: inline-block;
    }
</style>

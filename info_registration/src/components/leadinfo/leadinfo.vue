<template>
    <div class="content_info">
        <div class="content_info_title">带领人{{number}}：</div>
        <label class="content_info_name">
            <span>姓名</span>
            <input type="text" @blur="judgeName" id="info_name" placeholder="输入中文或英文名"/>
        </label>
        <label class="content_info_email">
            <span>百度邮箱</span>
            <input type="text" @blur="judgeEmail" id="info_email" placeholder="输入百度邮箱前缀"/>
        </label>
        <div class="content_info_photo">
            <div>带领人照片</div>
            <div>请在百度HI上注册人脸方可生效</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            'number':{},
        },
        data() {
            return {
                name:'',
                email:''
            }
        },
        methods: {
            // 失去焦点时验证姓名格式，判断带领人姓名是否存在
            judgeName: function () {
                let name = /^(([\u4e00-\u9fa5 ]{2,20})|([a-zA-Z\/ ]{2,20}))$/;
                let $name = document.getElementById('info_name');
                this.name = $name.value;
                if (!(name.test($name.value))) {
                    $name.style.borderColor = 'red';
                }else {
                    $name.style.borderColor = '#ddd';
                    this.$emit('leadNameEvent', { name: this.name });
                }
            },
            // 失去焦点时判断邮箱格式是否正确，以及邮箱是否存在，和用户名是否匹配
            judgeEmail: function () {
                let email = /^([a-zA-Z0-9]+)$/;
                let $email = document.getElementById('info_email');
                this.email = $email.value;
                // 密码不符合验证时，提示文字标红
                if(!(email.test($email.value))){
                    $email.style.borderColor = 'red';
                }else {
                    $email.style.borderColor = '#ddd';
                    this.$emit('leadEmailEvent', { email: this.email });
                }
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
    .content_info {
        /*display: inline-block;*/
        margin-bottom: 30px;
        .content_info_title {
            padding-bottom: 20px;
        }
        .content_info_name,
        .content_info_email {
            display: block;
            padding-bottom: 20px;
            span {
                display: inline-block;
                width: 80px;
            }
            input {
                box-shadow: none;
                border: 1px #ddd solid;
                width: 200px;
                height: 20px;
            }
            textarea {
                width: 300px;
                height: 60px;
                border-color: #c8c8cd;
                resize: none;
            }
        }
        .content_info_photo{
            display: flex;
            align-items: flex-end;
            div:nth-child(1) {
                padding-right: 40px;
            }
            div:nth-child(2) {
                color: red;
                font-size: 14px;
            }
        }
    }
</style>

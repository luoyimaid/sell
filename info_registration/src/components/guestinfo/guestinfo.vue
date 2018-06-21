<template>
    <div class="content_info" >
        <div class="content_info_title">主宾1：</div>
        <label class="content_info_name">
            <span>姓名</span>
            <input type="text" value="" id="guest_name" @blur="judgeGuestName" placeholder="习近平"/>
        </label>
        <label class="content_info_name">
            <span>打招呼称呼</span>
            <input type="text" value="" id="guest_call" @blur="judgeGuestCall" placeholder="习主席"/>
        </label>
        <label class="content_info_name">
            <span>级别</span>
            <input type="text" value="" id="guest_level" @blur="judgeGuestLevel" placeholder="L 10"/>
        </label>
        <div class="content_info_photo">
            <div style="width: 120px;">上传照片</div>
            <div>
                <a href="javascript:;" class="file">选择文件
                    <input type="file" name="" id="file" accept="image/png,image/gif,image/jpeg" @change="selectImage" style="display: inline-block;">
                </a>
                <!--<input type="file" onchange="selectImage(this);" class="click_upload" style="display: inline-block;"/>-->
                <div class="preview_photo">
                    <img id="image" src="@/assets/demo.jpeg"/>
                </div>
                <div id="photo_name" style="text-align: center;">xxx.png</div>
                <!--<el-upload-->
                    <!--class="upload-demo"-->
                    <!--action="https://jsonplaceholder.typicode.com/posts/"-->
                    <!--:on-preview="handlePreview"-->
                    <!--:on-remove="handleRemove"-->
                    <!--:on-change="handleChange"-->
                    <!--:file-list="fileList2"-->
                    <!--list-type="picture">-->
                    <!--<el-button size="small" type="primary" @click="loadImage">点击上传</el-button>-->
                    <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                <!--</el-upload>-->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        // props: ['image'],
        data () {
            return {
                image: '',
                guest_name: '',
                guest_call: '',
                guest_level: '',
                fileList2: [{name: 'demo.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]

            }
        },
        methods: {
            judgeGuestName: function () {
                let name = /^(([\u4e00-\u9fa5 ]{2,20})|([a-zA-Z\/ ]{2,20}))$/;
                let $name = document.getElementById('guest_name');
                if (!(name.test($name.value))) {
                    $name.style.borderColor = 'red';
                }else {
                    $name.style.borderColor = '#ddd';
                    this.$emit('onLoadName',{name:$name.value});
                }
            },
            judgeGuestCall: function () {
                let name = /^(([\u4e00-\u9fa5 ]{2,20})|([a-zA-Z\/ ]{2,20}))$/;
                let $name = document.getElementById('guest_call');
                if (!(name.test($name.value))) {
                    $name.style.borderColor = 'red';
                }else {
                    $name.style.borderColor = '#ddd';
                    this.$emit('onLoadCall',{call:$name.value});
                }
            },
            judgeGuestLevel: function() {
                let level = document.getElementById('guest_level').value;
                this.$emit('onLoadLevel',{level:level});
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleChange(file){
                this.image = file.url;
                // console.l
                console.log(file);
            },
            // loadImage(){
            //     this.fileList2.pop();
            //     // console.log(this.fileList2);
            // },
            selectImage: function(evt) {
                let that = this;
                let file = document.getElementById('file');
                // let newImage = evt.target.files[0];
                this.image = file.files[0];
                // console.log(this.image);
                this.$emit('onLoadImage',{image:this.image});

                // let file = document.getElementById('file');
                if(!file.files || !file.files[0]){
                    return;
                }
                let reader = new FileReader();
                reader.onload = function(evt){
                    document.getElementById('image').src = evt.target.result;
                    // that.image = evt.target.result;
                    document.getElementById('photo_name').innerHTML = file.files[0].name;
                    // console.log(evt.target);
                    that.$emit('onLoadImage',{image:that.image});
                    // console.log(that.image);
                };
                // reader.readAsBinaryString(file.files[0]);
                reader.readAsDataURL(file.files[0]);
            }
        },
        updated() {

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
        display: block;
        text-align: left;
        padding-left: 200px;
        /*display: inline-block;*/
        .content_info_title {
            padding-bottom: 40px;
        }
        .content_info_name {
            display: block;
            padding-bottom: 40px;
            span {
                display: inline-block;
                width: 120px;
            }
            input {
                box-shadow: none;
                border: 1px #ddd solid;
                width: 200px;
                height: 20px;
            }
        }
        .content_info_photo{
            display: flex;
            align-items: flex-start;
            div:nth-child(1) {
                padding-right: 20px;
            }
            div label {
                display: block;
                padding-bottom: 10px;
            }
            .preview_photo {
                width: 100px;
                height: 100px;
                border: 10px solid #ccc;
                padding: 2px;
                margin-top: 20px;
                img {
                    width: 100px;
                    height: 100px;
                    margin: auto;
                }
            }
            .file {
                position: relative;
                display: inline-block;
                background: dodgerblue;
                border: 1px solid dodgerblue;
                border-radius: 4px;
                padding: 4px 12px;
                overflow: hidden;
                color: #fff;
                text-decoration: none;
                text-indent: 0;
                line-height: 20px;
            }
            .file input {
                position: absolute;
                font-size: 100px;
                right: 0;
                top: 0;
                opacity: 0;
            }
            .file:hover {
                background: dodgerblue;
                border-color: dodgerblue;
                color: #fff;
                text-decoration: none;
            }
            /*.click_upload {*/
                /*display: none;*/
                /*background-color: dodgerblue;*/
                /*color: #fff;*/
                /*border: none;*/
                /*margin-left: 10px;*/
                /*width: 70px;*/
                /*height: 20px;*/
                /*border-radius: 5px;*/
                /*cursor: pointer;*/
            /*}*/
        }
    }
</style>

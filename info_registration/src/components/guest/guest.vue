<template>
    <div class="content">
        <div class="title">主宾人脸信息登记</div>
        <div class="already_over">
            <div class="notes">可添加多个主宾，同一场活动中，如果有多个主宾到访，请按照主宾的重要程度顺序添加主宾信息</div>
            <div>
                <a href="javascript:void(0)" @click="goAnchor('#hr')">
                    <input type="button" value="查看已添加信息"/>
                </a>
            </div>
        </div>
        <div class="add_guest">
            <guest-info @onLoadName="onLoadName" @onLoadCall="onLoadCall" @onLoadLevel="onLoadLevel" @onLoadImage="onLoadImage"></guest-info>
            <component :is="item.component" v-for="item in items" :key="item"></component>
        </div>
        <input type="button" value="提交" @click="submitGuestInfo"  class="submit_guest_info"/>
        <hr id="hr"/>
        <guest-list :list="list"></guest-list>
    </div>
</template>

<script>
    let date = new Date();
    import pinyin from 'js-pinyin'
    import md5 from 'js-md5';
    import axios from 'axios'
    import guestInfo from '@/components/guestinfo/guestinfo.vue';
    import selectInfo from '@/components/selectinfo/selectinfo.vue';
    import guestList from '@/components/guestlist/guestlist.vue';

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
            'guest-info': guestInfo,
            'select-info': selectInfo,
            'guest-list': guestList
        },
        data () {
            return {
                items: [],
                image: '',
                guest_name: '',
                guest_call: '',
                guest_level: '',
                list: [],
            }
        },
        methods: {
            // 添加主宾
            addContentInfo: function (name) {
                this.items.push({
                    component: name,
                });
            },
            // 点击查看已添加信息，定位到已添加表单
            goAnchor(selector) {
                let anchor = this.$el.querySelector(selector);
                document.documentElement.scrollTop = anchor.offsetTop
            },
            // 主宾信息组件的值传递给父元素
            onLoadName: function({name}) {
                this.guest_name = name;
                console.log(this.guest_name);
            },
            onLoadCall: function({call}) {
                this.guest_call = call;
                console.log(this.guest_call);
            },
            onLoadLevel: function({level}) {
                this.guest_level = level;
                console.log(this.guest_level);
            },
            onLoadImage: function({image}) {
                this.image = image;
                console.log(this.image);
                // console.log(convertBase64UrlToBlob(this.image));
            },
            // 获取主宾信息列表
            getGuestInfo: function () {
                let formData = publicFormData();
                // 按照主宾级别大小进行排序，级别大着在前
                let compare = function(prop){
                    return function(obj1,obj2){
                        let rank1 = obj1[prop];
                        let rank2 = obj2[prop];
                        if (rank1 < rank2) {
                            return 1;
                        } else if (rank1 > rank2) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                };

                formData.append('req', "face_verify_list_user");
                axios.post('http://10.155.45.32:8080/durobot/guestface', formData).then(resp => {
                    // console.log(resp.data);
                    // let data = resp.data;
                    // console.log(typeof resp.data);
                    let str = resp.data.slice(13);
                    let data = JSON.parse(str);
                    this.list = Object.assign([],data.data);
                    this.list.sort(compare('rank_level'));
                    console.log(data);
                }).catch(err => {
                    console.log(err);
                })
            },
            // 点击提交时新增用户
            submitGuestInfo () {
                let that = this;
                function randomWord(){
                    // pinyin.setOptions({checkPolyphone: false, charCase: 0});
                    let id = pinyin.getFullChars(that.guest_name);
                    return 'id_' + id.toLowerCase();
                }

                // 新增用户请求时的参数
                let id = randomWord();
                let addFormData = publicFormData();
                addFormData.append('req', 'face_verify_add_user_file');
                addFormData.append('image',that.image);
                addFormData.append('id',id);
                addFormData.append('name', this.guest_name);
                addFormData.append('prefer_name', this.guest_call);
                addFormData.append('rank_level', this.guest_level);

                // 请求新增用户
                axios.post('http://10.155.45.32:8080/durobot/guestface', addFormData).then(resp => {
                    console.log(resp.data);
                    // 将输入信息添加到列表
                    if(this.image && this.guest_name && this.guest_call && this.guest_level) {
                        this.list.push({
                            uid: id,
                            image: this.image,
                            name: this.guest_name,
                            prefer_name: this.guest_call,
                            rank_level: this.guest_level,
                        });
                    } else {
                        alert("请将添加信息补充完整！")
                    }
                    window.location.reload();
                    let anchor = this.$el.querySelector("#hr");
                    document.documentElement.scrollTop = anchor.offsetTop
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        created() {
            this.getGuestInfo();
        }
    }
</script>

<style lang="scss" scoped>
    .content {
        padding: 0 300px 200px;
        text-align: center;
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
        .already_over {
            text-align: center;
            display: flex;
            justify-content: center;
            div {
                margin-left: 100px;
                a {
                    input {
                        width: 100px;
                        height: 30px;
                        font-size: 12px;
                        background-color: dodgerblue;
                        color: #fff;
                        border-radius: 5px;
                        border: none;
                        cursor: pointer;
                        margin-bottom: 50px;
                    }
                }
            }
            .notes {
                width: 350px;
                color: #ccc;
                font-size: 14px;
                text-align: left;
            }

        }
        .content_info_add {
            line-height: 60px;
            font-size: 14px;
            color: dodgerblue;
            cursor: pointer;
            margin-left: -350px;
        }
        .submit_guest_info {
            width: 100px;
            height: 30px;
            font-size: 14px;
            background-color: dodgerblue;
            color: #fff;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            margin-top: 100px;
            /*<!--margin-left: -550px;-->*/
            /*margin-bottom: 50px;*/
        }
        hr {
            display: block;
            width: 800px;
            height: 1px;
            margin: 100px 0 100px;
        }
    }
</style>

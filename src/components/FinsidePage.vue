<script>
import FmakeSurePage from '../components/FmakeSurePage.vue';

export default{
    components:{
        FmakeSurePage,
    },
    data(){
        return{
            page: 1,

            data:{
                name: "",
                phone: "",
                email: "",
                age: "",
                radioText: "",
            },
        }
    },
    methods:{
///////////////////////////////傳送後跳出確認視窗
        send() {
            this.page= 2;
        },
///////////////////////////////傳送後跳出確認視窗
        getedit(x) {
            this.page = 1
            x = this.data
        }
    },
}
</script>


<template>
<div class="body">
    <div class="mainArea">
        <h1 class="flicker">青春洋溢高中生人氣投票站</h1>
        <div >
            <div class="textArea"><p>投給你最喜歡的高中生，為她加油打氣，一人一票，本票所秉持公平公正公開三大原則</p>
            </div>
            <div>
                <div class="d-flex align-middle">
                    <p>姓名</p>
                    <input type="text " v-model="data.name">
                </div>
                <div class="d-flex align-middle">
                    <p>手機</p>
                    <input type="text" v-model="data.phone" >
                </div>
                <div class="d-flex align-middle">
                    <p>信箱</p>
                    <input type="text " v-model="data.email">
                </div>
                <div class="d-flex align-middle">
                    <p>年齡</p>
                    <input type="number"  v-model="data.age" >
                </div>
            </div>
        </div>

        <div class="radioArea">
            <p>請投給以下一位</p>
            <div class="radio">
                <input type="radio" value="ㄈㄅㄌ(建國中學)" name="man" v-model="data.radioText">
                <label for="">ㄈㄅㄌ(建國中學)</label>
            </div >
            <div class="radio">
                <input type="radio" value="小美(金甌女中)"  name="man" v-model="data.radioText">
                <label for="">小美(金甌女中)</label>
            </div>
            <div class="radio">
                <input type="radio" value="大壯(金門高中)"  name="man" v-model="data.radioText">
                <label for="">大壯(金門高中)</label>
            </div>
            <div class="radio">
                <input type="radio" value="小咖樂咪(基隆高中)"  name="man" v-model="data.radioText">
                <label for="">小咖樂咪(基隆高中)</label>
            </div>
        </div>
        <div class="buttonArea">
            <button type="button" @click="cencel()">回首頁</button>
            <button type="button" @click="send()">送出</button>
        </div>
        <div class="popup" v-if="this.page===2">
            <div>
                <FmakeSurePage
                    :makeSure = data
                @edit = getedit
                />
            </div>
        </div>
</div>
</div>

</template>

<style lang="scss" scoped>
h1{
    text-align: center;
}

p{
    font-size: 16pt;
    margin: 0;
    margin-right: 1%;
    font-weight: bold;
    color: white;
    text-align: center;
}

label{
    font-weight: bold;
    font-size: 16pt;
    margin-left: 1%;
    color: white;
}


button{
    margin: 0 1%;
    background-color: rgb(228, 24, 228);
    border-radius: 10px;
    box-shadow: 1px 1px 0px 1px;
    
}

div{
    margin: 1% 0;
}
/////////////////////////////////////////////////////////////隱藏type=nunber的箭頭
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
////////////////////////////////////////////////////////////
.body{
    width: 100%;
    height: 100%;
    border: 1px solid black;
    background-color: purple;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    .textArea{
        background-color: rgb(199, 0, 199);
        border-radius: 10px;
        box-shadow: 3px 2px 0px 2px;
        padding: 0 1%;
    }
    .radioArea{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .buttonArea{
        display: flex;
        justify-content: center;
    }
    .radio{
        width: 20%;
    }
}
.d-flex{
    width: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    margin: 1%;
    
}

.mainArea{
    width: 70%;
    margin: 15%;
    height: 90%;
}
.d-flex input {
    vertical-align: middle;
    border-radius: 10px;
    padding: 0 1%;
    box-shadow: 3px 4px 0px 1px;
}
////////////////////////////////////////////////////////////////////////////title特效
.flicker{
		color:#e3d6f1; /*設定文字顏色*/
		font-size:50px; /*設定字型大小*/
		font-weight:bolder; /*設定字型粗細*/
		-webkit-animation: flicker 2s infinite;    /*設定動畫*/
}
        @-webkit-keyframes flicker{                    /*建立動畫*/
		    0%{
		        opacity: 1;
		    }
		    50%{
		        opacity: 0.5;
		    }
		    100%{
		        opacity: 1;
		    }
		}
////////////////////////////////////////////////////////////////////////////title特效
</style>
<script>
import MakeSure from '../components/MakeSure.vue'

export default{
    components:{
        MakeSure,
    },
    methods:{
        ///////////////////////前往確認投票
        goMakeSure(){
            this.page = 2;
        },
        /////////////////////////從卻人投票返回
        changePage(x){
            this.page = x;
        }
    },
    data(){
        return{
            page: 1,
            
            info:{
                name: "",
                phone: "",
                email: "",
                age:"",
                radioText: "", 
            }
        }
    }
}
</script>

<template>
<div v-if="this.page ===1">
    <h1>內頁</h1>
    <h1>題目</h1>
    <div class="illustrate">
        <h1>問卷說明</h1>
    </div>
    <p>姓名</p>
    <input type="text" v-model="info.name">
    <p>手機</p>
    <input type="number" v-model="info.phone">
    <p>Eamil</p>
    <input type="text" v-model="info.email">
    <p>年齡</p>
    <input type="number" v-model="info.age">
    <p>1.請投給以下一位</p>
    <div>
    <input type="radio" v-model="radioText" name="food" value="核廢料(建國中學)" id="">
    <label for="">核廢料(建國中學)</label>
    </div>
    <div>
    <input type="radio" v-model="radioText" name="food" value="+7(金甌女中)" id="">
    <label for="">+7(金甌女中)</label>
    </div>
    <div>
    <input type="radio" v-model="radioText" name="food" value="bigdog(金門高中)" id="">
    <label for="">bigdog(金門高中)</label>
    </div>
    <div>
    <input type="radio" v-model="radioText" name="food" value="lambo(基隆高中)" id="">
    <label for="">lambo(基隆高中)</label>
    </div>
    <div>
    <button type="button">取消</button>
    <button type="button" @click="goMakeSure()">送出</button>
    </div>
</div>
<div v-if="this.page===2">
<MakeSure :vout="info"  
    @closepage="changePage"/>
</div>

</template>
<style lang="scss" scoped>
.illustrate{
    width: 600px;
    height: 200px;
    border: 1px solid black;
}
</style>
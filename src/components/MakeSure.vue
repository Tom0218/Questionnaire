<script>
export default{
    props:[

        'vout'
    ],
    methods:{
        goBack(){
            let x = 1;
            this.$emit('closepage',x)
            // 缺資料回傳功能
        }
    }
    
}
</script>
<template>
    <h1>投票確認畫面</h1>
    <div class="d-flex">
        <p>name</p>
        <p>{{ this.vout.name }}</p>
    </div >
    <div class="d-flex">
        <p>phone</p>
        <p>{{ this.vout.phone }}</p>
    </div>
    <div class="d-flex">
        <p>email</p>
        <p>{{ this.vout.email }}</p>
    </div>
    <div class="d-flex">
        <p>age</p>
        <p>{{ this.vout.age }}</p>
    </div>
    <button type="button" @click="goBack()">修改</button>
    <button type="button" @click="goMakeSure()">送出</button>
</template>
<style lang="scss" scoped></style>
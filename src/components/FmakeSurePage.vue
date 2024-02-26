<script>
export default{
    methods:{
    
    },
    props:[
            "makeSure"
        ]
}
</script>


<template>
<div class="body">
<p>姓名 : {{ this.makeSure.name}}</p>
<p>手機 : {{ this.makeSure.phone}}</p>
<p>信箱 : {{ this.makeSure.email }}</p>
<p>年齡 : {{ this.makeSure.age }}</p> 
<p>您的選擇是 : {{ this.makeSure.radioText }}</p>
<button type="button" @click="$emit('edit',this.makeSure)">修改</button>
<button type="button">送出</button>
</div>


</template>



<style lang="scss" scoped>
button{
    margin: 0 1%;
    background-color: rgb(228, 24, 228);
    border-radius: 10px;
    box-shadow: 1px 1px 0px 1px;
}
p{
    font-weight: bold;
    font-size: 16pt;
    color: white;
}
.body{
    height: 500px;
    width: 500px;
    background-color: #495E57;
}


</style>
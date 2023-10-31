<script>
import { RouterLink,RouterView } from 'vue-router';
import indexState from '../stores/indexState';
import {mapState,mapActions} from 'pinia';

export default{
    components:{
        RouterLink,
        RouterView,
    },

    computed:{
        ...mapState(indexState,["toDayDate","endDayDate"])
        
        
    },
    mounted() {
        const startDate = document.getElementById('stardDate');///boject
        console.log(startDate)

    },

    data(){
        return{
            page: 1,
        }
    },
    methods:{
        print(){
            const startDate = document.getElementById('stardDate');
            console.log(startDate)
        }
    }
    
}
</script>

<template>
<h1>home</h1>
<RouterLink to="InsidePage">InsidePage</RouterLink>
<RouterLink to="MakeSurePage">MakeSurePage</RouterLink>
<RouterLink to="StatisticsPage">StatisticsPage</RouterLink>

<div class="mainArea">
    <h1>列表頁</h1>
        <div class="searchArea">
            <div class="aa">
                <div class="input">
                    <p>問卷標題</p>
                    <input type="text" id="titlesearch">
                </div>
                <div class="date">
                    <input type="date" name="" id="startDate" v-model="toDayDate">
                    <input type="date" name="" id="endDate" v-model="endDayDate">
                    <button type="button">搜尋</button>
                </div>
            </div>
        </div>
        <!-- -------------------------------------------list預設<table> -->
        <div class="listArea">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">問卷</th>
                        <th scope="col">狀態</th>
                        <th scope="col">開始時間</th>
                        <th scope="col">結束時間</th>
                        <th scope="col">觀看統計</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td><a href="#">問卷1</a></td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td><a href="#">問卷2</a></td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td><a href="#">問卷3</a></td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="changePage"></div>
        <!-- -------------------------------------------list預設<table> -->
            
        <!-- ----------------------------------------list for迴圈實現 -->
        <!-- <div class="listArea">
            <div v-for=""></div>
        </div> -->
        <!-- ----------------------------------------list for迴圈實現 -->
</div> 
        <button @click="print()">123</button>
</template>

<style lang="scss" scoped>
p{
    margin: 0;
}
input{
    height: 20px;
}
table{
    width: 100%;
    text-align: left;
}
.mainArea{
    height: 100vh;
    width: 100vw;
    background-color: whitesmoke;
    .searchArea{
        height: 15%;
        width: 60%;
        border: 1px black solid;
        margin: 0 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        .aa{
        }
        .input{
            width: auto;
            display: flex;
            margin-bottom: 10%;
        }
    }
    .listArea{
        height: 50%;
        width: 70%;
        margin: 15%;
        border: 1px black solid;
        margin: 0 15%;
    }
    .changePage{
        height: 10%;
        width: 40%;
        border: 1px black solid;
        margin: 0 30%;
    }
    
}
</style>


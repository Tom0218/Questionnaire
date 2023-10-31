<script>
import InsidePage from './InsidePage.vue';
import StatisticsPage from'./StatisticsPage.vue'

export default{
    components:{
        InsidePage,
        StatisticsPage,
    },
    mounted(state){
        const startDate = document.getElementById('startDate')
        const currentDate = new Date();//今天年月日
        //long:以完整名稱顯示
        //numeric:以數字型態顯示
        /////////////////////////////////////////////////////////////////////////////////////////此為mdn方法不是我們要的格式
        const day = {day: 'numeric'};
        const year = {year: 'numeric'};
        const month = {month: 'long'};
        // const weekday = {weekdat: 'long'};
        // const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // console.log(currentDate.toLocaleDateString(undefined, options));
        //2023年10月26號 星期四
////////////////////////////////////////////////////////////////////////////////////////////////////////
        //拆分成年月日三個變數
        //.padStart (指定字串最小長度,”不夠長的部分要用來填滿的內容”)用於出現單位數的日期或月份的時候顯07 or 02
        ////由於得到的是x日x月x年，所以需刪除中文
        ///slice(Start,end)  ，end為負數則表示從數組最末端開始
        const today = currentDate.toLocaleString(undefined,day).slice(0,-1).padStart(2,"0");
        const tomonth = currentDate.toLocaleString(undefined, month).slice(0,-1).padStart(2,"0");
        const toyear = currentDate.toLocaleString(undefined,year).slice(0,-1).padStart(4,"0");
        const defaultDate = [toyear,tomonth,today].join('-');
        //存進startdate
        startDate.value = defaultDate;
        /////////////////////////////////////////////////////////////////
        const endDate =document.getElementById('endDate');
        var plusDate = new Date().getDate()
        const sevenDate = new Date().setDate(plusDate+7)
        const sevenDatetime = new Date(sevenDate)
        const sevtoday = sevenDatetime.toLocaleString(undefined,day).slice(0,-1).padStart(2,"0");
        const sevmonth = currentDate.toLocaleString(undefined, month).slice(0,-1).padStart(2,"0");
        const sevyear = currentDate.toLocaleString(undefined,year).slice(0,-1).padStart(4,"0");
        const a = [sevyear,sevmonth,sevtoday].join('-');
        endDate.value = a
    }
    
}
</script>
<template>
<div class="mainArea">
    <h1>列表頁</h1>
        <div class="searchArea">
            <div class="aa">
                <div class="input">
                    <p>問卷標題</p>
                    <input type="text" id="titlesearch">
                </div>
                <div class="date">
                    <input type="date" name="" id="startDate" >
                    <input type="date" name="" id="endDate" >
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
        <!-- -------------------------------------------list預設<table> -->
            
        <!-- ----------------------------------------list for迴圈實現 -->
        <!-- <div class="listArea">
            <div v-for=""></div>
        </div> -->
        <!-- ----------------------------------------list for迴圈實現 -->
        <div class="changePage"></div>
</div>    
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
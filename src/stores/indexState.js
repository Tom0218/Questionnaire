import { defineStore } from 'pinia'//////////////匯入pinia預設管理工具

export default defineStore('indexState',{
  state:()=>{
    return{
      //獲取今天日期，必須new
      currentDate : new Date(),
      day:{day: 'numeric' },  //numeric以數字型態顯示
      month:{month: 'long'},  //以完整名稱顯示
      year:{year: 'numeric'},
    }
  },getters:{
    //一定要帶入state否則沒資料
    //今天日期格式化區域
      toDayDate:(state)=>{
        const today = state.currentDate.toLocaleString(undefined,state.day).slice(0,-1).padStart(2,"0");
        const tomonth = state.currentDate.toLocaleString(undefined, state.month).slice(0,-1).padStart(2,"0");
        const toyear = state.currentDate.toLocaleString(undefined, state.year).slice(0,-1).padStart(4,"0");
        const toDayDate = [toyear,tomonth,today].join('-');
        console.log(toDayDate);
        return toDayDate
      },
      ////////////////////////////推算七天後區域
      endDayDate:(state)=>{
        const plusDate = state.currentDate.getDate()//單取今天的日期(要給sevenDate+上去使用)
        const sevenDay = state.currentDate.setDate(plusDate+7);
        const sevenDate = new Date(sevenDay)
        // const sevenDay = state.currentDate.setDate(plusDate+7)//加上七天的毫秒數值
        // const sevenDate = new Date(sevenDay) //OK 轉數值了

        const finDay = sevenDate.toLocaleString(undefined,state.day).slice(0,-1).padStart(2,"0")
        const finMonth = sevenDate.toLocaleString(undefined,state.month).slice(0,-1).padStart(2,"0")
        const finYear = sevenDate.toLocaleString(undefined,state.year).slice(0,-1).padStart(4,"0")
        const finAnwser = [finYear,finMonth,finDay].join('-')

        return endDayDate
    }
  } 
})

  

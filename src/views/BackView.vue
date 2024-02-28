<script>
export default{
    data(){
        return{
            allQn:[], //所有問卷
            createStep:0,//建立問卷步驟控制
            qnTitle:"", //搜尋條件
            description:'',
            startDate:"", //搜尋條件
            endDate:"", //搜尋條件

            /////新增問卷/////
            popup:0,//彈出視窗控制

            newQnTitle:"",//新問卷Title
            newQnDescription:"",//新問卷描述
            newStartDate:"",//新問卷開始
            newEndDate:"",//新問卷結束
            questionnaire:[],////陣列(newQnTitle + newQnDescription + published + newStartDate + newEndDate )
            question:"",//新問題
            optionType:"",//新問題題型
            necessary:false,//是否必填(預設false)
            questionOption:"",//選項
            questionList:[],//陣列(問題 + 選項)
            published:false,//新問卷是否發布
            quId:0,

            /////編輯、刪除問卷/////
            selectedIndexes:[],
            selectedQuIds : [],
            delQuList : [],
            EditAndSaveBtn:"新增", 
            qnId:0,     
            key:"",     
            /////觀看統計/////
            checkStatic:0,
            userList:[],
            /////分頁/////
            page:1, //分頁條件
            currentPage: 1, 
            perpage: 10,  //一頁的資料數

            /////時間/////
            nowDate: new Date().toISOString().split('T')[0],
        }
    },
    methods:{
         //倒序填寫資料
        uniqueUsers() {
            const uniqueUsers = [];
            const addedQnIds = [];
            this.userList.forEach((user) => {
                if (!addedQnIds.includes(user.name)) {
                uniqueUsers.push(user);
                addedQnIds.push(user.name);
                }
            });
            return uniqueUsers.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
            }, 
        //取得所有user資料
        getSubmission() {
            const url = 'http://localhost:8081/api/quiz/getSubmission';
            const queryParams = new URLSearchParams({
                qnId: this.qnId
            });
            const urlWithParams = `${url}?${queryParams}`;
            fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    "Accept": "application/json", // 指定接受的回應類型
                },
            })
            .then(response => response.json())
            .then(data => {    
                if (data.userList == null) {
                    alert("無填寫資料!!");
                    this.$router.push('Questionnaire')
                    return
                } else {
                    console.log("UserList");
                    this.userList = data.userList;
                    console.log(this.userList);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                // Handle error, show alert, etc.
            });
            },
        //觀看結果
        goResult(index){
            //彈出視窗、顯示統計頁
            this.popup = 1; 
            this.checkStatic = 1;

            var pageIndex = ((this.currentPage-1)*this.perpage+index); 
            this.qnId = this.allQn[pageIndex].questionnaire.id;
            this.qnTitle =  this.allQn[pageIndex].questionnaire.title;
            this.description =  this.allQn[pageIndex].questionnaire.description;
            console.log("qnId : ",this.qnId )
            // this.$router.push({
            //     name:"QuestionnaireStaticPage",
            //     query:{
            //         qnId:this.qnId,
            //         title:this.title,
            //         description: this.description,
            //     }
            // })
            },
        //獲取当前日期
        isPublished() {
            this.nowDate = new Date().toISOString().split('T')[0];   
            },
         //checkboxgeQnId fn
        handleCheckboxChange(questionnaireId) {
            const selectQnIds = this.selectedqnIds.indexOf(questionnaireId);
            if ( selectQnIds !== -1) {
                this.selectedqnIds.splice(selectQnIds, 1);
            } else { 
                this.selectedqnIds.push(questionnaireId);// 如果 ID 不存在于数组中，添加到数组
            }
            console.log('Selected Questionnaire Ids:',this.selectedqnIds); // 输出更新后的数组
            console.log(this.nowDate > 2023-12-3)
            },
        handleCheckboxChangeForStepTwo(index){
            const currentQuId = this.questionList[index].quId;
            if (this.questionList[index].checkbox) {
                // 如果复选框被选中，将 quId 存入数组
                this.selectedQuIds.push(currentQuId);
                this.selectedIndexes.push(index);
            } else {
                // 如果复选框取消选中，从数组中删除 quId
                const indexToDelete = this.selectedQuIds.indexOf(currentQuId);
                if (indexToDelete !== -1) {
                    this.selectedQuIds.splice(indexToDelete, 1);
                }
                // 从数组中删除索引
                this.selectedIndexes = this.selectedIndexes.filter(i => i !== index);
            }
            console.log("QuIds:", this.selectedQuIds);
            },
         //計算索引值
        catchIndex(index){
            var pageIndex = (this.currentPage-1)*10 + index;
            this.selectQnIndexArr.push({qnId:this.allQn[pageIndex].questionnaire.id, currentPage:this.currentPage, index:index}); 
            console.log("selectQnIndexArr:",this.selectQnIndexArr);
            },

        //進行編輯(修改內容)
        editQuestion(index){
            var pageIndex = ((this.currentPage-1)*this.perpage+index); 
            this.qnId = this.allQn[pageIndex].questionnaire.id;
            this.newQnTitle =  this.allQn[pageIndex].questionnaire.title;
            this.newQnDescription =  this.allQn[pageIndex].questionnaire.description;
            this.startDate =  this.allQn[pageIndex].questionnaire.startDate;
            this.endDate = this.allQn[pageIndex].questionnaire.endDate;
            this.published=this.allQn[pageIndex].questionnaire.published;
            console.log("qnId:"+this.qnId)
            this.popup = 1;
            this.next();
            },
        //編輯(資訊傳送至input)
        edit(index){
            //編輯模式下編輯
            if(this.qnId > 0){ 
                this.EditAndSaveBtn = "編輯"
                this.quId = this.questionList[index].quId;
                this.qnId = parseInt(this.questionnaire[0].qnId)
                this.question = this.questionList[index].qTitle;
                this.optionType = this.questionList[index].optionType;
                this.necessary = this.questionList[index].necessary;
                this.questionOption = this.questionList[index].option;
                this.key = index
                }else{
                    //新增模式下編輯
                    this.EditAndSaveBtn = "編輯"
                        this.quId = this.questionList[index].quId;
                        this.question = this.questionList[index].qTitle;
                        this.optionType = this.questionList[index].optionType;
                        this.necessary = this.questionList[index].necessary;
                        this.questionOption = this.questionList[index].option;
                        this.key = index
                }
            },
        //儲存(不發布)
        save(){
            console.log("questionnaire:",this.questionnaire)
            var questionList = this.questionList;
            console.log("qnId:",this.qnId)
            //update not publish
            if( this.qnId > 0){
                var url = "http://localhost:8081/api/quiz/update";
                var Qn = {
                "questionnaire": {
                    "id":parseInt(this.questionnaire[0].qnId),
                    "title": this.questionnaire[0].title,
                    "description":this.questionnaire[0].description,
                    "published":false,
                    "startDate": this.questionnaire[0].startDate,
                    "endDate": this.questionnaire[0].endDate
                },
                "question_list": [],
                "deleteQuestionList":[],

                };
                for (let i = 0; i < questionList.length; i++) {
                    Qn.question_list.push({
                        "quId": questionList[i].quId,
                        "qnId":parseInt(this.questionnaire[0].qnId),
                        "qTitle": questionList[i].qTitle,
                        "optionType": questionList[i].optionType,
                        "isnecessary": questionList[i].necessary,
                        "option": questionList[i].option
                    })
                };

                if(this.delQuList !=""){
                    for(let i = 0; i < this.delQuList.length; i++){
                        Qn.deleteQuestionList.push({
                            "qnId":parseInt(this.qnId),
                            "quId":this.deleQuIds[i],
                        })
                    };
                }
                console.log(Qn)

                fetch(url, {
                method: "POST",
                body: JSON.stringify(Qn),
                headers: new Headers({
                "Content-Type": "application/json",
                }),
                })
                .then((res) => res.json())
                .then((response) => {
                    console.log(response);
                    alert(response.rtncode)
                    this.popup = 0;
                    this.qnId = 0;
                })
                .catch((error) => console.error("Error:", error));
                return;
            };

            //create not publish
            var url = "http://localhost:8081/api/quiz/create";
            
            var Qn = {
            "questionnaire": {
                "title": this.questionnaire[0].title,
                "description":this.questionnaire[0].description,
                "published":false,
                "startDate": this.questionnaire[0].startDate,
                "endDate": this.questionnaire[0].endDate
            },

            "question_list": []
            };   
                
            for (let i = 0; i < this.questionList.length; i++) {
                Qn.question_list.push({
                "quId": questionList[i].quId,
                "qTitle": questionList[i].qTitle,
                "optionType": questionList[i].optionType,
                "necessary": questionList[i].necessary,
                "option": questionList[i].option
                });
            }
            console.log(Qn)
            fetch(url, {
                method: "POST",
                body: JSON.stringify(Qn),
                headers: new Headers({
                "Content-Type": "application/json",
                }),
            })
            .then((res) => res.json())
            .then((response) => {
                console.log(response);
                alert(response.rtncode)
                this.popup = 0;
                this.qnId = 0;
            })
            .catch((error) => console.error("Error:", error));
            },
        //新增或編輯問題
        addOREditQuetion(){
            console.log("qnId :",this.qnId)
            //修改模式
            if(this.qnId > 0  ){
                //編輯
                if( this.EditAndSaveBtn == "編輯"){
                    if(this.question == ""){
                    alert("問題不能為空")
                    return
                    } else if(this.optionType ==""){
                        alert("題行不得為空")
                        return
                    } else if(this.questionOption ==""){
                        alert("選項不得為空")
                        return
                    }
                    console.log("問題索引值:"+this.key)
                    this.questionList[this.key].quId = this.quId
                    this.questionList[this.key].qnId = parseInt(this.questionnaire[0].qnId)
                    this.questionList[this.key].qTitle = this.question;
                    this.questionList[this.key].optionType = this.optionType;
                    this.questionList[this.key].necessary = this.necessary;
                    this.questionList[this.key].option = this.questionOption;
                    this.EditAndSaveBtn = "新增";
                    alert("修改模式編輯成功");
                    console.log("questionList:",this.questionList)
                    return
                }   
                //新增
                if(this.EditAndSaveBtn == "新增"){
                    this.quId = this.questionList.length+1;
                    this.questionList.push({
                        quId:this.quId,
                        qnId:parseInt(this.questionnaire[0].qnId),
                        qTitle:this.question,
                        optionType:this.optionType,
                        necessary:this.necessary,
                        option:this.questionOption,
                    });
                    this.question = "";
                    this.optionType = "";
                    this.necessary = false;
                    this.questionOption = "";
                    alert("修改模式新增成功!!");
                    console.log("updated quList:",this.questionList)
                    return
                }
            }
             //新增模式編輯
            if(this.qnId == 0){
                //編輯
                if( this.EditAndSaveBtn == "編輯"){
                    if(this.question == ""){
                        alert("問題不能為空!!")
                        return
                    } else if(this.optionType ==""){
                        alert("題型不得為空!!")
                        return
                    } else if(this.questionOption ==""){
                        alert("選項不得為空!!")
                        return
                    }
                    // console.log("問卷索引值:"+this.key)
                    this.questionList[this.key].quId = this.quId
                    this.questionList[this.key].qTitle = this.question;
                    this.questionList[this.key].optionType = this.optionType;
                    this.questionList[this.key].necessary = this.necessary;
                    this.questionList[this.key].option = this.questionOption;
                    this.EditAndSaveBtn = "新增";
                    alert("新增模式編輯成功!!");
                    this.question = "";
                    this.optionType = "";
                    this.necessary = false;
                    this.questionOption = "";
                    console.log(this.questionList)
                    return
                }
                //新增
                if(this.EditAndSaveBtn == "新增"){
                    if(this.question == ""){
                        alert("問題不能為空!!")
                        return
                    } else if(this.optionType ==""){
                        alert("題行不得為空!!")
                        return
                    } else if(this.questionOption ==""){
                        alert("選項不得為空!!")
                        return
                    }
                    this.quId = this.questionList.length+1;
                    this.questionList.push({
                        quId:this.quId,
                        qTitle:this.question,
                        optionType:this.optionType,
                        necessary:this.necessary,
                        option:this.questionOption,
                    });
                    this.question = "";
                    this.optionType = "";
                    this.necessary = false;
                    this.questionOption = "";
                    console.log(this.questionList)
                    alert("新增模式新增成功!!");
                }
            }
            },
        //下一步
        next(){
            this.createStep +=1;
            console.log("step:", this.createStep)
            //step 1 當按下next會驗證所以條件為2
            if(this.createStep == 2){
                //新增模式
                if(this.qnId == 0){
                    if(this.newQnTitle ==""){
                        alert("問卷名稱不得為空!!")
                        this.createStep = 1;
                        return
                    } else if (this.newQnDescription =="") {
                        alert("問卷描述不得為空!!")
                        this.createStep = 1;
                        return
                    } else if (this.startDate =="") {
                        alert("起始時間不得為空!!")
                        this.createStep = 1;
                        return
                    }  else if(this.endDate =="")   {
                        alert("結束時間不得為空!!")
                        this.createStep = 1;
                        return
                        }

                    this.questionnaire.push({
                        title: this.newQnTitle,   
                        description: this.newQnDescription,
                        published:this.published,
                        startDate: this.startDate,
                        endDate: this.endDate
                        })
                        console.log("New questionnaire :",this.questionnaire)
                    }
                //編輯模式
                if(this.qnId > 0){        
                    this.questionnaire.push({
                        qnId:this.qnId,
                        title: this.newQnTitle,   
                        description: this.newQnDescription,
                        published:this.published,
                        endDate: this.endDate,
                        startDate: this.startDate,
                    })
                    console.log("Edited questionnaire",this.questionnaire);
                    this.getQuestion();
                    }
                }
            },
        //刪除問卷
        deleQn() {
            let stopDel = false; //終止方法的可愛變數          
            var qnIdList = [] ; // 後端需要的qnidList   
            var qnIdsIndex = [];   //前端要得索引值

            //判斷我要去刪掉陣列問卷的哪幾個
            for (let i = 0; i < this.selectQnIndexArr.length; i++) {
                let indexNum = 0;
                let countpage = this.selectQnIndexArr[i].currentPage
                let qnIndex =  this.selectQnIndexArr[i].index
                // console.log("第"+countpage+"頁");
                // console.log("qnIndex:"+qnIndex);

                
                indexNum = ((countpage-1)*this.perpage) + qnIndex
                qnIdsIndex.push(indexNum)
                qnIdList.push(this.allQn[indexNum].questionnaire.id)
            }
            console.log("被選中之問卷的索引值 :"+ qnIdsIndex);
            console.log("被選中之問卷的ids :"+ qnIdList);

            //判斷這幾個裡面有沒有已經出版在進行中的資料
            for (let i = 0; i < qnIdList.length; i++) {
                const qnStartDate =this.allQn[qnIdsIndex[i]].questionnaire.startDate;
                const qnIsPublished = this.allQn[qnIdsIndex[i]].questionnaire.published;
                const currentDate = new Date(); // 當下時間
                const jsonDateOnlyString = currentDate.toISOString().split('T')[0]; // 當下時間轉json格式並只取日期

                if (qnIsPublished ==true && qnStartDate <= jsonDateOnlyString) {
                    stopDel=true;
                    alert("你刪除的問卷當中有包含已開始的問卷所以禁止刪除");
                    location.reload(true);
                    return ;
                }
            };   
            var data = { 
                qnIdList: qnIdList,
            };
            var url = "http://localhost:8081/api/quiz/deleteQuestionnaire";

            fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            })
            .then((res) => res.json())
            .then((response) => {
                console.log("Success:", response);
                // 在成功完成 API 請求後執行 fetchData()
                this.isdele = false;
                this.fetchData();
            })
            .catch((error) => console.error("Error:", error));
            },
        //刪除問題
        delQu(){
             //新增模式下delQu
            if(this.qnId == 0){
                this.selectedIndexes.forEach(item => {
                    this.delQuList =  this.selectedQuIds
                    this.questionList.splice(item,1);
                });
    
                this.questionList.forEach((item, index) => {
                    item.quId = index + 1;
                });
    
                console.log("Updated QuestionList :", this.questionList)
                console.log("Deleteed QuList :", this.delQuList)
            }
            },
        //新增問卷取消按鈕
        cancel(){
            this.createStep = 0;
            this.popup = 0 ;
            this.newQnTitle ="";   
            this.newQnDescription = "";
            this.published = false;
            this.startDate = "";
            this.endDate = "";
            this.questionnaire = [];
            this.question = "";
            this.optionType = "";
            this.necessary = false;
            this.questionOption = "";
            this.questionList = [];
            this.selectedIndexes = [];
            this.selectedQuIds = [];
            this.delQuList = [];
            this.qnId = 0;//統計
            this.qnTitle =  "";//統計
            this.description =  "";//統計
            this.checkStatic = 0;//統計
            },
        //新增問卷
        create(){
            this.popup = 1 ;
            this.createStep = 1;
            console.log("step:", this.createStep)
            },
        //關閉視窗
        closedele(){
            this.isdele = false
            this.controshowdel = true;
            },
        //顯示刪除問卷checkbox
        showdele(){
            this.isdele = true
            this.controshowdel = false;
            },
        //前台
        GoForestage (){
            this.$router.push('/')
            },
        //清除搜尋條件
        clear(){
            this.qnTitle = "";
            this.startDate = "";
            this.endDate = "";
            },
        //搜尋
        getQuestionnaireList() {
            //將要查詢的字串附加到url
            const url = 'http://localhost:8081/api/quiz/search';
            //帶入值
            const queryParams = new URLSearchParams({
                title: this.qnTitle,
                start_date:this.startDate,
                end_date:this.endDate,
            });
            const urlWithParams = `${url}?${queryParams}`;

            fetch(urlWithParams,{
                method:"GET",
                headers:new Headers({
                    "Content-Type":"application/json",
                    "Access-Control-Allow-Origin":"*"

                })
                })
                .then((res) =>res.json())
                .catch((error) =>console.error("Error:",error))
                .then((data)=>{
                    this.allQn = data.quizVoList.slice().reverse();
                    console.log( "allQn:",this.allQn)
                })
            },
        //分頁方法
        setPage(page) {
        if(page <= 0 || page > this.totalPage) {
            return
        }
        this.currentPage = page
            },
        },
    mounted() {
        this.getQuestionnaireList();
        this.isPublished();
        },
    computed:{

         //分頁
        totalPage() { 
            //Math.ceil()取最小整數
            return Math.ceil(this.allQn.length / this.perpage)
        },

        //分頁
        pageStart() {   
            //取得該頁第一個值的index
            return (this.currentPage - 1) * this.perpage
        },

        //分頁
        pageEnd() {     
            //取得該頁最後一個值的index
            return this.currentPage * this.perpage
        }
        
        },

}
</script>
<template>
    <div class="Home">
        <div class="Header">
            <div class="User">
                <label for="">User : &nbsp xxx</label>
                <button>登入</button>
                <button @click="GoForestage ">前台</button>
            </div>
        </div>
        <!-- 搜尋 -->
        <div class="Search">
            <div class="Input">
                <div class="box">
                    <label>搜尋問卷 :&nbsp</label>
                    <input type="text" v-model="qnTitle">
                </div>
                <div class="box">
                    <label for="">開始時間 :&nbsp</label>
                    <input type="date" v-model="startDate">
                </div>
                <div class="box">
                    <label for="">結束時間 :&nbsp</label>
                    <input type="date" v-model="endDate">
                </div>
            </div>
            <div class="Button">
                <button id="SearchBtn" @click="getQuestionnaireList">搜尋</button>
                <button id="ClearBtn" @click="clear">清除</button>
                <button id="CreateBtn" @click="create">新增問卷</button>
                <button id="DeleteBtn" >刪除問卷</button>
            </div>
        </div>
        <!-- 問卷清單 -->
        <div class="Form">
            <table>
                <tr>
                    <th>編號</th>
                    <th>問卷</th>
                    <th>狀態</th>
                    <th>開始時間</th>
                    <th>結束時間</th>
                    <th>統計</th>
                </tr>
                <tr  v-for="(quiz,index) in allQn.slice(pageStart,pageEnd)" :key="index">
                    <!-- <td class="checkboxTd" v-show="isdele">
                        <input type="checkbox" v-model="quiz.checkbox" @change="handleCheckboxChange(quiz.questionnaire.id)" @click="catchIndex(index)" >
                    </td> -->
                    <td>{{ quiz.questionnaire.id }}</td>
                    <!--編輯判斷 -->
                    <td v-if="quiz.questionnaire.published == false || quiz.questionnaire.published == true && nowDate <= quiz.questionnaire.startDate" @click='editQuestion(index)' :key="index" style="cursor: pointer;">{{ quiz.questionnaire.title }} </td>
                    <td v-else-if="quiz.questionnaire.published==true"  style="cursor: not-allowed;">{{ quiz.questionnaire.title }} </td>
                    <td v-if=" quiz.questionnaire.published == true && nowDate < quiz.questionnaire.startDate || quiz.questionnaire.published == false && nowDate < quiz.questionnaire.startDate">尚未開始</td>
                    <td v-if="quiz.questionnaire.endDate < nowDate ">已結束</td>
                    <td v-else-if="quiz.questionnaire.startDate <= nowDate && nowDate <= quiz.questionnaire.endDate ">進行中</td>
                    <td>{{ quiz.questionnaire.startDate }}</td>
                    <td>{{ quiz.questionnaire.endDate }}</td>
                    <!-- 進行中、已結束可以觀看結果 -->
                    <td style="cursor: pointer;" @click="goResult(index)" :key="index" v-if="quiz.questionnaire.startDate <= nowDate && nowDate <= quiz.questionnaire.endDate || this.nowDate > quiz.questionnaire.endDate">前往</td>
                    <td v-else  style="cursor: not-allowed;">尚未開始</td>
                </tr>
            </table>
        </div>

        <!-- 新增物件 -->
        <div class="popup"  v-if ="popup == 1">
            <div class="popup-content">
                <div class="popup-header">
                    <h5 v-if="this.createStep > 0">建立問卷(步驟{{this.createStep}})</h5>
                    <i class="fa-solid fa-circle-xmark" @click="cancel()"></i>
                    <h5 v-if="this.checkStatic > 0">這是統計頁</h5>
                    <!-- <h2>{{ title }}</h2> -->
                </div>

                <div class="popup-body">
                    <!-- 弹出窗口的内容放在这里 -->
                    <div class="Build-Qn" >
                        <div class="BuildQn-step-one"  v-if="this.createStep == 1">
                            <div class="qnTile Box">
                                <h2>問卷名稱 &nbsp;</h2>
                                <input type="text" class="qnTileInputBox" v-model="newQnTitle">
                            </div>
                            <div class="qnDesp Box">
                                <h2>問卷說明 &nbsp;</h2>
                                <input type="text" class="qnDesInputBox" v-model="newQnDescription">
                            </div>
                            <div class="date Box" >
                                <h2>開始日期 &nbsp;</h2>
                                <input type="date" id="startDate" v-model="startDate">
                            </div> 
                            <div class="date Box">
                                <h2>結束日期  &nbsp;</h2>
                                <input type="date" id="endDate"  v-model="endDate">
                            </div> 
                            
                        </div>
                        <div class="BuildQn-step-two" v-if="this.createStep == 2">
                            <div class="Box">
                                <label>題目 &nbsp;</label>
                                <input type="text" v-model="question">
                            </div>
                            <div  class="Box">
                                <label>選項 &nbsp;</label>
                                <input type="text" placeholder="選項請以 ; (分號)做分隔" v-model="questionOption">
                            </div>
                            <div  class="Box">
                                <label>題型 &nbsp;</label>
                                <select v-model="optionType">
                                    <option value="單選題">單選題</option>
                                    <option value="多選題">多選題</option>
                                    <option value="短述題">短述題</option>
                                </select>
                            </div>
                            <div class="EditSaveArea">
                                <label>必填 &nbsp;</label>
                                <input type="checkbox" class="StepTwoCheckbox" v-model="necessary">
                                <div id="cancelAndSaveBtn">
                                    <button v-if="this.EditAndSaveBtn =='編輯'">取消</button>
                                    <button title="刪除以勾選問題" @click="delQu()">刪除</button>
                                    <button @click="addOREditQuetion">{{this.EditAndSaveBtn}}</button>
                                </div>
                            </div>
                            <table>
                                <tr>
                                    <td class="line1">#</td>
                                    <td class="line2">編號</td>
                                    <td class="line3">題目</td>
                                    <td class="line4">問題種類</td>
                                    <td class="line5">必填</td>
                                    <td class="line6">編輯</td>
                                </tr>
                                <tr v-for="(item,index) in questionList" :key="index">
                                    <th  class="line1">
                                        <input type="checkbox" v-model="item.checkbox" :key="index" @change="handleCheckboxChangeForStepTwo(index)">
                                    </th>
                                    <th class="line2">
                                    {{ index +1}}
                                    </th>
                                    <th class="line3">{{ item.qTitle }}</th>
                                    <th class="line4">{{ item.optionType }}</th>
                                    <th class="line5">
                                        <i class="fa-solid fa-check" v-if="item.necessary == true"></i>
                                    </th>
                                    <th class="line6">
                                        <button  @click="edit(index)" :key="index">編輯</button>
                                    </th>
                                </tr>
                            </table>
                        </div>
                        <div class="BuildQn-step-three" v-if="this.createStep == 3">
                            <div class="Question-head">
                                <div>
                                    <label for="">問卷名稱 : &nbsp;</label>
                                    <label for="">{{ this.newQnTitle }}</label>
                                </div>
                                <div>
                                    <label for="">問卷描述 : &nbsp;</label>
                                    <label for="">{{ this.newQnDescription }}</label>
                                </div>
                                <div>
                                    <label for="">開始日期 : &nbsp;</label>
                                    <label for="">{{ this.startDate }}</label>                             
                                </div>
                                <div>
                                    <label for="">結束日期 : &nbsp;</label>
                                    <label for="">{{ this.endDate }}</label>
                                    
                                </div>
                            </div>
                            <div v-for="question in questionList" class="Question">
                                <div class="Question-Title">
                                    <p>{{ question.quId }}.&nbsp;</p>
                                    <p> {{ question.qTitle }}</p>
                                    <p>({{ question.optionType }})</p>
                                </div>
                                <div class="Question-Option">
                                    <div class="option" v-for="item in question.option.split(';')" v-if="question.optionType =='單選題'">
                                        &nbsp;<input type="radio" valuev = "answer">
                                        <label>&nbsp;{{ item }}</label>           
                                    </div> 
                                    <div  class="option" v-for="item in question.option.split(';')" v-else-if="question.optionType =='多選題'">
                                            <input type="checkbox" value="answer">
                                            <label> &nbsp;{{ item }}</label>           
                                    </div> 
                                    <div v-else-if="question.optionType =='短述題'">
                                        <input type="text">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="Static" v-if="this.checkStatic == 1">
                                <table>
                                    <tr>
                                        <th>編號</th>
                                        <th>姓名</th>
                                        <th>填寫時間</th>
                                        <th>觀看回覆</th>
                                    </tr>
                                    <tr v-for="user,index in uniqueUsers" :key="user.qnId">
                                        <td>{{index + 1}}</td>
                                        <td>{{ user.name }}</td>
                                        <td>{{ formatDate(user.dateTime) }}</td>
                                        <td @click="gofeedback(user.qnId,user.name,user.phoneNumber,user.email,user.age)">前往</td>
                                    </tr>
                                </table>
                            <!-- ==========================================================================分頁 -->
                                <ul class="pagination">
                                        <li class="page-item" @click.prevent="setPage(currentPage-1)">
                                            <a class="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                            </a>
                                        </li>
                                        <li class="page-item" :class="{'active': (currentPage === (n))}"
                                            v-for="(n, index) in totalPage" :key="index" @click.prevent="setPage(n)">
                                            <a class="page-link" href="#">{{ n }}</a>
                                        </li>
                                        <li class="page-item" @click.prevent="setPage(currentPage+1)">
                                            <a class="page-link" href="#" aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                            </a>
                                        </li>
                                </ul>
                            <!-- ==========================================================================分頁 -->
                        </div>
                    </div>
                </div>
                <div class="popup-bottom"  v-if="this.checkStatic == 0">
                    <button type="button" @click="cancel()">取消</button>
                        <button type="button" @click="this.createStep -=1" v-if="this.createStep > 1">上一步</button>
                        <button type="button" class="flicker" v-if="this.createStep !=3" @click="next">下一步</button>
                        <button v-if="this.createStep ==3" @click="save">儲存</button>
                        <button v-if="this.createStep ==3" @click="saveAndpub">儲存並發布</button>
                </div>
                <div class="popup-bottom" v-if="this.checkStatic == 1">
                    <button type="button" @click="cancel()">取消</button>
                </div>
            </div>
        </div>
        <div>
            <!-- 分頁 -->
            <ul class="pagination" v-if="this.popup == 0">
                <li class="page-item" @click.prevent="setPage(currentPage-1)">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" :class="{'active': (currentPage === (n))}"
                    v-for="(n, index) in totalPage" :key="index" @click.prevent="setPage(n)">
                    <a class="page-link" href="#">{{ n }}</a>
                </li>
                <li class="page-item" @click.prevent="setPage(currentPage+1)">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <!--/////CDN/////-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</template>
<style lang="scss" scoped>
.Home{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-weight: bold;

    .Header{
        height: 10%;
        width: 100%;
        position: relative;
        margin-bottom: 2%;
        
        .User{
            background: var(--primary-color);
            padding: 0.5%;
            border-radius: 10px;
            width: 20%;
            position: absolute;
            right: 5%;

            label{
                margin-left: 10%;font-weight: bold;
            }

            button{
                border-radius: 10px;
                margin-left: 10%;font-weight: bold;
                }
                
            button:hover{
                background: var(--third-hover-color);
                transition: var(--tran-03);
                font-weight: bold;
                }

            }
        }

    .Search{
        display: flex;
        width: 90%;
        height: 20%;
        overflow: hidden; 
        .Input{
            width: 50%;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            background: var(--third-color);
            padding: 2%;
            border-radius: 10px;

            label{
                font-weight: bold;
                }

            input{
                border-radius: 10px;
                width: 70%;
                padding: 0 3%;
                }
            
            .box{
                display: flex;
                justify-content: center;
            } 
            
            }
        .Button{
            width: 60%;
    
            button{
                width: 23%;
                height: 100%;
                margin: 0 1%;
                font-weight: bold;
                font-size: 16pt;
                border: none;
                border-radius: 10px;
                }
            }
            button:hover{
                background:var(--primary-color);
                color: var(--text-color);
                transition: var(--tran-05);
                }
        }

    .Form{
        width: 100%;
        height: 50vh; 
        margin-top: 2%;

        table{
            width: 90%;
            // height: 100%;
            margin: 0 5%;
            padding: 2%;
            border: 1px black solid;
        
            background: var(--third-color);

            tr {
                /* 添加样式以避免充满整个表格 */
                display: table-row;
                border: 1px black solid;
            }

            tr:hover{
                background: var( --third-hover-color);
                transition: var(--tran-03);
            }


            th{
                text-align: center;
                height: 20px;
                border: 1px black solid;
                }
            td{
                height: 30px;
                text-align: center;
                border: 1px black solid;
                }
            }
        }

    .pagination{
        margin-top: 2%;
        }
    
    .popup{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .Box{
            display: flex;
            margin: 5px 0;
            }
        .popup-content{
            box-shadow: 0 2px 4px rgba(0, 0, 0, 10);
            border-radius: 10px;

            .popup-header{
                background: var(--primary-color);
                display: flex;
                padding: 10px;
                border-radius: 10px 10px 0 0;
                position: relative;
                i{
                    position: absolute;
                    right: 10px;
                    margin-left: 76%;
                    margin-top: 10px;
                    color: var(--text-color);
                    cursor: pointer;
                }
                h5{
                    margin: 0;
                    color: var(--text-color);
                    font-weight: bold;
                    }
                label{
                    color: black;
                    font-weight: bold;
                    }
                }   

            .popup-body{
                position: relative;
                background: var(--sidebar-color);
                .Static{
                    height: 70vh;
                    width: 70vw;
                    display: flex;
                    justify-content: center;
                    align-items: baseline;
                    background: red;
                    margin: 0;
                    padding: 2% 2% 0% 2%; //上、右、下、左
                    position: relative;
                    
                    table{
                        width: 100%;
                        padding: 1%;
                        border: 1px black solid;
                        th{
                            text-align: center;
                            border: 1px black solid;
                        }
                    }
                    .pagination{
                        position: absolute;
                        bottom: -3%;
                    }
                }

                .BuildQn-step-three{
                    height: 50vh;
                    width: 50vw;
                    padding:  2% 10%;
                    overflow-y: auto;
                    .Question-head{
                        border: 1px black solid;
                        border-radius: 10px;
                        padding: 2%;
                        margin-bottom: 2%;
                        }
                    .Question-Title{
                        display: flex;
                        p{
                            margin: 0;
                            }
                        }
                    .Question{
                        margin: 3% 0;
                        .Question-Option{
                            border: 1px black solid;
                            border-radius: 10px;
                            padding: 2%;
                            margin-bottom: 2%;
                            .option{
                                display: flex;
                                label{
                                    text-align: center;
                                    }
                                }
                            }
                        }
                    }

                .BuildQn-step-two{
                    height: 50vh;
                    width: 80vw;
                    padding: 0 4%;
                    overflow-y: auto;
                    label{
                        font-size: 16pt;
                        font-weight: bold;
                        }

                    input{
                        width: 91%;
                        height: 100%;
                        border-radius: 10px;
                        padding:  1%;
                        }

                    select{
                        border-radius: 10px;
                        padding: 0.5%;
                        font-weight: bold;
                        }
                    
                    table{
                        width: 100%;
                        max-height: 25vh;
                        overflow-y: auto;
                        tr{
                            height: 1%;
                        
                        }

                        td{
                            border: 1px black solid;
                            text-align: center;
                            }

                        th{
                            height: 35px;
                            font-size: 12pt;
                            align-items: center;
                            text-align: center;
                            border: 1px black solid;
                            }

                        input{
                            height: 70%;
                            }

                        .line1{
                            width: 10%;
                            input{
                                margin-top: 6px;
                                }
                            }
                        .line2{
                            width: 10%;
                            }
                        .line3{
                            width: 40%;
                            }
                        .line4{
                            width: 15%;
                            }
                        .line5{
                            width: 10%;
                            }
                        .line6{
                            width: 15%;
                            align-items: center;
                            }

                        button{
                            height: 80%;
                            font-size: 12pt;
                            font-weight: bold;
                            }
                        }
                    
                    .EditSaveArea{
                        display: flex;
                        align-items: center;
                        margin-bottom: 1%;
                        position: relative; 
                        .StepTwoCheckbox{
                            width: 3%;
                            margin-left: 2%;
                            height: 25px;
                            justify-content: center;
                            }
                        #cancelAndSaveBtn{
                            display: flex;
                            position: absolute;
                            right: 0;
                            }
                        button{
                            background: var(--third-color);
                            border:none;
                            padding: 10px;
                            border-radius: 10px;
                            font-weight: bold;
                            margin:  0 5px;
                        }
                        button:hover{
                            border: 1px var(--primary-color) solid;
                            transition: var(--tran-03);
                        }
                        }
                    .Box{
                        input{
                            width: 92%;
                            }

                        label{
                            width: 8%;
                            }
                        }
                    }
                .BuildQn-step-one{
                    width: 60vw;
                    padding: 0 4%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    h2{
                        text-align: center;
                        font-weight: bold;
                        }

                    input{
                        width: 70%;
                        border-radius: 10px;
                        padding: 0 10px;
                        }

                    
                    }
                }

            .popup-bottom{
                width: 100%;
                display: flex;
                justify-content: center;
                padding: 1%;
                border-radius: 0 0 10px 10px;
                button{
                    padding: 10px;
                    font-weight: bold;
                    background: none;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    
                    }
                button:hover{
                    background:var(--primary-color);
                    color: var(--text-color);
                    transition: var(--tran-05);
                    }
                }
            }
        }
    }
            
</style>
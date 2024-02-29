<script>
import { mapState, mapActions } from 'pinia';
import indexState from '../stores/indexState';

export default{
    data(){
        return{
            allQn:[],//所有問卷
            qnTitle:"",
            startDate:"",
            endDate:"",
            page:1,//分頁
            currentPage: 1, //分頁
            perpage: 10,//一頁的資料數
            nowDate: new Date().toISOString().split('T')[0],
            popup:0,//彈出視窗
            name:"",//問卷
            phone:"",//問卷
            email:"",//問卷
            age:"",//問卷
            questionList:[],
            userList:[],//確認重複提交使用

            }
        },

    methods:{
        //提交答案
        getAnswer() {
            //查看是否重複提交
            this.getSubmission();
            for(let i=0; i < this.userList.length; i++){
                if(this.name == this.userList[i].name && this.phone == this.userList[i].phoneNumber){
                    alert("不得重複提交")
                    return 
                }
            }

            if(this.name == undefined){
                alert("姓名不得為空")
                return
            }else if(this.phone == undefined){
                alert("電話不得為空")
                return
            }else if(this.email == undefined){
                alert("email不得為空")
                return
            }else if(this.age == undefined){
                alert('年齡不得為空')
                return
            }
            const answers = this.quList.map(question => {
                let answer = null;

                if (question.optionType === '單選題') {
                    answer = question.selectedOption || null;
                } else if (question.optionType === '多選題') {
                    const selectedOptions = question.option.split(';').filter(option => {
                        return this.selectedOptions.includes(option);
                    });
                    answer = selectedOptions.length > 0 ? selectedOptions.join(';') : null;
                } else if (question.optionType === '短述題') {
                    answer = question.shortAnswer || null;
                }
                return {
                    quId: question.quId,
                    qnId: this.questionnaireId,
                    question:question.qTitle,
                    optionType: question.optionType,
                    answer: answer,
                }; 
            })

            console.log(answers)
            for(let i = 0; i < answers.length; i++){
                if(answers[i].answer == null){
                    alert("尚有問題未作答!!")
                    return
                }
            }

            // this.$router.push({
            // name: 'QuestionnaireFrontMakeSurePage',
            // query: {
            //     name: this.name,
            //     phone: this.phone,
            //     email: this.email,
            //     age: this.age,
            //     qnId: this.questionnaireId,
            //     title: this.title,
            //     description: this.description,
            //     answers: JSON.stringify(answers)
            // }
            // })
            },
         //userList
        getSubmission() {
                const url = 'http://localhost:8081/api/quiz/getSubmission';
                const queryParams = new URLSearchParams({
                    qnId: this.questionnaireId
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
                        // this.$router.push('Questionnaire')
                        return
                    } else {
                        console.log("UserList");
                        this.userList = data.userList;
                        // console.log(this.userList)
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    // Handle error, show alert, etc.
                });
        },
        //填寫問卷
        fillInQuestionnaire(index){ 
            const pagination = this.$refs.pagination
            pagination.style.display = 'none';
            this.popup = 1;
            var pageIndex = ((this.currentPage-1)*this.perpage+index); 
            this.qnId = this.allQn[pageIndex].id;
            this.qnTitle =  this.allQn[pageIndex].title;
            this.qnDescription =  this.allQn[pageIndex].description;
            this.getQuestion(); // 內頁資料更新
            },
          //api獲取quList
        getQuestion() {
            const url = 'http://localhost:8081/api/quiz/searchQuestionList';
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
                // 將 data 添加到 quList
                this.questionList = data.questionList;
                console.log("questionList")
                console.log(this.questionList);
            })
            .catch(error => console.error('Error:', error));
        },
         //分頁
        setPage(page) {
            if(page <= 0 || page > this.totalPage) {
                return
            }
                this.currentPage = page
            },
        //取消按鈕
        cancel(){
            const pagination = this.$refs.pagination
            pagination.style.display = 'flex';
            this.popup = 0 ;
            this.startDate = "";
            this.endDate = "";
            this.selectedIndexes = [];
            this.selectedQuIds = [];
            this.qnId = 0;
            this.qnTitle =  "";
            },
        //清除搜尋條件
        Clear(){
            this.qnTitle = "";
            this.startDate = "";
            this.endDate = "";
            },
        //搜尋
        GetQuestionnaireList() {
            //將要查詢的字串附加到url
            const url = 'http://localhost:8081/api/quiz/searchPublished';
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
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"*"

                })
                })
                .then((res) =>res.json())
                .catch((error) =>console.error("Error:",error))
                .then((data)=>{
                    this.allQn = data.questionnaireList.slice().reverse();
                    console.log("QuestionnaireList", this.allQn)
                })
            },
        //後台
        GoBackstage(){
            this.$router.push('/BackView');
            },
        },

    mounted() {
        this.GetQuestionnaireList(); // 将方法调用放在函数体内
        },
    computed:{
        ...mapState(indexState,["toDayDate","endDayDate"]),

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
                <button @click="GoBackstage">後台</button>
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
                <button id="SearchBtn" @click="GetQuestionnaireList">搜尋</button>
                <button id="ClearBtn" @click="Clear">清除</button>
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
                <tr v-for="(quiz,index) in allQn.slice(pageStart,pageEnd)" :key="index">
                    <td >{{ quiz.id }}</td>
                    <!-- 進行中 -->
                    <td style="cursor: pointer" @click='fillInQuestionnaire(index)' :key="index" v-if=" quiz.startDate <= this.nowDate && this.nowDate <= quiz.endDate"> 
                        {{ quiz.title }}
                    </td>
                    <!-- 已結束、尚未開始 -->
                    <td style="cursor: not-allowed;" v-else> 
                        {{ quiz.title }}
                    </td>
                    <td v-if="quiz.published ==true && quiz.startDate < this.nowDate && this.nowDate <= quiz.endDate">進行中</td>
                    <td v-else-if="quiz.published ==true && quiz.startDate > this.nowDate">尚未開始</td>
                    <td v-else>已結束</td>
                    <td>{{ quiz.startDate }}</td>
                    <td>{{ quiz.endDate }}</td>
                    <td @click="goStatistics(index)" :key="index" style="cursor: pointer;" v-if=" quiz.startDate < this.nowDate && this.nowDate < quiz.endDate || this.nowDate >= quiz.endDate">前往</td>
                    <td v-else  style="cursor: not-allowed;">尚未開始</td>
                </tr>
            </table>
        </div>
        <div class="popup"  v-if ="popup == 1">
            <div class="popup-content">
                <div class="popup-header">
                    <i class="fa-solid fa-circle-xmark" @click="cancel()"></i>
                    <h5>{{ this.qnTitle }}</h5>
                </div>

                <div class="popup-body">
                    <!-- 弹出窗口的内容放在这里 -->
                    <div class="InsidePage">
                        <div class="main">
                            <div class="info">
                                <h1 class="flicker">{{ this.qnTitle }}</h1>
                                <h5 class="textArea">{{ this.qnDescription }}</h5>
                                <div>
                                    <label>姓名 : &nbsp</label>
                                    <input type="text" v-model="name">
                                </div>
                                <div>
                                    <label>年齡 : &nbsp</label>
                                    <input type="number" v-model="age">
                                    <!-- readonly="readonly" -->
                                </div>
                                <div>
                                    <label>信箱 : &nbsp</label>
                                    <input type="text" v-model="email">
                                </div>
                                <div>
                                    <label>電話 : &nbsp</label>
                                    <input type="text" v-model="phone">
                                </div>
                            </div>
                            <div v-for="question in questionList" :key="question.quId">
                                <label>&nbsp{{ question.quId }}. </label>
                                <label>&nbsp{{ question.qTitle }}</label>
                                <label>({{ question.optionType }})</label>
                                <div v-for="(option, index) in question.option.split(';')" :key="index">
                                    <div v-if="question.optionType == '單選題'">
                                        &nbsp&nbsp
                                        <input type="radio" :value="option" :name="question.quId" v-model="question.selectedOption" />
                                        <label id="option">{{ option }}</label>
                                    </div>
                                    <div v-if="question.optionType == '多選題'" >
                                        &nbsp&nbsp
                                        <input type="checkbox" :value="option"  v-model="selectedOptions"/>
                                        <label id="option">{{ option }}</label>
                                    </div>
                                    <div v-if="question.optionType == '短述題'">
                                        &nbsp&nbsp
                                        <input type="text" v-model="question.shortAnswer" id="shortAns" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="popup-bottom" >
                    <button type="button" @click="cancel()">取消</button>
                    <button @click="getAnswer">送出</button>
                </div>
            </div>
        </div>
        <!-- 分頁 -->
        <ul class="pagination" ref="pagination">
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
        width: 60%;
        height: 20%;
        overflow: hidden;
        .Input{
            width: 50%;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            border-radius: 10px;
            background: var(--third-color); 
            padding: 2%;

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
            width: 50%;
    
            button{
                width: 48%;
                height: 100%;
                margin: 0 1%;
                border-radius: 10px;
                font-weight: bold;
                font-size: 16pt;
                border: none;
                }
            }

        #SearchBtn{
            background:var(--primary-color);
            color: var(--text-color);
            }
    
        #SearchBtn:hover{
            background:var(--primary-hover-color);
            transition: var(--tran-03);
            }
        #ClearBtn:hover{
            border: 1px var(--primary-color) solid;
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
                .InsidePage{
                    height: auto;
                    max-height: 80vh;
                    width: 40vw;
                    padding-top: 2%;
                    overflow-y: auto;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    .main{
                        width: 80%;
                        label{
                            font-size: 14pt;
                            }
                        .info{
                            margin-bottom: 5%;
                            h1{
                                text-align: center;
                            }
                            h5{
                                text-align: center;
                            }
                            input{
                                width: 80%;
                                margin: 1% 0;
                                border-radius: 10px;
                            }
                            }
                    }
                    }
                }
            .popup-bottom{
                width: 100%;
                display: flex;
                justify-content: center;
                padding-bottom: 1%;
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
            .pagination{
                margin-top: 2%;
                }  
            /* Chrome, Safari, Edge, Opera */
            input[type=number]::-webkit-outer-spin-button,
            input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
            }


            /* Firefox */
            input[type=number] {
            -moz-appearance: textfield;
            }
        }
        }


}
</style>
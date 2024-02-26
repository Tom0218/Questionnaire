<script>
export default{
    data(){
        return{
            allQn:[], //所有問卷
            questionnaireList:[],
            createStep:0,//建立問卷步驟控制
            qnTitle:"", //搜尋條件
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
            questionList:"",//陣列(問題 + 選項)
            published:false,//新問卷是否發布

            /////編輯、d刪除問卷/////
            selectedIndexes:[],
            selectedQuIds : [],
            delQuList : [],
            
            /////分頁/////
            page:1, //分頁條件
            currentPage: 1, 
            perpage: 10,  //一頁的資料數

            /////時間/////
            nowDate: new Date().toISOString().split('T')[0],
        }
    },
    methods:{

        //deleteQuestionnaire
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
                    this.questionnaireList = data.questionnaireList.slice().reverse();
                    console.log("QuestionnaireList", this.questionnaireList)
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
    },
    computed:{

         //分頁
        totalPage() { 
            //Math.ceil()取最小整數
            return Math.ceil(this.questionnaireList.length / this.perpage)
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
                <tr  v-for="(quiz,index) in questionnaireList.slice(pageStart,pageEnd)" :key="index">
                    <!-- <td class="checkboxTd" v-show="isdele">
                        <input type="checkbox" v-model="quiz.checkbox" @change="handleCheckboxChange(quiz.questionnaire.id)" @click="catchIndex(index)" >
                    </td> -->
                    <td>{{ quiz.id }}</td>
                    <!--編輯判斷 -->
                    <td v-if="quiz.published == false ||quiz.published == true && nowDate <= quiz.startDate" @click='editQuestion(index)' :key="index" style="cursor: pointer;">{{ quiz.title }} </td>
                    <td v-else-if="quiz.published==true"  style="cursor: not-allowed;">{{ quiz.title }} </td>
                    <td v-if=" quiz.published == true && nowDate < quiz.startDate || quiz.published == false && nowDate < quiz.startDate">尚未開始</td>
                    <td v-if="quiz.endDate < nowDate ">已結束</td>
                    <td v-else-if="quiz.startDate <= nowDate && nowDate <= quiz.endDate ">進行中</td>
                    <td>{{ quiz.startDate }}</td>
                    <td>{{ quiz.endDate }}</td>
                    <!-- 進行中、已結束可以觀看結果 -->
                    <td style="cursor: pointer;" @click="goResult(index)" :key="index" v-if="quiz.startDate <= nowDate && nowDate <= quiz.endDate || this.nowDate > quiz.endDate">前往</td>
                    <td v-else  style="cursor: not-allowed;">尚未開始</td>
                </tr>
            </table>
        </div>

        <!-- 新增物件 -->
        <div class="popup"  v-if ="popup == 1">
            <div class="popup-content">
                <div class="popup-header">
                    <h3>建立問卷(步驟{{this.createStep}})</h3>
                    <i class="fa-solid fa-circle-xmark" @click="cancel()"></i>
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
                                    <label for="">{{ this.NewQuestionnareName }}</label>
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
                    </div>
                </div>
                <div class="popup-bottom">
                    <button type="button" @click="cancel()">取消</button>
                    <button type="button" @click="this.createStep -=1" v-if="this.createStep > 1">上一步</button>
                    <button type="button" class="flicker" v-if="this.createStep !=3" @click="next">下一步</button>
                    <button v-if="this.createStep ==3" @click="save">儲存</button>
                    <button v-if="this.createStep ==3" @click="saveAndpub">儲存並發布</button>
                </div>
            </div>
        </div>

        <!-- 分頁 -->
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
    </div>
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
                border-radius: 10px;
                font-weight: bold;
                font-size: 16pt;
                border: none;
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
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        .Box{
            display: flex;
            margin: 5px 0;
            }
        .popup-content{
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

            .popup-header{
                background: #fff;
                display: flex;
                padding: 10px;
                position: relative;
                i{
                    position: absolute;
                    right: 10px;
                    cursor: pointer;
                    margin-left: 76%;
                    margin-top: 10px;
                }
                h3{
                    margin: 0;
                    }
                label{
                    color: black;
                    font-weight: bold;
                    }
                }   

            .popup-body{
                padding: 3% 0;
                position: relative;
                background-color: rgb(0, 96, 34);
                .closeWindows{
                    font-size: 26pt;
                    position: absolute;
                    right: 0;
                    color: #4b85a0;
                    }

                .BuildQn-step-three{
                    height: 50vh;
                    width: 50vw;
                    padding:  2%;
                    overflow-y: auto;
                    .Question-head{
                        border: 1px white solid;
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
                    .Question-Option{
                        border: 1px white solid;
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

                .BuildQn-step-two{
                    width: 80vw;
                    height: 25vw;
                    padding: 0 4%;
                    label{
                        color: white;
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
                        }
                    
                    table{
                        width: 100%;
                        height: 25vh;
                        border: 1px white solid;
                        background-color: rgb(0, 96, 34);
                        overflow-y: auto;

                        td{
                            border: 1px white solid;
                            }

                        th{
                            height: 35px;
                            font-size: 12pt;
                            align-items: center;
                            }
                        input{
                        height: 70%;
                        }

                        .line1{
                            width: 10%;
                            align-items: center;
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
                            }
                        }
                    
                    .EditSaveArea{
                        display: flex;
                        align-items: center;
                        margin-bottom: 1%;
                        position: relative; 
                        .StepTwoCheckbox{
                            width: 3%;
                            margin-left: 3%;
                            height: 25px;
                            justify-content: center;
                            }
                        #cancelAndSaveBtn{
                            display: flex;
                            position: absolute;
                            right: 0;
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
                        }

                    input{
                        width: 70%;
                        border-radius: 10px;
                        padding: 0 10px;
                        }

                    
                    }
                }

            .popup-bottom{
                background: rgb(0, 96, 34);
                padding: 20px 0;   
                width: 100%;
                display: flex;
                justify-content: center;
                button{
                    color: white;
                    margin: 0 10px;
                    border: 1px white solid;
                    padding: 10px;
                    font-size: 16pt;
                    font-weight: bold;
                    background: none;
                    border: none;
                    cursor: pointer;
                    }
                }
            }
        }
    }
            
</style>
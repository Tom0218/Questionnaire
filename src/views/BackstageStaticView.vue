<script>
export default{
    data(){
        return{
            qnId:0,
            title:"",
            description:"",
            userList:[],
            datas:this.uniqueUsers,//要呈現的資料
            perpage: 10, //一頁的資料數
            currentPage: 1,
            page :1,
        }
    },
    methods:{
        //圖表頁
        goChart(){
            this.page =2;
            },
        //統計頁
        goStaticPage(){
            this.page =1;
            },
         //前往單一問卷回饋(id,name,phone,email,age)
        gofeedback(x,y,z,a,b){
            this.$router.push({
                name:'QuestionnaireStaticFeedbackPage',
                query:{
                    qnId:x,
                    userName:y,
                    phone:z,
                    email:a,
                    age:b,
                    title:this.title,
                    description:this.description,
                    userList : JSON.stringify(this.userList)
                }
            })
            },
        //分頁
        setPage(page) {
            if(page <= 0 || page > this.totalPage) {
                return
            }
                this.currentPage = page
            },
        //轉換填寫時間單位
        formatDate(dateTime) {
            const formattedDate = new Date(dateTime).toLocaleString('zh-TW', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            });
                return formattedDate;
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
            }
        },
    computed: {
        //分頁
        //Math.ceil()取最小整數
        totalPage() {
                return Math.ceil(this.uniqueUsers.length / this.perpage)
            },
        //取得該頁第一個值的index
        pageStart() {
            return (this.currentPage - 1) * this.perpage      
            },
        //取得該頁最後一個值的index
        pageEnd() {
            return this.currentPage * this.perpage
            },
        //時間換算
        sortedUsers() {
            const sortedUsers = [...this.uniqueUsers];
            sortedUsers.sort((a, b) => {
                const dateA = new Date(a.dateTime);
                const dateB = new Date(b.dateTime);
                return dateB - dateA;
            });
            return sortedUsers;
            },
        //倒序
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
        },
    mounted(){
        this.qnId =this.$route.query.qnId
        this.title = this.$route.query.title
        this.description = this.$route.query.description
        this.getSubmission()
        },
    }
</script>
<template></template>
<style lang="scss" scoped></style>
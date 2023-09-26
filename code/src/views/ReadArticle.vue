<template>
  <div class="bindex">
    <el-container>
      <el-header>
        <el-col :span="1">
          <el-button
            type="primary"
            icon="el-icon-s-home"
            @click="tohome()"
            size="small"
            >主页</el-button
          >
        </el-col>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link" style="color: #e56d79">
            <i class="el-icon-user-solid el-icon--right"></i>
            hi! {{ userName }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">安全退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 主体开始 -->
        <el-row :gutter="20">
          <el-col :span="4">
            <el-row :gutter="16" style="margin-top:10px; ">
              <el-col :span="24">
                <el-card style="height: 200px"></el-card>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="15">
            <el-row :gutter="16" style="margin-top:10px; ">
              <el-col :span="24">
                <el-card style="height: 850px">
                  <!-- 文章内容开始 -->
                  <h1 style="	18px large">{{ article.articleTitle }}</h1>
                  <el-divider content-position="left">简介</el-divider>
                  {{ article.articleSummary }}
                  <el-divider content-position="left">正文</el-divider>
                  {{ article.articleContent }}
                  <el-divider></el-divider>
                  <!-- 文章内容结束 -->
                  <el-button
                    type="success"
                    icon="el-icon-star-on"
                    circle
                    @click="like(article.id,article.likeNum)"
                  ></el-button>
                  {{ article.likeNum }}
                </el-card>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <!-- <el-card>上方三分之一card</el-card> -->
            <el-card style="margin-top:10px;height: 880px; width:70%"></el-card>
          </el-col>
        </el-row>
        <!-- 主体结束 -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import request from "@/util/request";
export default {
  data() {
    return {
      article: {
        id: -1,
        articleTitle: "",
        articleContent: "",
        articleSummary: "",
        categoryId: "",
        articleLogo: "",
        accessNum: "",
        rebackNum: "",
        likeNum: "",
        createBy: "",
        createTime: new Date(),
        updateTime: "",
        articleStatus: "",
        delFlag: 0
      },
      articleId: "",
      userName: ""
    };
  },
  created() {
    this.userName = this.$cookie.get("userName");
    this.articleId = this.$cookie.get("articleId");
    this.init(this.articleId);
  },
  methods: {
    //回主页
    tohome() {
      this.$router.push("/index");
    },
    //点赞
    async like(articleId, likeNum) {
      let res = await request.get(
        "/article/likearticle/" + articleId + "/" + likeNum
      );
      this.init(articleId);
    },
    handleCommand(command) {
      if (command == "logout") {
        if (localStorage.userName) {
          localStorage.removeItem("userName");
          next();
        } else {
          this.$cookie.remove("userName");
          this.$router.push("/login");
        }
      }
    },
    async init(articleId) {
      //调用后端接口请求article
      let res = await request.get("/article/getOne/" + articleId);
      //从res获取数据
      if (res.data.code == 200) {
        this.article = res.data.article;
      }
    }
  }
};
</script>
<style scoped>
.bindex {
  width: 100%;
  height: 100vh;
  position: relative;
  margin: 0;
  min-height: 100vh;
  background-color: rgba(67, 181, 209, 0.123);
  /* z-index: 1; */
  overflow: hidden;
  border-radius: 20px;
}

.el-header {
  background-color: rgb(77, 144, 219);
  line-height: 60px;
  text-align: right;
}
.bindex::before,
.bindex::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0) rotateZ(0);
  min-width: 300vw;
  min-height: 300vw;
  border-radius: 45%;
  background: linear-gradient(135deg, #83ddf8f8, #a3ffcd);
  bottom: 15vh;
  animation: rotate 10s linear infinite;
  z-index: -1;
  overflow: hidden;
}
.bindex::after {
  bottom: 13vh;
  opacity: 0.6;
  border-radius: 47%;
}
@keyframes rotate {
  0% {
    transform: translate(-50%, 0) rotateZ(0deg);
  }
  50% {
    transform: translate(-50%, 2%) rotateZ(180deg);
  }
  100% {
    transform: translate(-50%, 0) rotateZ(360deg);
  }
}
</style>
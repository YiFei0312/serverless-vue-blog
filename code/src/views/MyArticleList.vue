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
            <el-dropdown-item command="addarticle">添加文章</el-dropdown-item>
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
                  <!-- 表格 开始 -->
                  <el-table :data="articleList" style="width: 100%" class="table">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="文章简介">
                            <span>{{ scope.row.articleSummary }}</span>
                          </el-form-item>
                          <el-form-item label="作者">
                            <span>{{ scope.row.user.userName }}</span>
                          </el-form-item>
                          <el-form-item label="创建日期">
                            <span>{{ scope.row.createTime }}</span>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column prop="articleTitle" label="我的文章列表" width="230">
                      <template slot-scope="scope">
                        <div
                          @click="toReadArticle(scope.row.accessNum,scope.row.id)"
                          style="cursor: pointer;"
                        >{{scope.row.articleTitle}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="accessNum" label :formatter="formataccessNum"></el-table-column>
                    <el-table-column prop="likeNum" label :formatter="formatlikeNum"></el-table-column>
                    <el-table-column prop="category.categoryName" label></el-table-column>
                    <el-table-column label="操作" width="150">
                      <template slot-scope="scope">
                        <el-button @click="editArticle(scope.row.id)" type="text" size="small">编辑</el-button>
                        <el-button @click="delArticle(scope.row.id)" type="text" size="small">删除</el-button>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="user.userName" label :formatter="formatwriter"></el-table-column>
                    <el-table-column prop="createTime" label></el-table-column>-->
                  </el-table>
                  <!-- 表格 结束 -->
                  <!-- 分页器 开始 -->
                  <el-pagination
                    class="page"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageParam.pageNum"
                    :page-sizes="[8, 12, 20]"
                    :page-size="pageParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  ></el-pagination>
                  <!-- 分页器 结束 -->
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
      articleList: [],
      total: 0, // 总记录数
      pageParam: {
        //传递给后端接口的参数
        pageNum: 1,
        pageSize: 8,
        keyword: ""
      },
      userName: "",
      userId: ""
    };
  },
  created() {
    //从cookies中取值
    this.userName = this.$cookie.get("userName");
    this.userId = this.$cookie.get("userId");
    this.pageParam.keyword = this.userId;
    this.init();
  },
  methods: {
    //回主页
    tohome(){
      this.$router.push("/index");
    },
    //修改文章
    async editArticle(articleId) {
      this.$cookie.set("articleId", articleId);
      this.$router.push("/editarticle");
    },
    //删除文章
    async delArticle(articleId) {
      let res = await request.get("/article/delete/" + articleId);
      if (res.data.code == 200) {
        this.$message.success("删除文章成功");
        //页面刷新
        this.init();
      } else {
        this.$message.error("删除文章失败");
      }
    },
    //跳转文章页面将文章id存入cookie
    async toReadArticle(accessNum, articleId) {
      this.$cookie.set("accessNum", accessNum);
      let res = await request.get(
        "/article/accessarticle/" + articleId + "/" + accessNum
      );
      this.$cookie.set("articleId", articleId);
      console.log(
        "已将articleId存入cookie，articleId和访问数为：",
        articleId,
        accessNum + 1
      );
      this.$router.push("/readarticle");
    },
    //在表格数据前添加字段
    formatlikeNum(row, column, cellValue) {
      return `点赞量：${cellValue}`;
    },
    formataccessNum(row, column, cellValue) {
      return `点击量：${cellValue}`;
    },
    formatwriter(row, column, cellValue) {
      return `作者：${cellValue}`;
    },
    async init() {
      //调用后端接口请求articleList
      let res = await request.post("/article/listbycreater", this.pageParam);
      //从res获取数据
      if (res.data.code == 200) {
        this.articleList = res.data.articleList;
        this.total = res.data.total;
      }
    },
    clickMenu(path) {
      this.$router.push(path).catch(err => {});
    },
    handleCommand(command) {
      if (command == "addarticle") {
        this.$router.push("/addarticle");
      }
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
    // pageNum改变调用的函数
    handleCurrentChange(val) {
      // console.log(val)
      this.pageParam.pageNum = val;
      this.init();
    },
    // pageSize改变调用的函数
    handleSizeChange(val) {
      this.pageParam.pageSize = val;
      this.init();
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

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.boxcard {
  width: 480px;
}
.tital {
  background-color: rgb(204, 188, 188);
  line-height: 60px;
  text-align: center;
  margin: 0%;
  font-weight: bold;
}
.el-header {
  background-color: rgb(77, 144, 219);
  line-height: 60px;
  text-align: right;
}
.el-header .el-icon-user-solid {
  font-size: 18px;
  color: rgb(255, 104, 104);
}
</style>
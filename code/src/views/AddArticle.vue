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
                <el-card style="height: 2000px">
                  <!-- 表单开始 -->
                  <el-form :model="article" :rules="addRules" ref="addForm">
                    <el-form-item label="标题" prop="articleTitle">
                      <el-input
                        maxlength="20"
                        show-word-limit
                        v-model="article.articleTitle"
                        autocomplete="off"
                        size="small"
                        style="width: 180px"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="简介" prop="articleSummary">
                      <el-input
                        type="textarea"
                        v-model="article.articleSummary"
                        autocomplete="off"
                        size="small"
                        style="width: 180px"
                        maxlength="50"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="正文内容" prop="articleContent">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 8, maxRows: 20}"
                        placeholder="请输入内容"
                        v-model="article.articleContent"
                      ></el-input>
                      <br />
                      <br />
                      <!-- 头像模块 -->
                      <el-form-item label="文章logo" prop="articleLogo">
                        <!--文件上传组件 action="后端服务器地址",on-success文件上传成功后，执行的函数
                        before-upload文件上传之前执行的函数-->
                        <el-upload
                          class="avatar-uploader"
                          :action="'http://localhost:80/article/uploadLogo'"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeAvatarUpload"
                        >
                          <!-- 回显-->
                          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                          <!--图标-->
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </el-form-item>
                      <div>
                        <el-radio-group v-model="article.categoryId">
                          <el-radio-button
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.id"
                            :value="item.id"
                          >{{ item.categoryName }}</el-radio-button>
                        </el-radio-group>
                      </div>
                      <el-button type="primary" @click="addArticle()">上传</el-button>
                    </el-form-item>
                  </el-form>
                  <!-- 表单结束 -->
                </el-card>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <!-- <el-card>上方三分之一card</el-card> -->
            <el-card style="margin-top:10px;height: 2000px; width:70%"></el-card>
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
      categoryList: [],
      imageUrl: "",
      article: {
        id: -1,
        articleTitle: "",
        articleContent: "",
        articleSummary: "",
        categoryId: "",
        articleLogo: "",
        accessNum: 0,
        rebackNum: 0,
        likeNum: 0,
        createBy: "",
        createTime: new Date(),
        updateTime: "",
        articleStatus: 0,
        delFlag: 0
      },
      addRules: {
        articleTitle: [
          { required: true, message: "请输入标题名称", trigger: "blur" }
        ],
        articleContent: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ],
        articleSummary: [
          { required: true, message: "请输入概要", trigger: "blur" }
        ]
      },
      articleId: "",
      userName: "",
      userId: ""
    };
  },
  created() {
    this.userName = this.$cookie.get("userName");
    this.userId = this.$cookie.get("userId");
    this.article.createBy = this.userId;
    this.getAllcategory();
    this.init();
  },
  methods: {
    //回主页
    tohome() {
      this.$router.push("/index");
    },
    async getAllcategory() {
      let res = await request.post("/category/categoryList");
      if (res.data.code == 200) {
        this.categoryList = res.data.categoryList;
      }
    },
    addArticle() {
      // validate表单验证
      this.$refs["registerForm"].validate(async flag => {
        if (flag) {
          let res = await request.post("/article/add", this.article);
          console.log(res);
          if (res.data.code != 200) {
            this.$message.error("添加失败");
            return;
          }
          this.init();
          this.$message.success("添加成功");
          return;
        }
        this.$message.error("表单验证失败");
      });
    },
    //-----
    //文件上传成功执行的函数
    handleAvatarSuccess(res) {
      console.info("文件上传后，返回的数据:");
      console.info(res);
      // res就是后端controller层传递的ResultModel值
      //修改图片src属性值
      this.imageUrl = "http://localhost:80/" + res.src;
      //修改表单中数据
      this.article.articleLogo = res.imgTitle;
    },
    //文件上传之前的函数 file，就是你选中的图片文件
    beforeAvatarUpload(file) {
      if (file.type !== "image/jpeg") {
        this.$message.error("图片只支持JPG格式!");
        return false;
      } else if (file.size / 1024 / 1024 > 2) {
        this.$message.error("图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },
    async addArticle() {
      let res = await request.post("/article/add", this.article);
      if (res.data.code == 200) {
        this.$message.success("上传文章成功");
        //页面跳转
        this.$router.push("/index");
      } else {
        this.$message.error("上传失败");
      }
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
    //时间格式化
    formatDate(row, column) {
      // 获取单元格数据
      let datac = row[column.property];
      let dtc = new Date(datac);
      //获取月,默认月份从0开始
      let dtuMonth = dtc.getMonth() + 1;
      //获取日
      let dtuDay = dtc.getDate();
      //处理1-9月前面加0
      if (dtuMonth < 10) {
        dtuMonth = "0" + (dtc.getMonth() + 1);
      }
      //处理1-9天前面加0
      if (dtuDay < 10) {
        dtuDay = "0" + dtc.getDate();
      }
      //获取小时
      let dtuHours = dtc.getHours();
      //处理1-9时前面加0
      if (dtuHours < 10) {
        dtuHours = "0" + dtc.getHours();
      }
      //获取分钟
      let dtuMinutes = dtc.getMinutes();
      //处理1-9分前面加0
      if (dtuMinutes < 10) {
        dtuMinutes = "0" + dtc.getMinutes();
      }
      //获取秒
      let dtuSeconds = dtc.getSeconds();
      //处理1-9秒前面加0
      if (dtuSeconds < 10) {
        dtuSeconds = "0" + dtc.getSeconds();
      }
      //组装年月日时分秒,按自己的要求来
      let dd =
        dtc.getFullYear() +
        "/" +
        dtuMonth +
        "/" +
        dtuDay +
        " " +
        dtuHours +
        ":" +
        dtuMinutes +
        ":" +
        dtuSeconds;
      return (row.TableIsbibei = dd);
      //+ " " + dtuHours + ":" + dtuMinutes + ":" + dtuSeconds
    },
    async init() {}
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
.el-header {
  background-color: rgb(77, 144, 219);
  line-height: 60px;
  text-align: right;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #5a5e66;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
::v-deep .avatar-uploader-icon {
  font-size: 40px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}
::v-deep .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
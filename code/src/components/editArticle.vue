<template>
  <div class="editarticle-box">
    <span>编辑文章界面</span>
    <el-form :model="article" :rules="editRules" ref="editForm">
        <el-form-item label="标题" prop="articleTitle">
          <el-input
            v-model="article.articleTitle"
            autocomplete="off"
            size="small"
            style="width: 180px"
          ></el-input>
        </el-form-item>
        <el-form-item label="概要" prop="articleSummary">
          <el-input
            v-model="article.articleSummary"
            autocomplete="off"
            placeholder="请输入内容"
            type="textarea"
            :rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="articleContent">
          <el-input
            v-model="article.articleContent"
            autocomplete="off"
            size="small"
            type="textarea"
            :rows="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="Logo" prop="articleLogo">
          <el-upload
            class="avatar-uploader"
            :action="'http://localhost:80/article/uploadLogo'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="LogoUrl" :src="LogoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select
                v-model="article.categoryId"
                placeholder="请选择"
                size="small"
                disabled
              >
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="createBy">
          <el-select
                v-model="article.createBy"
                placeholder="请选择"
                size="small"
                disabled
              >
                <el-option
                  v-for="item in writerList"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="(editFormVisible = false), updateArticle()"
          >确 定</el-button
        >
      </div>
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
        delFlag: 0,
      },
      categoryList: [],
      writerList:[],
      editArticleId:this.$route.params.editArticleId,
      editRules: {
        articleTitle: [
          { required: true, message: "请输入标题名称", trigger: "blur" },
        ],
        articleContent: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        articleSummary: [
          { required: true, message: "请输入概要", trigger: "blur" },
        ],
      },
      LogoUrl:"",
    };
  },
  created() {
    this.getArticle();
    this.getAllCategory();
    this.getAllWriter();
  },
  methods: {
    updateArticle() {
      this.$refs["editForm"].validate(async (flag) => {
        if (flag) {
          const res = await request.post("/article/update", this.article);
          console.log(res);
          if (res.data.code != 200) {
            this.$message.error(res.data.msg);
            return;
          }
          this.$message.success("修改成功!");
          this.$router.push({name:'article'}).catch((err) => {});
          return;
        }
        this.$message.error("验证失败!");
      });
    },
    async getArticle() {
      let res = await request.get("/article/getOne/" + this.$route.params.editArticleId);
      if (res.data.code == 200) {
        this.article = res.data.article;
      }
    },
    async getAllCategory() {
      let res = await request.post("/category/categoryList");
      if (res.data.code == 200) {
        this.categoryList = res.data.categoryList;
      }
    },
    async getAllWriter() {
      let res = await request.post("/user/writerList");
      if (res.data.code == 200) {
        this.writerList = res.data.writerList;
      }
    },
    handleAvatarSuccess(res) {
      console.info("文件上传后，返回的数据:");
      console.info(res);
      // res就是后端controller层传递的ResultModel值
      //修改图片src属性值
      this.LogoUrl = "http://localhost:80/" + res.src;
      //修改表单中数据
      this.article.articleLogo = res.imgTitle;
    },
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
  }
};
</script>
<style scoped>
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
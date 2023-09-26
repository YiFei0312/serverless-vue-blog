<template>
  <div class="article-box">
    <!-- 卡片开始 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 卡片头部 开始 -->
        <el-row class="top">
          <el-col :span="6">
            <!-- 查询所有的创建者放里面 -->
            <!-- el-select 下拉框 v-model双向绑定 -->
            <el-select
              v-model="pageParam.keyword"
              placeholder="请选择"
              size="small"
            >
              <!-- writeList 需要在data中定义[]从后端请求到所有博主的信息 -->
              <!-- <option value="1">label</option> -->
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search()"
              size="small"
              >搜索</el-button
            >
          </el-col>
          <!-- 新增添加按钮 开始 -->
          <el-col :span="1" :offset="13">
            <el-button
              size="small"
              type="success"
              round
              class="add"
              icon="el-icon-circle-plus"
              @click="(addDialogVisible = true), (article = {})"
              >添加</el-button
            >
          </el-col>
          <!-- 新增添加按钮 结束 -->
        </el-row>
        <!-- 卡片头部 结束 -->
      </div>
      <div>
        <!-- 表格 开始 -->
        <!-- 渲染的表格 -->
        <!-- :data 表格数据 class 表格样式 -->
        <el-table :data="articleList" class="table">
          <!-- prop 是后端代码中Java类 Category类中的属性 -->
          <!-- prop 属性名 label是列的标题 width 宽度 -->
          <el-table-column prop="id" label="编号" width="80"> </el-table-column>
          <el-table-column prop="articleTitle" label="标题"> </el-table-column>
          <el-table-column
            prop="articleContent"
            label="内容"
            width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="articleSummary"
            label="概要"
            width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="category.categoryName"
            label="分类"
          ></el-table-column>
          <!-- <el-table-column prop="articleLogo" label="标识"></el-table-column> -->
          <el-table-column
            prop="user.userName"
            label="创建者"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            :formatter="formatDate"
          >
          </el-table-column>
          <el-table-column
            prop="articleStatus"
            label="状态"
            widv-bind:width="150"
          >
            <template slot-scope="scope">
              <el-switch
                v-bind:width="40"
                v-model="scope.row.articleStatus"
                @change="
                  changeArticleStatus(scope.row.id, scope.row.articleStatus)
                "
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="0"
                :inactive-value="1"
                active-text="正常"
                inactive-text="禁用"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                @click="
                  (editFormVisible = true),
                    (editArticleId = scope.row.id),
                    gotoArtcle()
                "
                type="text"
                size="small"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="delArticle(scope.row.id)"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格 结束 -->
        <!-- 分页器 开始 -->
        <el-pagination
          class="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParam.pageNum"
          :page-sizes="[2, 4, 5]"
          :page-size="pageParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <!-- 分页器 结束 -->
      </div>
    </el-card>
    <!-- 卡片结束 -->
    <!-- 新增分类对话框 开始 -->
    <el-dialog title="添加" :visible.sync="addDialogVisible">
      <el-form :model="article" :rules="addRules" ref="addForm">
        <el-form-item label="标题" prop="articleTitle">
          <el-input
            v-model="article.articleTitle"
            autocomplete="off"
            size="small"
            style="width: 180px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="(addDialogVisible = false), addArticle()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 新增文章对话框 结束 -->
    <!-- 编辑文章对话框 开始 -->
    <el-dialog title="编辑文章" :visible.sync="editFormVisible">
      <el-form :model="article" :rules="editRules" ref="editForm">
        <el-form-item label="标题" prop="articleTitle">
          <el-input
            v-model="article.articleTitle"
            autocomplete="off"
            size="small"
            style="width: 180px"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="articleContent">
          <el-input
            v-model="article.articleContent"
            autocomplete="off"
            size="small"
            style="width: 180px"
          ></el-input>
        </el-form-item>
        <el-form-item label="概要" prop="articleSummary">
          <el-input
            v-model="article.articleSummary"
            autocomplete="off"
            size="small"
            style="width: 180px"
          ></el-input>
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
    </el-dialog>
    <!-- 编辑分类对话框 结束 -->
  </div>
</template>

<script>
import request from "@/util/request";
export default {
  data() {
    return {
      articleList: [],
      pageParam: {
        pageNum: 1,
        pageSize: 2,
        keyword: "",
      },
      total: 0,
      categoryList: [],
      writerList: [],
      addDialogVisible: false,
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
      addRules: {
        articleTitle: [
          { required: true, message: "请输入标题名称", trigger: "blur" },
        ],
      },
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
      editArticleId: -1,
      editFormVisible: false,
    };
  },
  created() {
    this.init(); //调用函数
    this.getAllCategory();
    this.getAllWriter();
  },
  methods: {
    async changeArticleStatus(id, status) {
      let res = await request.get("/article/update/" + id + "/" + status);
      if (res.data.code == 200) {
        this.$message.success(res.data.msg);
      } else {
        this.$message.error(res.data.msg);
      }
    },
    updateArticle() {
      this.$refs["editForm"].validate(async (flag) => {
        if (flag) {
          const res = await request.post("/article/update", this.article);
          console.log(res);
          if (res.data.code != 200) {
            this.$message.error(res.data.msg);
            return;
          }
          this.init(); //刷新表格
          this.$message.success("修改成功!");
          return;
        }
        this.$message.error("表单验证失败!");
      });
    },

    async getArticle() {
      let res = await request.get("/article/getOne/" + this.editArticleId);
      if (res.data.code == 200) {
        this.article = res.data.article;
      }
    },
    async getCategory() {
      let res = await request.get("/article/getOne/" + this.editArticleId);
      if (res.data.code == 200) {
        this.article = res.data.article;
      }
    },

    async delArticle(id) {
      let res = await request.get("/article/delete/" + id);
      if (res.data.code == 200) {
        this.$message.success(res.data.msg);
        this.init();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    addArticle() {
      this.$refs["addForm"].validate(async (flag) => {
        if (flag) {
          const res = await request.post("/article/add", this.article);
          console.log(res);
          if (res.data.code != 200) {
            this.$message.error(res.data.msg);
            return;
          }
          this.init(); //刷新表格
          this.$message.success("添加成功!");
          return;
        }
        this.$message.error("表单验证失败!");
      });
    },

    search() {
      this.pageParam.pageNum = 1;
      this.init();
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

    gotoArtcle() {
      const Id = this.editArticleId;
      this.$router
        .push({
          name: "editArticle",
          params: { editArticleId: 1 },
        })
        .catch((err) => {});
      console.log(Id);
      // pageNum改变调用的函数
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.pageParam.pageNum = val;
      this.init();
    },
    // pageSize改变调用的函数
    handleSizeChange(val) {
      this.pageParam.pageSize = val;
      this.init();
    },
    async init() {
      let res = await request.post("/article/list", this.pageParam);
      if (res.data.code == 200) {
        this.articleList = res.data.articleList;
        this.total = res.data.total;
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
  },
};
</script>
<style scoped></style>

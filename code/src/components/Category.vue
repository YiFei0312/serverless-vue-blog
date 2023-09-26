<template>
  <div class="category-name">
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
                v-for="item in writerList"
                :key="item.id"
                :label="item.userName"
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
              @click="(addDialogVisible = true), (category = {})"
              >添加</el-button
            >
          </el-col>
          <!-- 新增添加按钮 结束 -->
        </el-row>
        <!-- 卡片结束 -->
        <!-- 新增分类对话框 开始 -->
        <el-dialog title="新增分类" :visible.sync="addDialogVisible">
          <el-form :model="category" :rules="addRules" ref="addForm">
            <el-form-item label="名称" prop="categoryName">
              <el-input
                v-model="category.categoryName"
                autocomplete="off"
                size="small"
                style="width: 180px"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建者" prop="createBy">
              <el-select
                v-model="category.createBy"
                placeholder="请选择"
                size="small"
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
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="(addDialogVisible = false), addCategory()"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <!-- 新增分类对话框 结束 -->
        <!-- 编辑分类对话框 开始 -->
        <el-dialog title="编辑分类" :visible.sync="editFormVisible">
          <el-form :model="category" :rules="editRules" ref="editForm">
            <el-form-item label="编号" prop="id">
              <!-- disabled 禁用，id是不允许修改的 -->
              <el-input
                v-model="category.id"
                autocomplete="off"
                size="small"
                style="width: 180px"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="categoryName">
              <el-input
                v-model="category.categoryName"
                autocomplete="off"
                size="small"
                style="width: 180px"
              ></el-input>
            </el-form-item>
            <!-- disabled不允许修改 -->
            <el-form-item label="创建者" prop="createBy">
              <el-select
                v-model="category.createBy"
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
              @click="(editFormVisible = false), updateCategory()"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <!-- 编辑分类对话框 结束 -->
      </div>
      <div>
        <!-- 表格开始 -->
        <!-- 渲染的表格 -->
        <!-- :data 表格数据 class 表格样式 -->
        <el-table :data="categoryList" class="table">
          <!-- prop 是后端代码中Java类 类的属性名 -->
          <el-table-column prop="id" label="编号"> </el-table-column>
          <el-table-column prop="categoryName" label="类名"> </el-table-column>
          <el-table-column prop="user.userName" label="创建者">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            :formatter="formatDate"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="
                  (editFormVisible = true),
                    (editCategoryId = scope.row.id),
                    getCategory()
                "
                type="text"
                size="small"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="delCategory(scope.row.id)"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格结束 -->
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
  </div>
</template>
<script>
// 导入老师封装的request请求后端
import request from "@/util/request";
export default {
  data() {
    return {
      categoryList: [], //数组使用[] 对象{} 字符串 "" 数值
      total: 0, // 总记录数
      pageParam: {
        //传递给后端接口的参数
        pageNum: 1,
        pageSize: 2,
        keyword: "",
      },
      writerList: [],
      addDialogVisible: false,
      category: {
        id: -1,
        categoryName: "",
        createBy: -1,
        createTime: new Date(),
        delFlag: 0,
      },
      addRules: {
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        createBy: [
          { required: true, message: "请选择一个创建者", trigger: "blur" },
        ],
      },
      editCategoryId: -1,
      editFormVisible: false,
      editRules: {
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    //在vue实例创建成功以后，就可以使用data和methods中定义的属性和函数
    this.init(); //调用函数
    this.getAllWriter();
  },
  methods: {
    updateCategory() {
      this.$refs["editForm"].validate(async (flag) => {
        if (flag) {
          const res = await request.post("/category/update", this.category);
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

    async getCategory() {
      let res = await request.get("/category/getOne/" + this.editCategoryId);
      if (res.data.code == 200) {
        this.category = res.data.category;
      }
    },

    addCategory() {
      this.$refs["addForm"].validate(async (flag) => {
        if (flag) {
          const res = await request.post("/category/add", this.category);
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
    async getAllWriter() {
      let res = await request.post("/user/writerList");
      if (res.data.code == 200) {
        this.writerList = res.data.writerList;
      }
    },
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
    search() {
      this.pageParam.pageNum = 1;
      this.init();
    },
    async init() {
      //调用后端接口，获取用户信息列表
      // await 等待后端请求成功，等待的时候会阻塞后面的代码的执行
      let res = await request.post("/category/list", this.pageParam);
      //从res中获取数据
      if (res.data.code == 200) {
        this.categoryList = res.data.categoryList;
        this.total = res.data.total;
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
    },
    // async changeUserStatus(id, status) {
    //   let res = await request.get("/category/update/" + id + "/" + status);
    //   if (res.data.code == 200) {
    //     this.$message.success(res.data.msg);
    //   } else {
    //     this.$message.error(res.data.msg);
    //   }
    // },
    async delCategory(id) {
      let res = await request.get("/category/delete/" + id);
      if (res.data.code == 200) {
        this.$message.success(res.data.msg);
        this.init();
      } else {
        this.$message.error(res.data.msg);
      }
    },
  },
};
</script>

<style scoped></style>

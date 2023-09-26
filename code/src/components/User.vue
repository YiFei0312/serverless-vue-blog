<template>
  <div class="user-name">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- row行 col 列 :span="8" 这1列占8份 ,element-ui 将一行分成24份 -->
        <el-row>
          <el-col :span="8">
            <!-- 绑定值变化时触发的事件,编写一个事件@input -->
            <el-radio-group v-model="pageParam.keyword" @input="search()">
              <el-radio :label="''">全部</el-radio>
              <el-radio :label="1">博主</el-radio>
              <el-radio :label="0">用户</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="2" :offset="14">
            <el-button
              type="success"
              plain
              size="small"
              icon="el-icon-circle-plus"
              @click="
                  (dialogFormVisible = true),
                  (user = { userSex: '男', userRole: '0' })
                "
            >新增</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <!-- 表格开始 -->
        <!-- 渲染的表格 -->
        <!-- :data 表格数据 class 表格样式 -->
        <el-table :data="userList" class="table">
          <!-- prop 是后端代码中Java类 User类的属性名 -->
          <el-table-column prop="id" label="编号" width="80"></el-table-column>
          <el-table-column prop="userName" label="用户名" width="80"></el-table-column>
          <el-table-column prop="userImg" label="头像" width="100px">
            <template slot-scope="scope">
              <!-- src的值使用的虚拟路径 -->
              <img
                :src="
                  'http://localhost:80/image/blog_img/user/' + scope.row.userImg
                "
                alt
                width="60px"
                height="60px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="userPhone" label="手机号"></el-table-column>
          <el-table-column prop="userSex" label="性别" width="80"></el-table-column>
          <el-table-column prop="userPlace" label="坐标">
            <template slot-scope="scope">
              <i class="el-icon-location-information"></i>
              {{ scope.row.userPlace }}
            </template>
          </el-table-column>
          <el-table-column prop="userRole" label="身份">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.userRole == 1">博主</el-tag>
              <el-tag type="warning" v-if="scope.row.userRole == 0">用户</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="userStatus" label="状态" width="150">
            <template slot-scope="scope">
              <el-switch
                width="40"
                v-model="scope.row.userStatus"
                @change="changeUserStatus(scope.row.id, scope.row.userStatus)"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="0"
                :inactive-value="1"
                active-text="正常"
                inactive-text="禁用"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                @click="(editFormVisible=true),(editUserId=scope.row.id),getUser()"
                type="text"
                size="small"
              >编辑</el-button>
              <el-button @click="delUser(scope.row.id)" type="text" size="small">删除</el-button>
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
        ></el-pagination>
        <!-- 分页器 结束 -->
      </div>
    </el-card>
    <!-- 新增对话框---开始 visible是否显示-->
    <el-dialog title="新用户信息" :visible.sync="dialogFormVisible">
      <!-- 表单开始 -->
      <el-form ref="registerForm" :model="user" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPwd">
          <el-input type="password" v-model="user.userPwd" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="user.userPhone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="user.userEmail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-radio-group v-model="user.userSex">
            <el-radio label="男" aria-checked>男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="userRole">
          <el-radio-group v-model="user.userRole">
            <el-radio label="0">用户</el-radio>
            <el-radio label="1">博主</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 头像模块 -->
        <el-form-item label="头像" prop="userImg">
          <!--文件上传组件 action="后端服务器地址"
on-success文件上传成功后，执行的函数
          before-upload文件上传之前执行的函数-->
          <el-upload
            class="avatar-uploader"
            :action="'http://localhost:80/user/uploadImg'"
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
        <el-form-item label="坐标" prop="userPlace">
          <el-input v-model="user.userPlace" placeholder="请输入坐标"></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="userDesc">
          <el-input
            type="textarea"
            placeholder="请输入个人简介"
            :rows="2"
            :maxlength="30"
            show-word-limit
            v-model="user.userDesc"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 表单结束 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="(dialogFormVisible = false), addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增对话框---结束 -->

    <!-- 编辑分类对话框 开始 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible">
      <el-form :model="user" :rules="editRules" ref="editForm">
        <el-form-item label="编号" prop="id">
          <!-- disabled 禁用，id是不允许修改的 -->
          <el-input v-model="user.id" autocomplete="off" size="small" style="width: 180px" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" autocomplete="off" size="small" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="userImg">
          <!--文件上传组件 action="后端服务器地址"
on-success文件上传成功后，执行的函数
          before-upload文件上传之前执行的函数-->
          <el-upload
            class="avatar-uploader"
            :action="'http://localhost:80/user/uploadImg'"
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
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="user.userPhone" autocomplete="off" size="small" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-radio-group v-model="user.userSex">
            <el-radio label="男" aria-checked>男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="坐标" prop="userPhone">
          <el-input v-model="user.userPhone" autocomplete="off" size="small" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="userRole">
          <el-radio-group v-model="user.userRole">
            <el-radio label="0">用户</el-radio>
            <el-radio label="1">博主</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="(editFormVisible = false), updateUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑分类对话框 结束 -->
  </div>
</template>
<script>
// 导入老师封装的request请求后端
import request from "@/util/request";
export default {
  data() {
    return {
      userList: [], //数组使用[] 对象{} 字符串 "" 数值
      total: 0, // 总记录数
      pageParam: {
        //传递给后端接口的参数
        pageNum: 1,
        pageSize: 2,
        keyword: ""
      },
      dialogFormVisible: false,
      editFormVisible: false,
      editUserId: -1,
      editRules: {},
      user: {
        id: -1,
        userName: "",
        userPwd: "",
        userImg: "",
        userPhone: "",
        userEmail: "",
        userSex: "",
        userDesc: "",
        userPlace: "",
        userRole: "0",
        delFlag: 0,
        userStatus: 0
      },
      rules: {
        userName: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          },
          {
            min: 2,
            max: 20,
            message: "长度在2到20个字符",
            trigger: "blur"
          }
        ],
        userPwd: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        userPhone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "手机号是11位数字",
            trigger: "blur"
          }
        ]
      },
      imageUrl: "" //图片地址
    };
  },
  created() {
    //在vue实例创建成功以后，就可以使用data和methods中定义的属性和函数
    this.init(); //调用函数
  },
  methods: {
    search() {
      this.pageParam.pageNum = 1;
      this.init();
    },
    async init() {
      //调用后端接口，获取用户信息列表
      // await 等待后端请求成功，等待的时候会阻塞后面的代码的执行
      let res = await request.post("/user/list", this.pageParam);
      //从res中获取数据
      if (res.data.code == 200) {
        this.userList = res.data.userList;
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
    async changeUserStatus(id, status) {
      let res = await request.get("/user/update/" + id + "/" + status);
      if (res.data.code == 200) {
        this.$message.success(res.data.msg);
      } else {
        this.$message.error(res.data.msg);
      }
    },
    async delUser(id) {
      let res = await request.get("/user/delete/" + id);
      if (res.data.code == 200) {
        this.$message.success(res.data.msg);
        this.init();
      } else {
        this.$message.error(res.data.msg);
      }
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
      this.user.userImg = res.imgTitle;
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

    addUser() {
      // validate表单验证
      this.$refs["registerForm"].validate(async flag => {
        if (flag) {
          let res = await request.post("/user/add", this.user);
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
    async getUser() {
      let res = await request.get("/user/getOne/" + this.editUserId);
      if (res.data.code == 200) {
        this.user = res.data.user;
      }
    },
    updateUser() {
      this.$refs["editForm"].validate(async flag => {
        if (flag) {
          const res = await request.post("/user/update", this.user);
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
    }
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

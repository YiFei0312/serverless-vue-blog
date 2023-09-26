<template>
  <div class="loginBox" style="text-align:center">
    <!-- 表单开始 -->

    <el-form
      class="registerForm"
      ref="registerForm"
      :model="user"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="用户名:" prop="userName">
        <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="userPwd">
        <el-input type="password" v-model="user.userPwd" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" prop="userPhone">
        <el-input v-model="user.userPhone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:" prop="userEmail">
        <el-input v-model="user.userEmail" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="性别:" prop="userSex">
        <el-radio-group v-model="user.userSex">
          <el-radio label="男" aria-checked>男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色:" prop="userRole">
        <el-radio-group v-model="user.userRole">
          <el-radio label="0">用户</el-radio>
          <el-radio label="1">博主</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 头像模块 -->
      <el-form-item label="头像" prop="userImg">
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
      <el-form-item label="坐标:" prop="userPlace">
        <el-input v-model="user.userPlace" placeholder="请输入坐标"></el-input>
      </el-form-item>
      <el-form-item label="摘要:" prop="userDesc">
        <el-input
          type="textarea"
          placeholder="请输入个人简介"
          :rows="2"
          :maxlength="30"
          show-word-limit
          v-model="user.userDesc"
        ></el-input>
      </el-form-item>
      <el-button type="primary" size="large" style="width: 100%" @click="addUser">
        <span>注册</span>
      </el-button>
    </el-form>

    <!-- 表单结束 -->
    <!-- <el-button type="primary" size="large" style="width: 100%" @click="addUser">
      <span>注册</span>
    </el-button>-->
    <!--底部信息-->
    <div class="el-login-footer">
      <span>Copyright © 305 所有</span>
    </div>
  </div>
</template>

<script>
import request from "@/util/request";
export default {
  data() {
    return {
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
  created() {},
  methods: {
    //回主页
    tohome() {
      this.$router.push("/index");
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

    async addUser() {
      let res = await request.post("/user/add", this.user);
      console.log(res);
      if (res.data.code != 200) {
        this.$message.error("添加失败");
        return;
      }
      this.$message.success("添加成功");
      this.$router.push("/login");
      return;
    }
  }
};
</script>
<style scoped="scoped">
.registerForm .el-input {
  width: 300px;
}

.loginBox {
  width: 100%;
  height: 100vh; /*px 像素  vh */
  background: linear-gradient(180deg, #08b0fdc9, #e97de375);
  background-size: cover;
  display: flex; /*弹性盒子*/
  flex-direction: row; /*主轴水平*/
  justify-content: center; /*主轴对齐方式*/
  align-items: center; /*侧轴对齐方式*/
  backdrop-filter: blur(100px);
}
.title {
  text-align: center; /*文本对齐方式,水平居中 */
  margin-bottom: 30px;
  color: #4429b0;
  font-size: 18px;
}
.registerForm {
  width: 500px;
  background-color: #ffffffda; /*背景颜色 */
  border-radius: 15px; /*圆角边框 */
  padding: 25px 25px 6px 25px; /*内填充 */
  backdrop-filter: blur(3px);
}

.loginForm .el-input {
  height: 40px;
}

.loginForm .el-input input {
  display: inline-block;
  height: 40px; /*设置输入框的高度*/
}

.el-login-footer {
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: fixed; /*固定定位，相对于窗体进行定位*/
  bottom: 10px;
  text-align: center;
  color: #ffffff;
  font-size: 14px;
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

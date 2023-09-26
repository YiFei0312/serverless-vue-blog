<template>
  <div class="loginBox">
    <el-form class="loginForm" :model="manager" :rules="rules" ref="loginRef">
      <h3 class="title">个人博客后台管理系统</h3>
      <el-form-item prop="managerName">
        <el-input type="text" placeholder="账号" size="large" v-model="manager.managerName"></el-input>
      </el-form-item>
      <el-form-item prop="managerPwd">
        <el-input type="password" placeholder="密码" size="large" v-model="manager.managerPwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox label="记住密码" name="type" />
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" size="large" style="width: 100%" @click="login">
          <span>123</span>
        </el-button>
      </el-form-item>
    </el-form>
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
      manager: {
        managerName: "",
        managerPwd: "",
        
      },
      rules: {
        managerName: [
          {
            required: true,
            message: "请输入账户名",
            trigger: "blur"
          }
        ],
        managerPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    login() {
      // ses= window.sessionStorage;
      //点击登录按钮请求后端接口
      this.$refs["loginRef"].validate(async flag => {
        if (flag) {
          //表单验证成功
          let res = await request.post("/manager/login", this.manager);
          console.info(res);
          if (res.data.code == 200) {
            this.$message.success("登录成功");
            this.$cookie.set("managerName", res.data.managerName);
            //将managerName存储到localStorage中
            localStorage.setItem("managerName", this.manager.managerName);
            //页面跳转
            this.$router.push("/bgindex");
          } else {
            this.$message.error("登录失败");
          }
        } else {
          this.$message.error("表单验证失败");
        }
      });
    }
  }
};
</script>
<style scoped="scoped">
.loginBox {
  width: 100%;
  height: 100vh; /*px 像素  vh */
  background: linear-gradient(180deg, #02aefdbe, #04f591f8);
  background-size: cover;
  display: flex; /*弹性盒子*/
  flex-direction: row; /*主轴水平*/
  justify-content: center; /*主轴对齐方式*/
  align-items: center; /*侧轴对齐方式*/
}
.title {
  text-align: center; /*文本对齐方式,水平居中 */
  margin-bottom: 30px;
  color: #4429b0;
  font-size: 18px;
}
.loginForm {
  width: 400px;
  background-color: #ffffff69; /*背景颜色 */
  border-radius: 6px; /*圆角边框 */
  padding: 25px 25px 6px 25px; /*内填充 */
    backdrop-filter: blur(5px);
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
</style>

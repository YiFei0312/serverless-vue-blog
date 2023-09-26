<template>
  <div class="loginBox" style="text-align:center">
    <el-form class="loginForm" :model="user" :rules="rules" ref="loginRef">
      <br />
      <h3 class="title">个人博客前台登陆</h3>
      <br />
      <el-form-item prop="userName">
        <el-input type="text" placeholder="账号" size="large" v-model="user.userName"></el-input>
      </el-form-item>
      <br />
      <el-form-item prop="userPwd">
        <el-input type="password" placeholder="密码" size="large" v-model="user.userPwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox label=" " name="type" />
        <span>{{text}}</span>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" round size="small" style="width: 75%" @click="login">
          <span>登录</span>
        </el-button>
        <br />
        <el-button round size="small" style="width: 75%" @click="register">
          <span>去注册</span>
        </el-button>
      </el-form-item>
    </el-form>
    <el-form class="introduce">
      <h1 class="text">welcome</h1>
      <h3 class="text2">欢迎来到博客</h3>
    </el-form>
    <!--底部信息-->
    <div class="login">
      <el-button type="primary" size="small" style="width: 100%" @click="tobglogin">
        <span>去登陆后台</span>
      </el-button>
    </div>

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
      text:
        "记住密码\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000",
      user: {
        userImg: "",
        id: "",
        userName: "",
        userPwd: "",
        userRole:"",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "\u3000\u3000请输入账户名",
            trigger: "blur"
          }
        ],
        userPwd: [
          {
            required: true,
            message: "\u3000\u3000请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    register() {
      this.$router.push("/register");
    },
    tobglogin() {
      this.$router.push("/bglogin");
    },
    login() {
      //点击登录按钮请求后端接口
      this.$refs["loginRef"].validate(async flag => {
        if (flag) {
          //表单验证成功
          let res = await request.post("/user/login", this.user);
          console.info(res);
          if (res.data.code == 200) {
            this.$message.success("登录成功");
            //将managerName存储到localStorage中
            localStorage.setItem("userName", this.user.userName);
            this.$cookie.set("userName", res.data.userName);
            this.$cookie.set("userId", res.data.id);
            this.$cookie.set("userImg", res.data.userImg);
            this.$cookie.set("userRole", res.data.userRole);
            //页面跳转
            this.$router.push("/index");
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
.login {
  position: absolute;
  top: 0px;
  right: 0px;
}
.text {
  text-align: center; /*文本对齐方式,水平居中 */
  margin-bottom: 30px;
  color: #ffffff;
  font-size: 45px;
}
.text2 {
  text-align: left;
  margin-bottom: 30px;
  color: #a4ebc4f3;
  font-size: 25px;
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

.loginForm {
  width: 300px;
  height: 470px;
  background-color: #ffffffda; /*背景颜色 */
  border-top-left-radius: 15px; /*圆角边框 */
  border-bottom-left-radius: 15px; /*圆角边框 */
  padding: 25px 25px 6px 25px; /*内填充 */
  backdrop-filter: blur(3px);
}
.introduce {
  width: 550px;
  height: 470px;
  background-color: #181b13d8; /*背景颜色 */
  border-top-right-radius: 15px; /*圆角边框 */
  border-bottom-right-radius: 15px; /*圆角边框 */
  padding: 25px 25px 6px 25px; /*内填充 */
  background-image: url("../assets/bgx.jpeg");
}

.loginForm .el-input {
  height: 40px;
  width: 260px;
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

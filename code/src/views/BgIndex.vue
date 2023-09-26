<template>
  <el-container class="bgindex-box">
    <el-aside>
      <div class="title">个人博客管理系统</div>
      <el-menu
        background-color="#07f3d000"
        active-text-color="#28089c"
        :default-active="activeIndex"
        @select="selectMenu"
      >
        <el-menu-item index="1" @click="clickMenu('/user')">
          <i class="el-icon-user"></i>用户管理</el-menu-item
        ><br />
        <el-menu-item index="2" @click="clickMenu('/category')">
          <i class="el-icon-s-grid"></i>分类管理</el-menu-item
        ><br />
        <el-menu-item index="3" @click="clickMenu('/label')">
          <i class="el-icon-s-flag"></i>标签管理</el-menu-item
        ><br />
        <el-menu-item index="4" @click="clickMenu('/article')">
          <i class="el-icon-document"></i>文章管理</el-menu-item
        >
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link" style="color: #0f0d1a">
            <i
              class="el-icon-user-solid el-icon--right"
              style="color: #0a276064"

            ></i>
            {{ managerName }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">安全退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view> </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "DianshangLayout",
  data() {
    return {
      activeIndex: "/",
      managerName: "",
    };
  },
  created() {
    let index = localStorage.getItem("index");
    if (index) {
      this.activeIndex = index;
    }

    this.managerName = this.$cookie.get("managerName");
    this.$router.push("/user").catch((err) => {});

  },
  methods: {
    selectMenu(index, path) {
      console.log(index, path);
      //存储index的值
      localStorage.setItem("index", index);
    },

    clickMenu(path) {
      this.$router.push(path).catch((err) => {}); //跳转页面
    },
    handleCommand(command) {
      localStorage.removeItem("managerName");
      this.$cookie.remove("managerName");
      this.$router.push("/bglogin");
    },
  },
};
</script>
<style scoped>
.bgindex-box {
  width: 100%;
  height: 100vh;
  position: relative;
  margin: 0;
  min-height: 100vh;
  background-color: rgba(19, 157, 211, 0.075);
  /* z-index: 1; */
  overflow: hidden;
  border-radius: 20px;
}
.bgindex-box::before,
.bgindex-box::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0) rotateZ(0);
  min-width: 300vw;
  min-height: 300vw;
  border-radius: 45%;
  background-color: #0b91ff6e;
  bottom: 15vh;
  animation: rotate 10s linear infinite;
  z-index: -1;
  overflow: hidden;
}
.bgindex-box::after {
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

.title {
  background: linear-gradient(135deg, #32b7f5c9, #f5f5f585);
  line-height: 60px;
  text-align: center;
  margin: 0;
  font-weight: bold;
  backdrop-filter: blur(50px);
}

.el-aside {
  width: 200px !important;
  background: linear-gradient(to right, #4eb4e496, #fcfcfc17);
}
.el-main {
  background-color: #ffffffc7;
}
.el-header {
  background: linear-gradient(to right, #ffffff50, #5a9ebe4d);
  line-height: 60px;
  text-align: right; /*文本右对齐 */
  color: #0f0d1a;
  backdrop-filter: blur(100px);

}
.el-header.el-icon-user-solid {
  font-size: 20px;
  color: #0a276064;
  font-size: 200px;

}
.el-aside::-webkit-scrollbar {
  display: none;
}
.el-menu {
  border-right: 0;
}
</style>

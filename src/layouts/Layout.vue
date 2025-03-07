<template>
  <el-container class="container">
    <el-aside class="aside" width="200px">
      <el-menu :default-active="activeIndex"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b" class="el-menu-vertical">
<!--        数据可视化分析-->
        <el-menu-item index="/dashboard" @click="navigateTo('/dashboard')"><i class="el-icon-plus"></i>需求分析</el-menu-item>
        <!--        用户增删改查-->
        <el-menu-item index="/users" @click="navigateTo('/users')"><i class="el-icon-plus"></i>软件设计</el-menu-item>
<!--        景点管理-->
        <el-menu-item index="/tours" @click="navigateTo('/tours')"><i class="el-icon-plus"></i>代码设计</el-menu-item>
<!--        个人设置-->
        <el-menu-item index="/profile" @click="navigateTo('/profile')"><i class="el-icon-plus"></i>软件测试</el-menu-item>
        <!-- 其他菜单项 -->
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <!--        <div class="logo">My Admin</div>-->
        <div class="header-content">
<!--          <div class="current-path">-->
<!--            当前路径: {{ $route.path }}-->
<!--          </div>-->

<!--          <div class="user-info">-->
<!--            <img :src="avatarUrl" alt="Avatar" class="avatar">-->
<!--            <span class="username">{{ username }}</span>-->
<!--            <el-button type="text" >退出</el-button>-->
<!--          </div>-->
        </div>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
export default {
  watch: {
    $route(to) {
      this.activeIndex = to.path;
    }
  },
  mounted() {
    console.log('当前路径:', this.$route.path)
    this.activeIndex = this.$route.path
  },
  data() {
    return {
      activeIndex: '/dashboard',
      username: '用户名', // 替换为实际用户名
      avatarUrl: require('@/assets/logo.png') // 替换为实际头像 URL

    };
  },
  methods: {
    navigateTo(path) {
      console.log(this.activeIndex);
      if (this.$route.path !== path) {
        this.activeIndex = path;
        this.$router.push(path);
      }
    }
  }
};
</script>

<style scoped>
.el-menu {
  width: 100%; /* 让菜单宽度占满父容器 */
  border-right: none; /* 去掉右侧边框 */
}
.aside{
  background-color: #545c64;
}
.container{
  height: 100vh;
}

.header {
  background-color: #ffffff;
  text-align: center;
  line-height: 60px;
  border-bottom: 1px solid #ebeef5;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.main {
  padding: 20px;
}
.header-content {
  display: flex;
  /*justify-content: space-between;*/
  /*align-items: center;*/
  /*width: 100%;*/
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  margin-right: 10px;
}

.current-path {
  margin-right: auto;   /* 当前路径是靠左的 */
  /*padding-left: 20px;*/
}

</style>


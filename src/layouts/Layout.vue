<template>
  <el-container class="container">
    <el-aside class="aside" width="200px">
      <el-menu :default-active="activeIndex"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b" class="el-menu-vertical">
        <el-menu-item index="/reqs" @click="navigateTo('/reqs')"><i class="el-icon-plus"></i>需求分析</el-menu-item>
        <el-menu-item index="/sdesigns" @click="navigateTo('/sdesigns')"><i class="el-icon-plus"></i>概要设计</el-menu-item>
        <el-menu-item index="/cdesigns" @click="navigateTo('/cdesigns')"><i class="el-icon-plus"></i>详细设计</el-menu-item>
        <el-menu-item index="/codedesigns" @click="navigateTo('/codedesigns')"><i class="el-icon-plus"></i>代码设计</el-menu-item>
        <el-menu-item index="/waretest" @click="navigateTo('/waretest')"><i class="el-icon-plus"></i>软件测试</el-menu-item>
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

.main {
  padding: 20px;
}
.header-content {
  display: flex;
  /*justify-content: space-between;*/
  /*align-items: center;*/
  /*width: 100%;*/
}

</style>


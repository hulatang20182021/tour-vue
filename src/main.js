import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import ECharts from 'vue-echarts';
import 'echarts';
import './assets/styles/global.css'; // 引入全局样式覆盖文件

Vue.component('v-chart', ECharts);

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

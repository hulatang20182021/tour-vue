<template>
  <div>
    <v-chart :option="chartOptions" style="width: 100%; height: 300px;"></v-chart>
  </div>
</template>

<script>
import {getCommentsRank} from "@/api/tour";

export default {
  name: 'TouristSpotRanking',
  data() {
    return {
      chartOptions: {
        title: {
          text: '旅游景点评论排名',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['评论数'],
        },
        xAxis: {
          type: 'category',
          data: ['景点A', '景点B', '景点C', '景点D', '景点E'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '评论数',
            type: 'line',
            data: [820, 932, 901, 934, 1290],
          },
        ],
      },
    };
  },
  mounted() {
    getCommentsRank().then(res=>{
      console.log(res.data)
      this.chartOptions.series[0].data = res.data.map(i=>i.comments);
      this.chartOptions.xAxis.data = res.data.map(i=>i.title);
    })
  },
};
</script>

<style scoped>
/* 添加一些样式使图表看起来更好 */
</style>

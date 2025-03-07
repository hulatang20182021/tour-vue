<template>
  <div>
    <v-chart :option="chartOptions" style="width: 100%; height: 400px;"></v-chart>
  </div>
</template>

<script>
export default {
  name: 'TouristSpotRating',
  data() {
    return {
      chartOptions: {
        title: {
          text: '旅游景点评分排名',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: ['景点A', '景点B', '景点C', '景点D', '景点E'],
        },
        yAxis: {
          type: 'value',
          max: 10,
        },
        series: [
          {
            name: '评分',
            type: 'bar',
            data: [8.5, 9.0, 7.5, 9.3, 8.0],
            itemStyle: {
              color: '#67c23a',
            },
          },
        ],
      },
    };
  },
};
</script>

<style scoped>
/* 添加一些样式使图表看起来更好 */
</style>


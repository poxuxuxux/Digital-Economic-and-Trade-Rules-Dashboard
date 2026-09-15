<template>
  <div class="panel" id="publisher">
    <div class="p-title"><span class="tag-icon"></span>发布机构统计</div>
    <div class="chart publisher-chart"><EChart :option="option" /></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EChart from './EChart.vue'
import { domesticStats } from '../store.js'

const option = computed(() => {
  const data = domesticStats.value.publishers
  return {
    grid: { left: 132, right: 42, top: 8, bottom: 8 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      confine: true,
      backgroundColor: 'rgba(4,18,44,.96)',
      borderColor: '#3f9dff',
      textStyle: { color: '#eaf6ff', fontSize: 13 },
      formatter: params => `${params[0]?.name}<br/>发布规则：<strong style="color:#5fd0ff">${params[0]?.value ?? 0}</strong> 条`,
    },
    xAxis: {
      type: 'value',
      min: 0,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#7fa3d0', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(60,110,190,.18)', type: 'dashed' } },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: data.map(item => item.name),
      axisLine: { lineStyle: { color: 'rgba(80,140,220,.6)' } },
      axisTick: { show: false },
      axisLabel: { color: '#cfe6ff', fontSize: 12, width: 122, overflow: 'truncate' },
    },
    series: [{
      type: 'bar',
      barWidth: 16,
      data: data.map((item, index) => ({ value: item.value, itemStyle: {
        color: index < 3
          ? { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#287fe5' }, { offset: 1, color: '#70e4ff' }] }
          : { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#1656ad' }, { offset: 1, color: '#3ab8ed' }] },
        borderRadius: [0, 8, 8, 0],
        shadowColor: 'rgba(60,160,255,.5)',
        shadowBlur: 8,
      } })),
      label: { show: true, position: 'right', color: '#eaf6ff', fontSize: 12, fontWeight: 700 },
    }],
  }
})
</script>

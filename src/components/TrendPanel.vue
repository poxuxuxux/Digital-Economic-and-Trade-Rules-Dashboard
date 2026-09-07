<template>
  <div class="panel" id="trend">
    <div class="p-title"><span class="tag-icon"></span>全球规则年度趋势
      <span class="sub">全球数字经贸规则数量变化（单位：条）</span></div>
    <div class="chart"><EChart :option="option" /></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EChart from './EChart.vue'
import { stats } from '../store.js'

const axisStyle = {
  axisLine: { lineStyle: { color: 'rgba(80,140,220,.6)' } },
  axisTick: { show: false },
  axisLabel: { color: '#8fb8e6', fontSize: 12 },
  splitLine: { lineStyle: { color: 'rgba(60,110,190,.18)', type: 'dashed' } },
}

const option = computed(() => ({
  grid: { left: 44, right: 20, top: 30, bottom: 26 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: stats.value.years, boundaryGap: false, ...axisStyle, splitLine: { show: false } },
  yAxis: { type: 'value', ...axisStyle },
  series: [{
    type: 'line', data: stats.value.values, smooth: false,
    symbol: 'circle', symbolSize: 8,
    lineStyle: { width: 3, color: '#4fc3ff', shadowColor: 'rgba(80,180,255,.8)', shadowBlur: 12 },
    itemStyle: { color: '#0a2a5c', borderColor: '#5fd0ff', borderWidth: 2 },
    label: { show: true, color: '#a8d8ff', fontSize: 12, position: 'top', distance: 8 },
    areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: 'rgba(60,160,255,.45)' }, { offset: 1, color: 'rgba(20,60,140,0)' }] } },
  }],
}))
</script>

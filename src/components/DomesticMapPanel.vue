<template>
  <div class="panel" id="domesticMapPanel">
    <div class="map-banner">中国数字经贸规则分布地图</div>
    <div class="chart domestic-map-chart">
      <EChart v-if="ready" :option="option" />
    </div>
    <div v-if="loadError" class="domestic-map-error">地图数据加载失败，请检查地图资源后刷新</div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import EChart from './EChart.vue'
import { DOMESTIC_PROVINCES } from '../data/domesticDashboard.js'

const ready = ref(false)
const loadError = ref(false)

const values = computed(() => DOMESTIC_PROVINCES.map(item => ({
  name: item.province,
  value: item.count,
  policy: item.policy,
  standard: item.standard,
  law: item.law,
})))

function buildPieces(max) {
  const step = Math.max(1, Math.ceil(max / 5))
  const colors = ['#56e0ff', '#36b9f5', '#2388e4', '#1557ad', '#0d326c']
  const pieces = [{ min: step * 4, label: `${step * 4}+`, color: colors[0] }]
  for (let i = 3; i >= 1; i -= 1) {
    pieces.push({ min: step * i, max: step * (i + 1) - 1, label: `${step * i}-${step * (i + 1) - 1}`, color: colors[4 - i] })
  }
  pieces.push({ min: 1, max: step - 1, label: `1-${step - 1}`, color: colors[4] })
  pieces.push({ value: 0, label: '0', color: '#071d43' })
  return pieces
}

const option = computed(() => {
  const max = Math.max(...values.value.map(item => item.value))
  return {
    tooltip: {
      trigger: 'item',
      confine: true,
      backgroundColor: 'rgba(4,18,44,.96)',
      borderColor: '#3f9dff',
      borderWidth: 1,
      textStyle: { color: '#eaf6ff', fontSize: 13 },
      formatter: params => {
        const d = params.data || {}
        return `<b>${params.name}</b><br/>规则总量：<strong style="color:#5fd0ff">${d.value ?? 0}</strong><br/>政策：${d.policy ?? 0}&nbsp;&nbsp;标准：${d.standard ?? 0}&nbsp;&nbsp;法律：${d.law ?? 0}`
      },
    },
    visualMap: {
      type: 'piecewise',
      left: 18,
      bottom: 14,
      orient: 'vertical',
      itemWidth: 14,
      itemHeight: 10,
      itemGap: 5,
      pieces: buildPieces(max),
      textStyle: { color: '#a8c8ee', fontSize: 11 },
      borderColor: 'rgba(70,140,240,.35)',
      backgroundColor: 'rgba(4,18,44,.45)',
      padding: [8, 10],
      selectedMode: false,
    },
    series: [{
      name: '规则数量',
      type: 'map',
      map: 'china',
      // Keep the complete China map in the initial viewport, while allowing
      // users to pan and zoom into provinces for inspection.
      roam: true,
      scaleLimit: { min: 0.85, max: 3.5 },
      layoutCenter: ['50%', '48%'],
      layoutSize: '100%',
      zoom: 1,
      top: 32,
      bottom: 14,
      left: 18,
      right: 18,
      data: values.value,
      label: { show: false },
      itemStyle: {
        areaColor: '#0a2856',
        borderColor: '#4b91dc',
        borderWidth: 0.8,
        shadowColor: 'rgba(30,130,255,.6)',
        shadowBlur: 10,
      },
      emphasis: {
        label: { show: true, color: '#ffffff', fontSize: 11 },
        itemStyle: { areaColor: '#62ddff', borderColor: '#d4f7ff', borderWidth: 1.2, shadowColor: '#5fd0ff', shadowBlur: 20 },
      },
    }],
  }
})

onMounted(async () => {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'china.json')
    if (!response.ok) throw new Error(`china.json: ${response.status}`)
    echarts.registerMap('china', await response.json())
    ready.value = true
  } catch (error) {
    console.error(error)
    loadError.value = true
  }
})
</script>

<style scoped>
.domestic-map-chart { top: 48px; }
.domestic-map-error { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #5c7fae; font-size: 14px; }
</style>

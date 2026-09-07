<template>
  <div class="panel" id="mapPanel">
    <div class="map-banner">全球数字贸易规则分布地图</div>
    <div class="chart" style="top:54px;">
      <EChart v-if="option" :option="option" />
    </div>
    <div v-if="loadError" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#5c7fae;font-size:14px;">
      地图数据加载失败，请检查网络连接后刷新
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import EChart from './EChart.vue'

const option = ref(null)
const loadError = ref(false)

onMounted(async () => {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'world.json')
    const world = await res.json()
    echarts.registerMap('world', world)
    option.value = {
      tooltip: { trigger: 'item' },
      geo: {
        map: 'world', top: 40, bottom: 10, left: 10, right: 10,
        silent: false, zoom: 1.05,
        itemStyle: { areaColor: '#0d2f63', borderColor: '#2f6fc0', borderWidth: 0.7,
          shadowColor: 'rgba(30,100,220,.6)', shadowBlur: 14 },
        emphasis: { label: { show: false }, itemStyle: { areaColor: '#1c4f9e' } },
      },
      series: [{
        type: 'effectScatter', coordinateSystem: 'geo',
        data: [],
        symbolSize: 10, rippleEffect: { brushType: 'stroke', scale: 3.5 },
        itemStyle: { color: '#3fe0ff', shadowColor: '#3fe0ff', shadowBlur: 14 },
        label: { show: true, position: 'top', distance: 10,
          formatter: p => `{n|${p.name}}\n{v|${p.value}}`,
          rich: {
            n: { color: '#dceeff', fontSize: 17, fontWeight: 700, align: 'center',
                 textBorderColor: 'rgba(4,18,44,.9)', textBorderWidth: 3, lineHeight: 24 },
            v: { color: '#3fe0ff', fontSize: 26, fontWeight: 800, align: 'center',
                 textBorderColor: 'rgba(4,18,44,.9)', textBorderWidth: 3,
                 textShadowColor: 'rgba(60,200,255,.9)', textShadowBlur: 12 },
          } },
        zlevel: 2,
      }],
    }
  } catch (e) {
    loadError.value = true
  }
})
</script>

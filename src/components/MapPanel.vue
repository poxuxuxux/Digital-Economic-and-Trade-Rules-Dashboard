<template>
  <div class="panel" id="mapPanel">
    <div class="map-banner">全球数字贸易规则分布地图</div>
    <div class="map-tabs">
      <span v-for="t in TYPES" :key="t.k" class="map-tab"
            :class="{ active: cur === t.k }" @click="cur = t.k">{{ t.label }}</span>
    </div>
    <div class="chart" style="top:54px;">
      <EChart v-if="option" :option="option" @chart-click="onClick" />
    </div>
    <span v-if="focus" class="map-focus-hint" @click="focus = null">已聚焦：{{ focus }} ✕</span>
    <div v-if="loadError" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#5c7fae;font-size:14px;">
      地图数据加载失败，请检查网络连接后刷新
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import EChart from './EChart.vue'
import { COOP_NODES, MAP_LINKS } from '../data/coopMap.js'

const TYPES = [
  { k: 'all', label: '全部' },
  { k: 'bilateral', label: '双边' },
  { k: 'multilateral', label: '多边' },
]
const cur = ref('all')
const focus = ref(null)
const ready = ref(false)
const loadError = ref(false)

/* 点击节点 → 聚焦（只显示与其相连的节点与连线）；点空白/再点一次 → 恢复 */
function onClick(params) {
  if (params && params.componentType === 'series' && params.seriesType === 'effectScatter') {
    focus.value = focus.value === params.name ? null : params.name
  } else {
    focus.value = null
  }
}

const coordByName = Object.fromEntries(COOP_NODES.map(n => [n.name, n.coord]))
const linksOfType = type => MAP_LINKS
  .filter(l => l.type === type)
  .map(l => ({ fromName: l.from, toName: l.to, name: l.label, coords: [coordByName[l.from], coordByName[l.to]] }))
  .filter(l => l.coords.every(Boolean))

const option = computed(() => {
  if (!ready.value) return null
  const show = t => cur.value === 'all' || cur.value === t
  const f = focus.value
  const neighbors = new Set()
  if (f) MAP_LINKS.forEach(l => {
    if (l.from === f) neighbors.add(l.to)
    if (l.to === f) neighbors.add(l.from)
  })
  return {
    tooltip: {
      trigger: 'item',
      formatter: p => p.seriesType === 'lines'
        ? `<b>${p.data.fromName}</b> ⇋ <b>${p.data.toName}</b><br/>${p.data.name ? p.data.name + '<br/>' : ''}${p.seriesName}`
        : p.name,
    },
    geo: {
      map: 'world', top: 40, bottom: 10, left: 10, right: 10,
      silent: false, zoom: 1.05,
      itemStyle: { areaColor: '#0d2f63', borderColor: '#2f6fc0', borderWidth: 0.7,
        shadowColor: 'rgba(30,100,220,.6)', shadowBlur: 14 },
      emphasis: { label: { show: false }, itemStyle: { areaColor: '#1c4f9e' } },
    },
    series: [
      {
        // 双边合作连线（蓝色实线）
        name: '双边合作', type: 'lines', coordinateSystem: 'geo', zlevel: 1,
        effect: { show: true, period: 4.5, trailLength: 0.35, symbol: 'circle', symbolSize: 4.5, color: '#8fe8ff' },
        lineStyle: { color: '#4fa8ff', width: 1.3, opacity: 0.4, curveness: 0.32,
          shadowColor: 'rgba(80,180,255,.55)', shadowBlur: 6 },
        data: show('bilateral') ? linksOfType('bilateral').filter(l => !f || l.fromName === f || l.toName === f) : [],
      },
      {
        // 多边机制连线（金色虚线，锚点为机制总部/秘书处）
        name: '多边机制', type: 'lines', coordinateSystem: 'geo', zlevel: 1,
        effect: { show: true, period: 5, trailLength: 0.35, symbol: 'circle', symbolSize: 4.5, color: '#ffe08a' },
        lineStyle: { color: '#ffb02e', width: 1.3, opacity: 0.45, curveness: 0.28, type: 'dashed',
          shadowColor: 'rgba(255,190,60,.5)', shadowBlur: 6 },
        data: show('multilateral') ? linksOfType('multilateral').filter(l => !f || l.fromName === f || l.toName === f) : [],
      },
      {
        // 国家（蓝）/ 机制（金）光点（聚焦时只显示焦点+相连节点）
        type: 'effectScatter', coordinateSystem: 'geo', zlevel: 2,
        data: COOP_NODES
          .filter(n => !f || n.name === f || neighbors.has(n.name))
          .map(n => ({
            name: n.name, value: n.coord,
            symbolSize: n.name === f ? 12 : (n.org ? 9 : 7),
            itemStyle: n.name === f
              ? { color: '#ffffff', borderColor: '#5fd0ff', borderWidth: 2, shadowColor: '#5fd0ff', shadowBlur: 16 }
              : (n.org
                ? { color: '#ffb02e', shadowColor: '#ffcf5e', shadowBlur: 12 }
                : { color: '#3fe0ff', shadowColor: '#3fe0ff', shadowBlur: 12 }),
            label: { position: n.org ? 'top' : 'right', fontWeight: n.name === f ? 700 : 400 },
          })),
        rippleEffect: { brushType: 'stroke', scale: 3 },
        label: { show: true, distance: 4, formatter: '{b}',
          color: '#dceeff', fontSize: 11,
          textBorderColor: 'rgba(4,18,44,.9)', textBorderWidth: 2 },
      },
    ],
  }
})

onMounted(async () => {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'world.json')
    const world = await res.json()
    echarts.registerMap('world', world)
    ready.value = true
  } catch (e) {
    loadError.value = true
  }
})
</script>

<style scoped>
.map-tabs { position: absolute; top: 16px; right: 14px; display: flex; gap: 6px; z-index: 3; }
.map-tab { text-align: center; height: 24px; line-height: 22px; padding: 0 14px; font-size: 12.5px;
  color: #9fc2ee; border: 1px solid rgba(60,130,230,.45); border-radius: 12px;
  cursor: pointer; background: rgba(8,26,60,.45); transition: all .2s; user-select: none; white-space: nowrap; }
.map-tab:hover { color: #fff; }
.map-tab.active { color: #04122c; font-weight: 700;
  background: linear-gradient(180deg, #6ec1ff, #1f7ae0); border-color: #7cc4ff;
  box-shadow: 0 0 10px rgba(80,170,255,.55); }
.map-focus-hint { position: absolute; left: 14px; top: 16px; z-index: 3; height: 24px; line-height: 22px;
  padding: 0 12px; font-size: 12.5px; color: #ffd88a; border: 1px dashed rgba(255,190,60,.6);
  border-radius: 12px; background: rgba(60,40,8,.5); cursor: pointer; user-select: none; }
.map-focus-hint:hover { color: #fff; border-color: #ffd88a; }
</style>

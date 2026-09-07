<template>
  <div id="stage" ref="stage">
    <AppHeader />
    <Toolbar />
    <ResultPage />
    <AdvSearch />

    <div class="main">
      <OverviewPanel />
      <TrendPanel />
      <RankPanel />
      <MapPanel />
      <HotspotPanel />
      <NetworkPanel />
      <NewsPanel />
      <ImpactPanel />
      <ObservePanel />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppHeader from './components/AppHeader.vue'
import Toolbar from './components/Toolbar.vue'
import ResultPage from './components/ResultPage.vue'
import AdvSearch from './components/AdvSearch.vue'
import OverviewPanel from './components/OverviewPanel.vue'
import TrendPanel from './components/TrendPanel.vue'
import RankPanel from './components/RankPanel.vue'
import MapPanel from './components/MapPanel.vue'
import HotspotPanel from './components/HotspotPanel.vue'
import NetworkPanel from './components/NetworkPanel.vue'
import NewsPanel from './components/NewsPanel.vue'
import ImpactPanel from './components/ImpactPanel.vue'
import ObservePanel from './components/ObservePanel.vue'

const stage = ref(null)

function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080)
  stage.value.style.transform = `scale(${s})`
  stage.value.style.left = (innerWidth - 1920 * s) / 2 + 'px'
  stage.value.style.top = (innerHeight - 1080 * s) / 2 + 'px'
}

onMounted(() => { fit(); addEventListener('resize', fit) })
onBeforeUnmount(() => removeEventListener('resize', fit))
</script>

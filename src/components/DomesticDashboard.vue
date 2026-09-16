<template>
  <div class="main domestic-main">
    <div class="domestic-side domestic-left">
      <OverviewPanel />
      <TrendPanel />
    </div>
    <div class="domestic-center-column">
      <DomesticMapPanel />
      <NewsPanel />
    </div>
    <div class="domestic-side domestic-right">
      <PublisherPanel />
      <PolicyPanel />
    </div>
  </div>
</template>

<script setup>
import OverviewPanel from './OverviewPanel.vue'
import TrendPanel from './TrendPanel.vue'
import DomesticMapPanel from './DomesticMapPanel.vue'
import NewsPanel from './NewsPanel.vue'
import PublisherPanel from './PublisherPanel.vue'
import PolicyPanel from './PolicyPanel.vue'
</script>

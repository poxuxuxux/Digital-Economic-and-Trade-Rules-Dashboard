<template>
  <div class="panel" id="policy">
    <div class="p-title"><span class="tag-icon"></span>政策解读<span class="ob-issue">（{{ currentIndex + 1 }}/{{ items.length }}）</span></div>
    <span class="arrow left" @click="step(-1)">‹</span>
    <div class="policy-card">
      <div class="policy-kicker">重点内容阅读</div>
      <h4>{{ current.title }}</h4>
      <p>{{ current.summary }}</p>
      <div class="policy-meta">{{ current.publishDate }}</div>
      <div class="policy-tags">
        <span v-for="tag in current.tags" :key="tag" class="policy-tag">{{ tag }}</span>
      </div>
    </div>
    <span class="arrow right" @click="step(1)">›</span>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { POLICY_INTERPRETATIONS } from '../data/domesticDashboard.js'

const items = POLICY_INTERPRETATIONS
const currentIndex = ref(0)
const current = computed(() => items[currentIndex.value])
let timer = null

function step(delta) {
  currentIndex.value = (currentIndex.value + delta + items.length) % items.length
}

onMounted(() => { timer = setInterval(() => step(1), 7000) })
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.policy-card { position: absolute; left: 36px; right: 36px; top: 48px; bottom: 22px; padding: 16px 18px;
  background: linear-gradient(180deg, rgba(18,52,112,.5), rgba(8,24,58,.6));
  border: 1px solid rgba(110,170,255,.4); border-radius: 12px; color: #cfe0f5; }
.policy-kicker { color: #5fd0ff; font-size: 12px; letter-spacing: 2px; margin-bottom: 12px; }
.policy-card h4 { color: #fff; font-size: 17px; line-height: 1.45; margin-bottom: 12px; }
.policy-card p { color: #cfe0f5; font-size: 13.5px; line-height: 1.75; text-align: justify; }
.policy-meta { position: absolute; left: 18px; bottom: 16px; color: #8fb8e6; font-size: 12.5px; }
.policy-tags { position: absolute; right: 18px; bottom: 13px; display: flex; gap: 6px; }
.policy-tag { color: #bfe0ff; background: rgba(40,110,210,.35); border: 1px solid rgba(90,160,255,.5); border-radius: 10px; padding: 1px 9px; font-size: 12px; }
</style>

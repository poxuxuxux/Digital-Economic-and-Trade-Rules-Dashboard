<template>
  <div class="panel" id="observe">
    <div class="p-title"><span class="tag-icon"></span>数字经贸规则观察<span class="ob-issue">（第1期）</span></div>
    <span class="arrow left" @click="step(-1)">‹</span>
    <div class="ob-body" ref="bodyEl" @mouseenter="pause" @mouseleave="resume">
      <h4>{{ item.value + 1 }}. {{ current.title }}<span class="ocat">{{ current.cat }}</span></h4>
      <p>{{ current.body }}</p>
    </div>
    <span class="arrow right" @click="step(1)">›</span>
    <div class="ob-foot">
      <div class="cats">
        <div v-for="c in cats" :key="c" class="cat-btn" :class="{ active: c === current.cat }" @click="jump(c)">{{ c }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { OBSERVES } from '../data/dashboard.js'

const issue = OBSERVES[0]
const item = ref(0)
const bodyEl = ref(null)
const current = computed(() => issue.items[item.value])
const cats = computed(() => {
  const s = []
  issue.items.forEach(it => { if (!s.includes(it.cat)) s.push(it.cat) })
  return s
})

let timer = null
function step(d) {
  const n = issue.items.length
  item.value = (item.value + d + n) % n
  syncScroll()
}
function jump(c) {
  const idx = issue.items.findIndex(it => it.cat === c)
  if (idx >= 0) { item.value = idx; syncScroll() }
}
function syncScroll() { nextTick(() => { if (bodyEl.value) bodyEl.value.scrollTop = 0 }) }
function reset() { clearInterval(timer); timer = setInterval(() => step(1), 6000) }
function pause() { clearInterval(timer) }
function resume() { reset() }

onMounted(reset)
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="toolbar">
    <div class="t-btn" :class="{ active: store.range === 3 }" @click="setRange(3)">近3年</div>
    <div class="t-btn" :class="{ active: store.range === 5 }" @click="setRange(5)">近5年</div>
    <div class="t-btn" :class="{ active: store.range === 10 }" @click="setRange(10)">近10年</div>
    <div class="t-btn" :class="{ active: store.range === 'all' }" @click="setRange('all')">全部年份</div>

    <div class="search">
      <div class="search-scope" :class="{ open: scopeOpen }" @click="toggleScope">
        <span>{{ scopeLabel }}</span><span class="caret">▼</span>
        <div class="scope-menu">
          <div v-for="f in scopeOpts" :key="f.k" class="scope-opt"
               :class="{ active: curField === f.k }" @click.stop="pickField(f)">{{ f.label }}</div>
        </div>
      </div>
      <span class="icon" @click="doSearch">🔍</span>
      <input type="text" v-model="kw" @keydown.enter="doSearch" @input="onInput"
             :placeholder="`请输入${scopeLabel}关键字，按回车检索`" />
      <span class="clear" :class="{ show: !!kw }" @click="clearKw">✕</span>
      <span class="adv" @click="store.advVisible = true">高级搜索</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, setRange, quickSearch, closeResult } from '../store.js'

const scopeOpts = [
  { k: 'title', label: '标题' },
  { k: 'field', label: '议题领域' },
  { k: 'summary', label: '摘要' },
  { k: 'keywords', label: '关键词' },
  { k: 'full', label: '全文' },
]
const curField = ref('title')
const scopeOpen = ref(false)
const kw = ref('')

const scopeLabel = computed(() => scopeOpts.find(f => f.k === curField.value)?.label || '标题')

function toggleScope() { scopeOpen.value = !scopeOpen.value }
function pickField(f) {
  curField.value = f.k
  scopeOpen.value = false
  doSearch()
}
function doSearch() { quickSearch(kw.value, curField.value) }
function onInput() { if (!kw.value.trim()) closeResult() }
function clearKw() { kw.value = ''; closeResult() }
</script>

<template>
  <div class="result-page" :class="{ show: store.resultVisible }">
    <div class="rp-head">
      <span class="rp-back" @click="closeResult">‹ 返回</span>
      <div class="rp-title">检索结果</div>
      <div class="rp-sort">排序选项：
        <span class="rp-sort-opt" :class="{ active: store.resultSort === 'rel' }" @click="setSort('rel')">相关性</span>
        <span class="rp-sort-opt" :class="{ active: store.resultSort === 'date' }" @click="setSort('date')">发布时间</span>
      </div>
    </div>
    <div class="rp-cond" v-html="condHtml"></div>
    <div class="rp-main">
      <div class="rp-filter">
        <div class="rp-filter-title">筛选</div>
        <div class="rp-facet" v-for="f in RP_FACETS" :key="f.key" v-show="valList(f.key).length">
          <div class="rp-facet-name">{{ f.label }}</div>
          <div v-for="v in valList(f.key)" :key="v"
               class="rp-f-opt" :class="{ on: (store.resultState[f.key] || []).includes(v) }"
               @click="toggle(f.key, v)">
            <span class="box">✓</span><span>{{ v }}</span>
            <span class="cnt">{{ cnt(f.key, v) }}</span>
          </div>
        </div>
      </div>
      <div class="rp-list">
        <div class="rp-item" v-for="(it, i) in resultView" :key="i">
          <div>
            <span class="rp-en" v-html="hi(it.en || '', store.resultKw)"></span>
            <span class="rp-cn" v-html="hi(it.t, store.resultKw)"></span>
          </div>
          <div class="rp-tags">
            <span class="rp-tag">{{ it.date || '—' }}</span>
            <span class="rp-tag st">{{ it.status || '' }}</span>
          </div>
          <div class="rp-body" v-html="hi(it.summary || '', store.resultKw)"></div>
        </div>
        <div v-if="!resultView.length" class="rp-empty">没有符合筛选条件的结果</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, resultView, facetVals, hi, closeResult, RP_FACETS } from '../store.js'
import { RP_GET } from '../data/dashboard.js'

const condHtml = computed(() =>
  store.resultCond
    ? `检索条件：${store.resultCond}　|　命中 <b>${store.resultList.length}</b> 条结果`
    : `命中 <b>${store.resultList.length}</b> 条结果`)

const valList = (k) => facetVals(k)
const cnt = (k, v) => store.resultList.filter(it => RP_GET[k](it) === v).length

function toggle(k, v) {
  const arr = store.resultState[k] || []
  const i = arr.indexOf(v)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(v)
  store.resultState[k] = [...arr]
}
function setSort(s) { store.resultSort = s }
</script>

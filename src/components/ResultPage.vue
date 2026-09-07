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
        <div class="rp-item" v-for="(it, i) in resultView" :key="i" @click="detail = it">
          <div>
            <span class="rp-en" v-html="hi(it.en || '', store.resultKw)"></span>
            <span class="rp-cn" v-html="hi(it.t, store.resultKw)"></span>
          </div>
          <div class="rp-tags">
            <span class="rp-tag">{{ it.date || '—' }}</span>
            <span class="rp-tag">{{ it.ruleType || '' }}</span>
            <span class="rp-tag st">{{ it.status || '' }}</span>
            <span class="rp-more">查看详情 ›</span>
          </div>
          <div class="rp-body" v-html="brief(it.summary, store.resultKw)"></div>
        </div>
        <div v-if="!resultView.length" class="rp-empty">没有符合筛选条件的结果</div>
      </div>
    </div>

    <!-- 详情弹窗：展示表格中该行的全部信息 -->
    <div class="rp-detail" :class="{ show: detail }" @click="detail = null">
      <div class="rp-detail-box" v-if="detail" @click.stop>
        <div class="rp-detail-head">
          <span class="tag-icon"></span><span>规则详情</span>
          <div class="rp-detail-right">
            <div class="rp-lang" v-if="detail.from === 'rule'">
              <span class="rp-lang-opt" :class="{ on: lang === 'cn' }" @click="lang = 'cn'">中文</span>
              <span class="rp-lang-opt" :class="{ on: lang === 'en' }" @click="lang = 'en'">英文</span>
            </div>
            <span class="rp-detail-close" @click="detail = null">✕</span>
          </div>
        </div>
        <div class="rp-detail-body">
          <div class="rp-d-title">
            <div class="rp-en" v-html="hi(detail.en || '', store.resultKw)"></div>
            <div class="rp-cn" v-html="hi(detail.t || '', store.resultKw)"></div>
          </div>
          <div class="rp-d-row" v-for="(r, i) in rows" :key="i">
            <div class="rp-d-k">{{ r[0] }}</div>
            <div class="rp-d-v">
              <a v-if="r[2] === 'link' && r[1]" :href="r[1]" target="_blank" rel="noopener">{{ r[1] }}</a>
              <span v-else v-html="hi(r[1] || '—', store.resultKw)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, resultView, facetVals, hi, closeResult, RP_FACETS } from '../store.js'
import { RP_GET } from '../data/dashboard.js'

const condHtml = computed(() =>
  store.resultCond
    ? `检索条件：${store.resultCond}　|　命中 <b>${store.resultList.length}</b> 条结果`
    : `命中 <b>${store.resultList.length}</b> 条结果`)

const valList = (k) => facetVals(k)
const cnt = (k, v) => store.resultList.filter(it => RP_GET[k](it) === v).length

/* 摘要只显示前 BRIEF_LEN 字，超出加省略号 */
const BRIEF_LEN = 130
function brief(s, kw) {
  const t = s || ''
  return t.length > BRIEF_LEN ? hi(t.slice(0, BRIEF_LEN), kw) + '……' : hi(t, kw)
}

/* 详情：取该行在表格中的全部字段（国际组织规则取原始记录，案例取检索项字段）
   摘要/评估支持中文/英文（原文）切换，英文缺失时回退显示中文 */
const detail = ref(null)
const lang = ref('cn')
const rows = computed(() => {
  const it = detail.value
  if (!it) return []
  if (it.from === 'rule' && it.src) {
    const s = it.src
    const pick = (cn, en) => (lang.value === 'en' && en) ? en : cn
    return [
      ['国际组织', s.org],
      ['文件名称（英文）', s.en],
      ['文件名称（中文）', s.cn],
      ['发布日期', s.date],
      ['生效日期', s.effDate],
      ['文件类型', s.fileType],
      ['议题领域', s.field],
      ['核心内容摘要', pick(s.summary, s.summaryEn)],
      ['利益影响评估', pick(s.impact, s.impactEn)],
      ['官方原文链接', s.link, 'link'],
    ]
  }
  return [
    ['类型', it.type],
    ['标题（中文）', it.t],
    ['标题（英文）', it.en],
    ['议题领域', it.field],
    ['发布日期', it.date],
    ['文件类型', it.ruleType],
    ['发布机构', it.publisher],
    ['所属区域', it.region],
    ['法律约束力', it.law],
    ['规则层级', it.level],
    ['状态', it.status],
    ['关键词', it.kw],
    ['摘要', it.summary],
  ]
})

function toggle(k, v) {
  const arr = store.resultState[k] || []
  const i = arr.indexOf(v)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(v)
  store.resultState[k] = [...arr]
}
function setSort(s) { store.resultSort = s }
</script>

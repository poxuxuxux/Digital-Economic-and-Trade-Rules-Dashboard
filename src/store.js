import { reactive, computed } from 'vue'
import {
  TREND, statsAll, statsForYears, SEARCH_POOL, FIELDS, FIELD_GET,
  RP_FACETS, RP_GET,
} from './data/dashboard.js'

export const store = reactive({
  range: 'all',        // number(近N年) | 'all'
  scope: 'global',     // 'global' | 'domestic'
  // 检索结果展示页
  resultVisible: false,
  resultList: [],
  resultKw: '',
  resultCond: '',
  resultSort: 'rel',
  resultState: {},     // 各 facet 选中的值
  // 高级检索屏
  advVisible: false,
})

/* 随年份范围联动的派生统计 */
export const stats = computed(() => {
  if (store.range === 'all') return statsAll()
  return statsForYears(TREND.years.slice(-(+store.range)))
})
export function setRange(r) { store.range = r }

/* HTML 转义 + 关键词高亮 */
export const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
export function hi(s, kw) {
  const safe = esc(s)
  if (!kw) return safe
  return safe.replace(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<mark>${m}</mark>`)
}

/* 打开 / 关闭结果页 */
export function openResult(res, kw, cond) {
  store.resultList = res
  store.resultKw = kw
  store.resultCond = cond || ''
  store.resultSort = 'rel'
  store.resultState = {}
  store.resultVisible = true
}
export function closeResult() { store.resultVisible = false }

/* 快速检索（顶部搜索框） */
export function quickSearch(kw, field) {
  const k = (kw || '').trim().toLowerCase()
  if (!k) { closeResult(); return }
  const res = SEARCH_POOL.filter(it => FIELDS[field].get(it).toLowerCase().includes(k))
  openResult(res, kw.trim(), FIELDS[field].label)
}

/* 高级检索（多行 AND/OR/NOT + 时间范围） */
export function advSearch(rows, ds, de) {
  let res = SEARCH_POOL
  rows.forEach((r, i) => {
    const matched = SEARCH_POOL.filter(it => {
      const v = (FIELD_GET[r.field](it) || '').toString().toLowerCase()
      if (!v) return false
      const q = r.value.toLowerCase()
      return r.mode === '精确' ? v === q : v.includes(q)
    })
    const set = new Set(matched)
    if (i === 0 || r.logic === 'AND') res = i === 0 ? matched : res.filter(x => set.has(x))
    else if (r.logic === 'OR') res = [...new Set([...res, ...matched])]
    else res = res.filter(x => !set.has(x))   // NOT
  })
  if (ds) res = res.filter(it => it.date && it.date >= ds)
  if (de) res = res.filter(it => it.date && it.date <= de)
  const kw = rows[0]?.value || ''
  const cond = rows.length
    ? rows.map((r, i) => `${i > 0 ? r.logic + ' ' : ''}${r.label}${r.mode === '精确' ? '＝' : '含'}「${r.value}」`).join(' ')
    : '全部条件'
  openResult(res, kw, cond)
}

/* 结果页列表（facet 过滤 + 排序） */
function score(it) {
  if (!store.resultKw) return 0
  let s = 0; const q = store.resultKw.toLowerCase()
  if (it.t.toLowerCase().includes(q)) s += 3
  if (it.kw.toLowerCase().includes(q)) s += 2
  if ((it.summary || '').toLowerCase().includes(q)) s += 1
  return s
}
export const resultView = computed(() =>
  store.resultList
    .filter(it => Object.entries(store.resultState).every(([k, vals]) => !vals.length || vals.includes(RP_GET[k](it))))
    .sort((a, b) => store.resultSort === 'date' ? (b.date || '').localeCompare(a.date || '') : score(b) - score(a))
)
export function facetVals(key) {
  const s = new Set()
  store.resultList.forEach(it => { const v = RP_GET[key](it); if (v) s.add(v) })
  return [...s].sort()
}
export { RP_FACETS }

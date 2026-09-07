/* ============================================================
 * 数据构建脚本：Excel「国际组织」工作表 → rules_data.json → src/data/rules.js
 *
 * 用法：在 大屏/ 目录下执行  node scripts/build_data.mjs
 * （自动在 本目录 和 上一级目录 查找 .xlsx）
 *
 * 与旧 extract.py 的差异：
 *  - 按工作表名（国际组织）定位，不再硬编码 sheet4
 *  - 抽取前先校验表头，列错位会直接报错而不是静默出错
 *  - 摘要/影响评估不再截断（旧的截 220/300 字导致显示不全）
 *  - 新增英文原文列：summaryEn（核心内容摘录·原文）、impactEn（利益影响评估·原文）
 * ============================================================ */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import zlib from 'zlib'
import path from 'path'

/* ---------- 纯 Node 读取 zip（xlsx 本质是 zip） ---------- */
function readZip(file) {
  const buf = readFileSync(file)
  let eocd = -1
  for (let i = buf.length - 22; i >= 0; i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break }
  if (eocd < 0) throw new Error('不是合法的 zip/xlsx 文件')
  const count = buf.readUInt16LE(eocd + 10)
  let off = buf.readUInt32LE(eocd + 16)
  const entries = {}
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) throw new Error('zip 中央目录损坏')
    const method = buf.readUInt16LE(off + 10)
    const csize = buf.readUInt32LE(off + 20)
    const nameLen = buf.readUInt16LE(off + 28), extraLen = buf.readUInt16LE(off + 30), cmtLen = buf.readUInt16LE(off + 32)
    const lho = buf.readUInt32LE(off + 42)
    const name = buf.slice(off + 46, off + 46 + nameLen).toString('utf8')
    const lnLen = buf.readUInt16LE(lho + 26), leLen = buf.readUInt16LE(lho + 28)
    const data = buf.slice(lho + 30 + lnLen + leLen, lho + 30 + lnLen + leLen + csize)
    entries[name] = method === 0 ? data : zlib.inflateRawSync(data)
    off += 46 + nameLen + extraLen + cmtLen
  }
  return entries
}

const decodeXml = s => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
const colToIdx = ref => { let idx = 0; for (const ch of /^([A-Z]+)/.exec(ref)[1]) idx = idx * 26 + (ch.charCodeAt(0) - 64); return idx - 1 }
const norm = s => String(s ?? '').replace(/\s+/g, ' ').trim()

/* Excel 日期序列号 → ISO 日期（1900 日期系统，以 1899-12-30 为基准） */
function parseDate(v) {
  if (v == null || v === '') return ''
  const s = String(v).trim()
  if (/^\d+(\.0+)?$/.test(s)) {
    const n = parseInt(parseFloat(s))
    if (n > 20000 && n < 60000) return new Date(Date.UTC(1899, 11, 30) + n * 86400000).toISOString().slice(0, 10)
    return ''
  }
  const m = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(s)
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
  return ''
}

/* ---------- 定位 xlsx ---------- */
const roots = [import.meta.dirname, path.join(import.meta.dirname, '..'), path.join(import.meta.dirname, '..', '..')]
let xlsxPath = null
for (const r of roots) {
  const hit = readdirSync(r).filter(f => f.toLowerCase().endsWith('.xlsx') && !f.startsWith('~$'))
  if (hit.length) { xlsxPath = path.join(r, hit[0]); break }
}
if (!xlsxPath) { console.error('未找到 xlsx 文件（在 scripts/ 与项目根目录）'); process.exit(1) }
console.log('源文件:', xlsxPath)

const zip = readZip(xlsxPath)

/* ---------- 共享字符串 ---------- */
const shared = []
if (zip['xl/sharedStrings.xml']) {
  const xml = zip['xl/sharedStrings.xml'].toString('utf8')
  const sis = xml.match(/<si>[\s\S]*?<\/si>/g) || []
  for (const si of sis) {
    const body = si.replace(/<rPh>[\s\S]*?<\/rPh>/g, '')   // 去掉注音文本
    const ts = body.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || []
    shared.push(decodeXml(ts.map(t => t.replace(/^<t[^>]*>/, '').replace(/<\/t>$/, '')).join('')))
  }
}

/* ---------- 按名称定位「国际组织」工作表 ---------- */
const rels = {}
for (const m of zip['xl/_rels/workbook.xml.rels'].toString('utf8').matchAll(/<Relationship\b([^>]*?)\/?>/g)) {
  const id = /Id="([^"]+)"/.exec(m[1]), tgt = /Target="([^"]+)"/.exec(m[1])
  if (id && tgt) rels[id[1]] = tgt[1]
}
let sheetTarget = null
for (const m of zip['xl/workbook.xml'].toString('utf8').matchAll(/<sheet\b([^>]*?)\/?>/g)) {
  const name = decodeXml(/name="([^"]+)"/.exec(m[1])?.[1] ?? '')
  const rid = (/r:id="([^"]+)"/.exec(m[1]) || /id="([^"]+)"/.exec(m[1]))?.[1]
  if (name === '国际组织' && rid) {
    sheetTarget = rels[rid]
    if (sheetTarget && !sheetTarget.startsWith('xl/')) sheetTarget = 'xl/' + sheetTarget.replace(/^\//, '')
  }
}
if (!sheetTarget) { console.error('未找到名为「国际组织」的工作表'); process.exit(1) }

/* ---------- 解析行 ---------- */
const rows = []
// 注意：<c ... /> 自闭合空单元格必须单独匹配，否则会吞掉其后相邻的真实单元格
for (const rb of zip[sheetTarget].toString('utf8').match(/<row\b[^>]*\/>|<row\b[^>]*>[\s\S]*?<\/row>/g) || []) {
  const cells = {}
  for (const cb of rb.match(/<c\b[^>]*\/>|<c\b[^>]*>[\s\S]*?<\/c>/g) || []) {
    const attr = /^<c\b([^>]*)>/.exec(cb)[1]
    const ref = /r="([A-Z]+\d+)"/.exec(attr)?.[1]
    if (!ref) continue
    const t = /t="([^"]+)"/.exec(attr)?.[1]
    const v = /<v>([\s\S]*?)<\/v>/.exec(cb)?.[1]
    const isEl = /<is>([\s\S]*?)<\/is>/.exec(cb)?.[1]
    let val = ''
    if (t === 's' && v != null) val = shared[parseInt(v, 10)] ?? ''
    else if (isEl) {
      const body = isEl.replace(/<rPh>[\s\S]*?<\/rPh>/g, '')
      val = (body.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || []).map(x => x.replace(/^<t[^>]*>/, '').replace(/<\/t>$/, '')).join('')
    } else if (v != null) val = v
    cells[colToIdx(ref)] = decodeXml(val)
  }
  rows.push(Object.values(cells).some(x => x) ? cells : {})
}

/* ---------- 表头校验（第 3 行，防列错位） ---------- */
const header = rows[2] || {}
const EXPECT = { 0: '国际组织', 1: '文件名称（英文', 2: '文件名称（中文', 3: '发布日期', 4: '生效日期', 8: '议题领域', 9: '核心内容摘要', 11: '利益影响评估', 13: '官方原文链接' }
for (const [i, name] of Object.entries(EXPECT)) {
  if (!String(header[i] || '').startsWith(name)) {
    console.error(`表头校验失败：第 ${+i + 1} 列应为「${name}」，实际为「${header[i] || '(空)'}」—— Excel 列结构可能已调整，请核对脚本列映射`)
    process.exit(1)
  }
}

/* ---------- 记录映射（跳过前 3 行） ---------- */
const C = i => norm(header[i])   // 仅用于表头展示
const records = []
for (const cells of rows.slice(3)) {
  const g = i => norm(cells[i])
  const en = g(1), cn = g(2)
  if (!en && !cn) continue
  records.push({
    org: g(0),
    en,
    cn,
    date: parseDate(cells[3]),
    effDate: parseDate(cells[4]),
    fileType: g(7),
    field: g(8),
    summary: g(9),        // 核心内容摘要（中文）—— 不截断
    summaryEn: g(10),     // 核心内容摘录（原文/英文）—— 新增
    impact: g(11),        // 利益影响评估（中文）—— 不截断
    impactEn: g(12),      // 利益影响评估（原文/英文）—— 新增
    link: g(13),
  })
}

/* ---------- 输出 ---------- */
const jsVal = v => JSON.stringify(v ?? '')
const lines = [
  `/* 自动生成：node scripts/build_data.mjs（源：Excel「国际组织」工作表，${records.length} 条记录）。请勿手工编辑本文件 */`,
  'export const RULES = [',
  ...records.map(r =>
    `  { org: ${jsVal(r.org)}, en: ${jsVal(r.en)}, cn: ${jsVal(r.cn)}, date: ${jsVal(r.date)}, effDate: ${jsVal(r.effDate)},`
    + ` fileType: ${jsVal(r.fileType)}, field: ${jsVal(r.field)}, summary: ${jsVal(r.summary)}, summaryEn: ${jsVal(r.summaryEn)},`
    + ` impact: ${jsVal(r.impact)}, impactEn: ${jsVal(r.impactEn)}, link: ${jsVal(r.link)} },`),
  '];',
  '',
]
writeFileSync(new URL('../src/data/rules.js', import.meta.url), lines.join('\n'), 'utf8')
writeFileSync(new URL('../rules_data.json', import.meta.url), JSON.stringify(records, null, 1), 'utf8')

const cnt = k => records.filter(r => r[k]).length
console.log('记录数:', records.length)
console.log('有中文摘要:', cnt('summary'), '| 有英文摘要:', cnt('summaryEn'), '| 有中文评估:', cnt('impact'), '| 有英文评估:', cnt('impactEn'), '| 无日期:', records.length - cnt('date'))
console.log('已生成: src/data/rules.js + rules_data.json')

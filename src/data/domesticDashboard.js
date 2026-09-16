/* 国内版大屏数据适配层。
 * 当前后端尚未提供国内接口，页面使用集中维护的 mock 数据；替换为 API 时只需替换本文件的导出。
 */

export const DOMESTIC_TREND = [
  { year: 2018, count: 32 },
  { year: 2019, count: 41 },
  { year: 2020, count: 56 },
  { year: 2021, count: 71 },
  { year: 2022, count: 84 },
  { year: 2023, count: 102 },
  { year: 2024, count: 126 },
  { year: 2025, count: 130 },
  { year: 2026, count: 43 },
]

const PROVINCE_COUNTS = [
  ['北京市', 48], ['天津市', 12], ['河北省', 24], ['山西省', 12], ['内蒙古自治区', 9],
  ['辽宁省', 18], ['吉林省', 8], ['黑龙江省', 10], ['上海市', 40], ['江苏省', 46],
  ['浙江省', 49], ['安徽省', 19], ['福建省', 25], ['江西省', 16], ['山东省', 44],
  ['河南省', 30], ['湖北省', 26], ['湖南省', 22], ['广东省', 59], ['广西壮族自治区', 13],
  ['海南省', 8], ['重庆市', 16], ['四川省', 36], ['贵州省', 12], ['云南省', 14],
  ['西藏自治区', 3], ['陕西省', 21], ['甘肃省', 8], ['青海省', 4], ['宁夏回族自治区', 6],
  ['新疆维吾尔自治区', 12], ['台湾省', 8], ['香港特别行政区', 5], ['澳门特别行政区', 2],
]

// 通过稳定的比例生成展示层的三类统计，后续接入真实接口时可直接替换为分类字段。
export const DOMESTIC_PROVINCES = PROVINCE_COUNTS.map(([province, count]) => {
  const policy = Math.round(count * 0.54)
  const standard = Math.round(count * 0.22)
  return { province, count, policy, standard, law: count - policy - standard }
})

export const DOMESTIC_PUBLISHERS = [
  { name: '国家互联网信息办公室', value: 86 },
  { name: '工业和信息化部', value: 71 },
  { name: '国家市场监督管理总局', value: 62 },
  { name: '商务部', value: 48 },
  { name: '国家发展和改革委员会', value: 42 },
  { name: '国家标准化管理委员会', value: 37 },
  { name: '北京市人民政府', value: 29 },
  { name: '上海市人民政府', value: 24 },
]

export const DOMESTIC_SCOPE_STATS = {
  centralDepartments: 12,
  coveredRegions: 31,
  localInstitutions: 68,
  nationalLevel: 286,
  localLevel: 399,
  annualNew: 43,
  activeRules: 642,
  jointPublished: 26,
}

export const DOMESTIC_LATEST_RULES = [
  { t: '《数据出境安全评估申报指南（2026年版）》', d: '2026-09-06', c: '政策', r: '国家互联网信息办公室' },
  { t: '《数字贸易标准体系建设指南》', d: '2026-08-28', c: '标准', r: '国家标准化管理委员会' },
  { t: '《平台经济领域数据合规指引》', d: '2026-08-20', c: '政策', r: '国家市场监督管理总局' },
  { t: '《个人信息保护法实施条例（修订草案）》', d: '2026-08-16', c: '法律', r: '国务院' },
  { t: '《跨境电商数据管理办法》', d: '2026-08-09', c: '政策', r: '商务部' },
  { t: '《电子商务数据质量要求》', d: '2026-07-30', c: '标准', r: '国家标准化管理委员会' },
]

export const POLICY_INTERPRETATIONS = [
  {
    id: 'data-security-law',
    title: '《数据安全法》重点内容解读',
    summary: '围绕数据分类分级保护、重要数据管理、数据跨境流动等内容，对相关制度进行系统梳理，帮助企业理解数据处理活动中的合规责任。',
    publishDate: '2026-08-12',
    tags: ['数据安全', '数据跨境'],
  },
  {
    id: 'personal-information',
    title: '个人信息保护合规要点解读',
    summary: '从处理规则、个人权利、敏感个人信息和跨境提供四个维度，梳理数字贸易业务中个人信息保护的重点要求与常见风险。',
    publishDate: '2026-07-26',
    tags: ['个人信息保护', '合规指南'],
  },
  {
    id: 'digital-trade',
    title: '数字贸易标准体系建设解读',
    summary: '聚焦电子单证、数字身份、数据流通和平台服务等重点领域，说明标准化建设对提升数字贸易透明度与可预期性的作用。',
    publishDate: '2026-07-08',
    tags: ['数字贸易', '标准体系'],
  },
]

const totalAll = DOMESTIC_TREND.reduce((sum, item) => sum + item.count, 0)

function breakdown(total) {
  const policy = Math.round(total * 0.54)
  const standard = Math.round(total * 0.22)
  return { total, policy, standard, law: total - policy - standard }
}

function buildStats(years) {
  const total = years.reduce((sum, year) => sum + (DOMESTIC_TREND.find(item => item.year === year)?.count || 0), 0)
  return {
    ...breakdown(total),
    years,
    values: years.map(year => DOMESTIC_TREND.find(item => item.year === year)?.count || 0),
    provinceDistribution: DOMESTIC_PROVINCES,
    publishers: DOMESTIC_PUBLISHERS,
    ...DOMESTIC_SCOPE_STATS,
  }
}

export function domesticStatsAll() {
  return buildStats(DOMESTIC_TREND.map(item => item.year))
}

export function domesticStatsForYears(years) {
  return buildStats(years)
}

export const DOMESTIC_TOTAL = totalAll

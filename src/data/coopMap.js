/* ============================================================
 * 全球数字贸易规则分布地图 —— 合作数据（改地图内容只动这个文件）
 *
 * 1. COOP_NODES : 地图光点。国家=首都坐标；多边机制=总部/秘书处坐标
 *                 （org: true 的节点在地图上显示为金色）
 * 2. COOP_LINKS : 双边合作关系。from/to 必须是 COOP_NODES 里已有的名称
 * 3. ORG_COOP   : 多边机制与参与国 [机制, 参与国, 协定/机制名]
 *                 （G7 无固定总部所在地，只进「国家合作网络」、不上地图）
 * 4. MAP_LINKS  : 组装后的地图连线（含类型，MapPanel 直接使用）
 *
 * 注意：COOP_LINKS / ORG_COOP 同时被「国家合作网络」面板复用
 * （见 coopNetwork.js），在这里改关系数据，两个板块同步生效。
 * ============================================================ */

export const COOP_NODES = [
  { name: '欧盟',     coord: [4.35, 50.85] },
  { name: '英国',     coord: [-0.13, 51.5] },
  { name: '挪威',     coord: [10.75, 59.91] },
  { name: '加拿大',   coord: [-75.7, 45.42] },
  { name: '美国',     coord: [-77.04, 38.9] },
  { name: '巴西',     coord: [-47.93, -15.78] },
  { name: '阿根廷',   coord: [-58.38, -34.6] },
  { name: '北马其顿', coord: [21.43, 41.99] },
  { name: '以色列',   coord: [35.21, 31.77] },
  { name: '海合会',   coord: [46.72, 24.71] },
  { name: '印度',     coord: [77.21, 28.61] },
  { name: '孟加拉国', coord: [90.41, 23.81] },
  { name: '新加坡',   coord: [103.82, 1.35] },
  { name: '印度尼西亚', coord: [106.85, -6.21] },
  { name: '马来西亚', coord: [101.69, 3.14] },
  { name: '韩国',     coord: [126.98, 37.57] },
  { name: '日本',     coord: [139.69, 35.69] },
  { name: '泰国',     coord: [100.5, 13.75] },
  { name: '澳大利亚', coord: [149.13, -35.28] },
  /* 多边机制（坐标为总部/秘书处所在地，金色节点） */
  { name: 'WTO',  coord: [6.14, 46.2], org: true },
  { name: 'OECD', coord: [2.35, 48.86], org: true },
  { name: 'APEC', coord: [103.82, 1.35], org: true },
  { name: '东盟', coord: [106.85, -6.21], org: true },
]

/* 双边合作：两国间签署协定/合作 */
export const COOP_LINKS = [
  { from: '欧盟', to: '印度' },
  { from: '欧盟', to: '新加坡' },
  { from: '欧盟', to: '韩国' },
  { from: '欧盟', to: '巴西' },
  { from: '欧盟', to: '加拿大' },
  { from: '新加坡', to: '挪威' },
  { from: '英国', to: '海合会' },
  { from: '英国', to: '马来西亚' },
  { from: '美国', to: '以色列' },
  { from: '美国', to: '阿根廷' },
  { from: '美国', to: '孟加拉国' },
  { from: '美国', to: '印度尼西亚' },
  { from: '美国', to: '北马其顿' },
  { from: '日本', to: '新加坡' },
]

/* 多边机制与参与国：[机制, 参与国, 协定/机制名] */
export const ORG_COOP = [
  ['WTO', '欧盟', '电子商务协定'], ['WTO', '新加坡', ''], ['WTO', '韩国', ''],
  ['WTO', '日本', ''], ['WTO', '美国', ''], ['WTO', '澳大利亚', ''],
  ['APEC', '韩国', ''], ['APEC', '新加坡', ''], ['APEC', '马来西亚', ''], ['APEC', '泰国', ''],
  ['OECD', '美国', ''], ['OECD', '日本', ''], ['OECD', '澳大利亚', ''], ['OECD', '加拿大', ''],
  ['G7', '美国', ''], ['G7', '日本', ''], ['G7', '英国', ''], ['G7', '加拿大', ''],
  ['东盟', '新加坡', ''], ['东盟', '马来西亚', ''], ['东盟', '泰国', ''], ['东盟', '印度尼西亚', ''],
]

/* ---- 以下为组装逻辑，一般无需修改 ---- */
export const MAP_LINKS = [
  ...COOP_LINKS.map(l => ({ from: l.from, to: l.to, label: '', type: 'bilateral' })),
  ...ORG_COOP
    .map(([org, country, name]) => ({ from: org, to: country, label: name || '', type: 'multilateral' }))
    .filter(l => COOP_NODES.some(n => n.name === l.from && n.org) && COOP_NODES.some(n => n.name === l.to)),
]

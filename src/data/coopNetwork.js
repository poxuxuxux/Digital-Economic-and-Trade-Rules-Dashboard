/* ============================================================
 * 国家合作网络面板数据（单边 / 双边 / 多边）
 *
 * 双边 links 复用地图的 COOP_LINKS、多边 links 复用地图的 ORG_COOP
 * （均来自 ./coopMap.js）——改合作关系数据时两个板块同步生效。
 *
 * 本文件只维护三类视图各自的「展示配置」：
 *   - unilateral  : 单边国家清单（name + desc 悬停说明）
 *   - bilateral   : 双边视图的节点大小（size）/ 是否按组织显示（org）
 *   - multilateral: 多边机制的说明（desc）与节点大小
 * ============================================================ */
import { COOP_LINKS, ORG_COOP } from './coopMap.js'

export const NET_COOP = {
  /* 单边：一国单独出台规则/政策（据《数字经贸规则观察》第1期） */
  unilateral: {
    nodes: [
      { name: '美国', desc: '《促进先进人工智能创新与安全》行政令' },
      { name: '韩国', desc: '《人工智能基本法》及实施令施行' },
      { name: '日本', desc: '《个人信息保护法》修正案通过' },
      { name: '新加坡', desc: '《生成式人工智能个人数据使用咨询指南》' },
      { name: '泰国', desc: 'BCR 审查与认证规定' },
      { name: '澳大利亚', desc: '更新隐私原则第 3 条收集指南' },
      { name: '加拿大', desc: '废除数字服务税、提交隐私保护法案' },
      { name: '印度', desc: '《云服务选择框架指南》' },
      { name: '法国', desc: '云计算角色识别专项指引' },
      { name: '意大利', desc: '电子邮件追踪像素使用指南' },
    ],
    links: [],
  },
  /* 双边：两国间签署协定/合作（关系与地图连线一致） */
  bilateral: {
    nodes: [
      { name: '欧盟', size: 26, org: true }, { name: '美国', size: 26, org: true },
      { name: '英国', size: 20 }, { name: '日本', size: 16 }, { name: '新加坡', size: 18 },
      { name: '韩国' }, { name: '印度' }, { name: '巴西' }, { name: '加拿大' }, { name: '挪威' },
      { name: '阿根廷' }, { name: '孟加拉国' }, { name: '印度尼西亚' }, { name: '马来西亚' },
      { name: '北马其顿' }, { name: '以色列' }, { name: '海合会', org: true },
    ],
    links: COOP_LINKS.map(l => [l.from, l.to]),
  },
  /* 多边：国际组织/机制与参与方（关系与地图金色连线一致） */
  multilateral: {
    nodes: [
      { name: 'WTO', size: 28, org: true, desc: '电子商务协定：73个成员支持、67个启动临时实施' },
      { name: 'APEC', size: 24, org: true, desc: '贸易数字化合作框架、数据促进增长圆桌会' },
      { name: 'OECD', size: 24, org: true, desc: 'AI原则、健康数据治理建议' },
      { name: 'G7', size: 22, org: true, desc: '广岛AI进程' },
      { name: '东盟', size: 24, org: true, desc: '数字经济框架协议（DEFA）' },
      { name: '欧盟', size: 26, org: true },
      { name: '美国' }, { name: '日本' }, { name: '韩国' }, { name: '新加坡' },
      { name: '澳大利亚' }, { name: '加拿大' }, { name: '英国' },
      { name: '马来西亚' }, { name: '泰国' }, { name: '印度尼西亚' },
    ],
    links: ORG_COOP,
  },
}

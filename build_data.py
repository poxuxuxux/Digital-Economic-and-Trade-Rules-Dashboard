# -*- coding: utf-8 -*-
"""Generate rules_embed.js from rules_data.json for the dashboard."""
import json

with open('rules_data.json', encoding='utf-8') as f:
    rules = json.load(f)

def js_str(s):
    return json.dumps(s or '', ensure_ascii=False)

lines = ['/* 自动生成自《全球数字规则数据库框架模板_统一版（8.28最终版）》国际组织工作表 —— 148 条记录 */',
         'const RULES = [']
for r in rules:
    lines.append('  { org: %s, en: %s, cn: %s, date: %s, effDate: %s, fileType: %s, field: %s, summary: %s, impact: %s, link: %s },'
                 % (js_str(r['org']), js_str(r['en']), js_str(r['cn']), js_str(r['date']),
                    js_str(r['effDate']), js_str(r['fileType']), js_str(r['field']),
                    js_str(r['summary']), js_str(r['impact']), js_str(r['link'])))
lines.append('];')

with open('rules_embed.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print('rules_embed.js written,', len(rules), 'records')

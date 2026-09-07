# -*- coding: utf-8 -*-
"""Extract records from 国际组织 sheet -> rules_data.json + statistics."""
import zipfile, re, json, glob
import xml.etree.ElementTree as ET
from datetime import date, timedelta

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
M = NS['m']

def col_to_idx(ref):
    m = re.match(r'([A-Z]+)', ref); idx = 0
    for ch in m.group(1): idx = idx * 26 + (ord(ch) - 64)
    return idx - 1

def parse_date(v):
    if v is None or v == '': return None
    s = str(v).strip()
    if re.fullmatch(r'\d+(\.0+)?', s):
        n = int(float(s))
        if 20000 < n < 60000:
            return (date(1899, 12, 30) + timedelta(days=n)).isoformat()
        return None
    for fmt in ('%d/%m/%Y', '%Y-%m-%d', '%Y/%m/%d'):
        try:
            from datetime import datetime
            return datetime.strptime(s, fmt).date().isoformat()
        except Exception:
            pass
    return None

path = glob.glob('*.xlsx')[0]
z = zipfile.ZipFile(path)
shared = []
if 'xl/sharedStrings.xml' in z.namelist():
    root = ET.fromstring(z.read('xl/sharedStrings.xml'))
    for si in root.findall('m:si', NS):
        shared.append(''.join(t.text or '' for t in si.iter('{%s}t' % M)))

root = ET.fromstring(z.read('xl/worksheets/sheet4.xml'))
sd = root.find('m:sheetData', NS)
rows = []
for row in sd.findall('m:row', NS):
    cells = {}
    for c in row.findall('m:c', NS):
        ref, t, v = c.get('r'), c.get('t'), c.find('m:v', NS)
        is_el = c.find('m:is', NS)
        if t == 's' and v is not None: val = shared[int(v.text)]
        elif t == 'inlineStr' and is_el is not None:
            val = ''.join(x.text or '' for x in is_el.iter('{%s}t' % M))
        elif v is not None: val = v.text
        else: val = ''
        cells[col_to_idx(ref)] = str(val).strip() if val is not None else ''
    if any(cells.values()):
        width = max(cells) + 1
        rows.append([cells.get(i, '') for i in range(width)])

records = []
for r in rows[3:]:                       # skip banner/group/header rows
    if len(r) < 3 or not (r[1] or r[2]): continue
    rec = {
        'org':      (r[0] if len(r) > 0 else '').strip(),
        'en':       (r[1] if len(r) > 1 else '').strip(),
        'cn':       (r[2] if len(r) > 2 else '').strip(),
        'date':     parse_date(r[3] if len(r) > 3 else ''),
        'effDate':  parse_date(r[4] if len(r) > 4 else ''),
        'fileType': (r[7] if len(r) > 7 else '').strip(),
        'field':    (r[8] if len(r) > 8 else '').strip(),
        'summary':  re.sub(r'\s+', ' ', (r[9] if len(r) > 9 else ''))[:220],
        'impact':   re.sub(r'\s+', ' ', (r[11] if len(r) > 11 else ''))[:300],
        'link':     (r[13] if len(r) > 13 else '').strip(),
    }
    if rec['en'] or rec['cn']:
        records.append(rec)

with open('rules_data.json', 'w', encoding='utf-8') as f:
    json.dump(records, f, ensure_ascii=False, indent=1)

from collections import Counter
print('TOTAL RECORDS:', len(records))
print()
print('--- ORG counts ---')
for k, v in Counter(x['org'] for x in records).most_common():
    print(f'{v:4d}  {k}')
print()
print('--- FILE TYPE counts ---')
for k, v in Counter(x['fileType'] for x in records if x['fileType']).most_common():
    print(f'{v:4d}  {k}')
print()
print('--- YEAR counts ---')
for k, v in sorted(Counter((x['date'] or '????')[:4] for x in records).items()):
    print(f'{v:4d}  {k}')
print()
print('--- FIELD counts (top 25) ---')
for k, v in Counter(x['field'] for x in records if x['field']).most_common(25):
    print(f'{v:4d}  {k}')
print()
print('--- fields missing date:', sum(1 for x in records if not x['date']),
      '| missing field:', sum(1 for x in records if not x['field']),
      '| missing cn:', sum(1 for x in records if not x['cn']))
print()
print('--- LATEST 8 ---')
for x in sorted([r for r in records if r['date']], key=lambda r: r['date'], reverse=True)[:8]:
    print(x['date'], '|', x['org'], '|', (x['cn'] or x['en'])[:40])

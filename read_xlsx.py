# -*- coding: utf-8 -*-
"""Read .xlsx with stdlib only (zipfile + ElementTree) and dump content."""
import zipfile, re, sys, glob, os
import xml.etree.ElementTree as ET

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

def col_to_idx(ref):
    m = re.match(r'([A-Z]+)', ref)
    idx = 0
    for ch in m.group(1):
        idx = idx * 26 + (ord(ch) - 64)
    return idx - 1

def read_xlsx(path):
    z = zipfile.ZipFile(path)
    # shared strings
    shared = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall('m:si', NS):
            shared.append(''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])))
    # workbook sheets
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    rels = ET.fromstring(z.read('xl/_rels/xl/workbook.xml.rels'.replace('xl/_rels/xl/', 'xl/_rels/')))
    rel_map = {rel.get('Id'): rel.get('Target') for rel in rels}
    sheets = []
    for sh in wb.find('m:sheets', NS):
        rid = sh.get('{%s}id' % NS['r'])
        target = rel_map.get(rid, '')
        if not target.startswith('xl/'):
            target = 'xl/' + target.lstrip('/')
        sheets.append((sh.get('name'), target))
    return z, shared, sheets

def dump_sheet(z, shared, name, target, max_rows=200):
    root = ET.fromstring(z.read(target))
    sd = root.find('m:sheetData', NS)
    print('=' * 100)
    print(f'### SHEET: {name}  ({target})')
    rows = []
    for row in sd:
        cells = {}
        for c in row.findall('m:c', NS):
            ref = c.get('r'); t = c.get('t'); v = c.find('m:v', NS)
            is_el = c.find('m:is', NS)
            if t == 's' and v is not None:
                val = shared[int(v.text)]
            elif t == 'inlineStr' and is_el is not None:
                val = ''.join(x.text or '' for x in is_el.iter('{%s}t' % NS['m']))
            elif v is not None:
                val = v.text
            else:
                val = ''
            cells[col_to_idx(ref)] = val
        if cells:
            width = max(cells) + 1
            rows.append([cells.get(i, '') for i in range(width)])
    print(f'rows: {len(rows)}')
    for i, r in enumerate(rows[:max_rows]):
        cells_txt = ' | '.join(str(x) for x in r)
        print(f'[{i}] {cells_txt}')
    if len(rows) > max_rows:
        print(f'... ({len(rows) - max_rows} more rows)')

def main():
    files = glob.glob('*.xlsx')
    if not files:
        print('NO XLSX FOUND'); return
    path = files[0]
    print('FILE:', path, os.path.getsize(path), 'bytes')
    z, shared, sheets = read_xlsx(path)
    print('SHEETS:', [s[0] for s in sheets])
    for name, target in sheets:
        try:
            dump_sheet(z, shared, name, target)
        except Exception as e:
            print(f'### SHEET {name} ERROR: {e}')

main()

<template>
  <div class="adv-overlay" :class="{ show: store.advVisible }" @click="close">
    <div class="adv-modal" @click.stop>
      <div class="adv-head">
        <span class="tag-icon"></span><span>高级检索</span>
        <span class="adv-close" @click="close">✕</span>
      </div>
      <div class="adv-body">
        <div class="adv-rows">
          <div class="cond-row" v-for="(row, i) in rows" :key="i">
            <Dropdown v-if="i > 0" class="cond-logic" :options="['AND', 'OR', 'NOT']" v-model="row.logic" />
            <Dropdown class="cond-field" :options="fieldLabels" v-model="row.field" />
            <input class="cond-val" v-model="row.value" @keydown.enter="go" placeholder="请输入检索内容" />
            <Dropdown class="cond-mode" :options="['精确', '模糊']" v-model="row.mode" />
            <span class="row-del" @click="delRow(i)">−</span>
            <span v-if="i === rows.length - 1" class="row-add" @click="addRow">+</span>
          </div>
        </div>
        <div class="adv-time">
          <label>时间范围：</label>
          <div class="time-box">
            <span>发表时间</span><input type="date" v-model="ds" /><em>--</em><input type="date" v-model="de" />
          </div>
        </div>
      </div>
      <div class="adv-foot">
        <button class="adv-reset" @click="reset">重置条件</button>
        <button class="adv-go" @click="go">检 索</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dropdown from './Dropdown.vue'
import { store, advSearch } from '../store.js'
import { ADV_FIELDS, FIELD_MAP } from '../data/dashboard.js'

const fieldLabels = ADV_FIELDS.map(f => f[1])
const rows = ref([{ logic: 'AND', field: '标题', value: '', mode: '精确' }])
const ds = ref('')
const de = ref('')

function addRow() { rows.value.push({ logic: 'AND', field: '标题', value: '', mode: '精确' }) }
function delRow(i) {
  if (rows.value.length > 1) rows.value.splice(i, 1)
  else rows.value[0].value = ''
}
function reset() {
  rows.value = [{ logic: 'AND', field: '标题', value: '', mode: '精确' }]
  ds.value = ''
  de.value = ''
}
function go() {
  const valid = rows.value
    .map(r => ({ logic: r.logic, label: r.field, field: FIELD_MAP[r.field], value: r.value.trim(), mode: r.mode }))
    .filter(r => r.value)
  advSearch(valid, ds.value, de.value)
  store.advVisible = false
}
function close() { store.advVisible = false }
</script>

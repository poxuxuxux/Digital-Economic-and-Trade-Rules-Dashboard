<template>
  <div class="sel" :class="{ open }" ref="el" @click="onRoot">
    <span class="sel-text">{{ modelValue }}</span><span class="caret2">▼</span>
    <div class="sel-menu">
      <div v-for="o in options" :key="o" class="sel-opt" :class="{ active: o === modelValue }" @click.stop="pick(o)">{{ o }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({ options: { type: Array, required: true }, modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const el = ref(null)
const open = ref(false)

function onRoot(e) {
  if (e.target.closest('.sel-opt')) return
  open.value = !open.value
}
function pick(o) { emit('update:modelValue', o); open.value = false }
function onDoc(e) { if (el.value && !el.value.contains(e.target)) open.value = false }

onMounted(() => document.addEventListener('click', onDoc))
onBeforeUnmount(() => document.removeEventListener('click', onDoc))
</script>

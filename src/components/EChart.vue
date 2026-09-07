<template>
  <div ref="el" class="echart"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: { type: Object, required: true },
  notMerge: { type: Boolean, default: true },
})
const emit = defineEmits(['chart-click'])

const el = ref(null)
let chart = null

function render() {
  if (chart && props.option) chart.setOption(props.option, props.notMerge)
}
function resize() { chart && chart.resize() }

onMounted(() => {
  chart = echarts.init(el.value)
  chart.on('click', params => emit('chart-click', params))
  chart.getZr().on('click', e => { if (!e.target) emit('chart-click', null) })
  render()
})
watch(() => props.option, render, { deep: true })
onBeforeUnmount(() => { chart && chart.dispose(); chart = null })

defineExpose({ resize })
</script>

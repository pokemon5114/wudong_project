<template>
  <JourneyStage
    sequence="04 · FOLLOW THE RIDGE"
    title="沿着山路走，<br>把风景收进脚步。"
    description="去看云海、鼓楼与梯田。选一段路线，让每一步都在乌东的山水之间。"
    phone-kicker="乌 东 行 程"
    phone-title="选择你想<br>抵达的远方"
    phone-subtitle="从一条路，穿过一座村寨"
    note="挑一段路<br>开始出发"
    chapter-name="行"
    all-label="全部行程"
    :items="stageTickets"
    :categories="ticketCategories"
    v-model:selected-id="selectedKind"
    :loading="loading"
    closing-kicker="THE WALKING MAP"
    closing-title="风景不在终点，在路上"
    closing-description="景区与路线均来自当前项目已有数据。选中卡片即可进入原有景点或线路详情，并继续完成订票。"
    @select-item="goDetail"
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import JourneyStage from '@/components/JourneyStage.vue'
import { getRouteList, getScenicList } from '@/api/ticket'
import { updateSeo } from '@/composables/useSeo'

const router = useRouter()
const loading = ref(false)
const scenics = ref([])
const routes = ref([])
const selectedKind = ref(null)

const ticketCategories = computed(() => [
  ...(scenics.value.length ? [{ id: 'scenic', name: '景区' }] : []),
  ...(routes.value.length ? [{ id: 'route', name: '路线' }] : []),
])
const journeyItems = computed(() => [
  ...scenics.value.map(item => ({ ...item, id: `scenic-${item.id}`, sourceId: item.id, kind: 'scenic', categoryId: 'scenic', categoryName: '景区', badge: item.scenicType || '乌东景区', source: item })),
  ...routes.value.map(item => ({ ...item, id: `route-${item.id}`, sourceId: item.id, kind: 'route', categoryId: 'route', categoryName: '路线', badge: item.routeType || '精选路线', source: item })),
])
const stageTickets = computed(() => journeyItems.value)

const goDetail = item => router.push(item.kind === 'scenic' ? `/scenics/${item.sourceId}` : `/routes/${item.sourceId}`)
const loadData = async () => {
  loading.value = true
  try {
    const [scenicRes, routeRes] = await Promise.all([getScenicList({ pageSize: 100 }), getRouteList({ pageSize: 100 })])
    if (scenicRes.code === 0) scenics.value = scenicRes.data.list
    if (routeRes.code === 0) routes.value = routeRes.data.list
  } catch (error) { console.error('Failed to load ticket data:', error) } finally { loading.value = false }
}

updateSeo({ title: '线路订票 - 乌东村旅行路线', description: '精选乌东村及周边旅游路线，体验苗族侗寨风情。', keywords: '乌东村旅游,苗族侗寨,路线订票,景区门票' })
onMounted(loadData)
</script>

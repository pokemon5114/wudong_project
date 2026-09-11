<template>
  <JourneyStage
    sequence="02 · TASTE THE VILLAGE"
    title="从一桌热气里，<br>尝到乌东的日常。"
    description="酸汤会醒来，糯米会带着山风。找一家坐下，让味道把行程慢慢打开。"
    phone-kicker="乌 东 风 味"
    phone-title="选择你想<br>记住的味道"
    phone-subtitle="从一席烟火，靠近一座村寨"
    note="挑一张桌<br>坐进旅程"
    chapter-name="食"
    all-label="全部风味"
    :items="stageRestaurants"
    :categories="restaurantCategories"
    v-model:selected-id="selectedCuisine"
    :loading="loading"
    closing-kicker="THE VILLAGE TABLE"
    closing-title="一顿饭，也是抵达"
    closing-description="所有餐厅都来自当前项目的已有数据。可继续搜索、定位或按距离排序，再点进一家查看菜单与预订。"
    @select-item="goDetail"
  >
    <template #tools>
      <div class="journey-tools">
        <el-input v-model="keyword" placeholder="搜索餐厅名称" clearable @keyup.enter="loadRestaurants" @clear="loadRestaurants" />
        <button @click="loadRestaurants">搜索</button>
        <button @click="handleGetLocation">{{ locating ? '定位中…' : userLocation ? '已定位' : '获取位置' }}</button>
        <button :class="{ active: sortByDistance }" :disabled="!userLocation" @click="sortByDistance = !sortByDistance">距离排序</button>
      </div>
      <el-select v-if="userLocation" v-model="maxDistance" class="distance-filter" placeholder="筛选距离">
        <el-option :value="0" label="不限距离" />
        <el-option :value="1" label="1公里内" />
        <el-option :value="3" label="3公里内" />
        <el-option :value="5" label="5公里内" />
        <el-option :value="10" label="10公里内" />
      </el-select>
    </template>
  </JourneyStage>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import JourneyStage from '@/components/JourneyStage.vue'
import { getRestaurantList } from '@/api/restaurant'
import { calculateDistance, getUserLocation } from '@/utils/geo'
import { updateSeo } from '@/composables/useSeo'

const router = useRouter()
const loading = ref(false)
const locating = ref(false)
const keyword = ref('')
const restaurants = ref([])
const selectedCuisine = ref(null)
const userLocation = ref(null)
const maxDistance = ref(0)
const sortByDistance = ref(false)
const pagination = reactive({ page: 1, pageSize: 100, total: 0 })

const filteredRestaurants = computed(() => {
  let result = [...restaurants.value]
  if (userLocation.value) {
    result = result.map(item => {
      if (item.latitude && item.longitude) item.distance = calculateDistance(userLocation.value.latitude, userLocation.value.longitude, Number(item.latitude), Number(item.longitude))
      return item
    })
    if (maxDistance.value > 0) result = result.filter(item => item.distance !== undefined && item.distance <= maxDistance.value)
    if (sortByDistance.value) result.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
  }
  return result
})
const restaurantCategories = computed(() => [...new Set(filteredRestaurants.value.map(item => (item.tags || [])[0]).filter(Boolean))].map(name => ({ id: name, name })))
const stageRestaurants = computed(() => filteredRestaurants.value
  .map(item => ({ ...item, categoryId: (item.tags || [])[0] || '餐厅', categoryName: (item.tags || [])[0] || '乌东风味', badge: item.rating ? `${Number(item.rating).toFixed(1)} 分` : '特色餐桌', source: item })))

const goDetail = item => router.push(`/restaurants/${item.id}`)
const handleGetLocation = async () => {
  locating.value = true
  try { userLocation.value = await getUserLocation(); ElMessage.success('已获取您的位置') }
  catch (error) { ElMessage.warning(error.message || '获取位置失败，请检查定位权限') }
  finally { locating.value = false }
}
const loadRestaurants = async () => {
  loading.value = true
  try {
    const res = await getRestaurantList({ keyword: keyword.value || undefined, page: pagination.page, pageSize: pagination.pageSize })
    if (res.code === 0) { restaurants.value = res.data.list; pagination.total = res.data.pagination.total; selectedCuisine.value = null }
  } catch (error) { console.error('Failed to load restaurants:', error) } finally { loading.value = false }
}

updateSeo({ title: '特色美食 - 乌东村餐厅推荐', description: '乌东村特色美食推荐，品尝地道的苗族、侗族特色美食。', keywords: '乌东村美食,苗族美食,侗族美食,特色餐厅,农家乐' })
onMounted(loadRestaurants)
</script>

<style scoped lang="scss">
.journey-tools { display:flex; justify-content:center; gap:10px; max-width:620px; margin:28px auto 0; :deep(.el-input) { width:220px; } :deep(.el-input__wrapper) { border-radius:999px; background:transparent; box-shadow:0 0 0 1px rgba(19,36,61,.16) inset; } button { padding:9px 15px; border:1px solid rgba(19,36,61,.18); border-radius:999px; color:#183653; background:transparent; font:inherit; font-size:13px; cursor:pointer; transition:.25s ease; &:hover,&.active { border-color:#183653; color:#fff; background:#183653; } &:disabled { cursor:not-allowed; opacity:.42; } } }
.distance-filter { width:130px; margin:12px auto 0; :deep(.el-input__wrapper) { border-radius:999px; background:transparent; box-shadow:0 0 0 1px rgba(19,36,61,.16) inset; } }
@media (max-width:700px) { .journey-tools { flex-wrap:wrap; padding-inline:12px; } }
</style>

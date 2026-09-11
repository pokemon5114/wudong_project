<template>
  <JourneyStage
    sequence="03 · STAY WITH THE MOUNTAIN"
    title="在一盏灯下，<br>把乌东住成故乡。"
    description="吊脚楼会等晚风，木窗会留住清晨。选一处落脚，让山里的夜慢慢靠近。"
    phone-kicker="乌 东 民 宿"
    phone-title="选择今晚<br>停靠的灯火"
    phone-subtitle="从一间房，听见一座村寨"
    note="挑一处住<br>留住夜色"
    chapter-name="住"
    all-label="全部住处"
    :items="stageHotels"
    :categories="hotelCategories"
    v-model:selected-id="selectedType"
    :loading="loading"
    closing-kicker="THE MOUNTAIN STAY"
    closing-title="一扇木窗，收下整夜山风"
    closing-description="所有民宿均来自当前项目已有数据。可定位、按距离筛选，再进入房间详情完成原有预订流程。"
    @select-item="goDetail"
  >
    <template #tools>
      <div class="journey-tools">
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
import { getHotelList } from '@/api/hotel'
import { calculateDistance, getUserLocation } from '@/utils/geo'
import { updateSeo } from '@/composables/useSeo'

const router = useRouter()
const loading = ref(false)
const locating = ref(false)
const selectedType = ref(null)
const hotels = ref([])
const userLocation = ref(null)
const maxDistance = ref(0)
const sortByDistance = ref(false)
const pagination = reactive({ page: 1, pageSize: 100, total: 0 })

const filteredHotels = computed(() => {
  let result = [...hotels.value]
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
const hotelCategories = computed(() => [...new Set(filteredHotels.value.map(item => item.hotelType).filter(Boolean))].map(name => ({ id: name, name })))
const stageHotels = computed(() => filteredHotels.value
  .map(item => ({ ...item, categoryId: item.hotelType || '民宿', categoryName: item.hotelType || '乌东民宿', badge: item.isRecommend ? '推荐入住' : (item.hotelType || '特色民宿'), source: item })))

const goDetail = item => router.push(`/hotels/${item.id}`)
const handleGetLocation = async () => {
  locating.value = true
  try { userLocation.value = await getUserLocation(); ElMessage.success('已获取您的位置') }
  catch (error) { ElMessage.warning(error.message || '获取位置失败，请检查定位权限') }
  finally { locating.value = false }
}
const loadHotels = async () => {
  loading.value = true
  try {
    const res = await getHotelList({ page: pagination.page, pageSize: pagination.pageSize })
    if (res.code === 0) { hotels.value = res.data.list; pagination.total = res.data.pagination.total }
  } catch (error) { console.error('Failed to load hotels:', error) } finally { loading.value = false }
}

updateSeo({ title: '特色住宿 - 乌东村民宿推荐', description: '乌东村特色住宿推荐，体验苗族吊脚楼、侗家木楼等特色民宿。', keywords: '乌东村住宿,苗族吊脚楼,侗族木楼,特色民宿,农家乐住宿' })
onMounted(loadHotels)
</script>

<style scoped lang="scss">
.journey-tools { display:flex; justify-content:center; gap:10px; margin:28px auto 0; button { padding:9px 15px; border:1px solid rgba(19,36,61,.18); border-radius:999px; color:#183653; background:transparent; font:inherit; font-size:13px; cursor:pointer; transition:.25s ease; &:hover,&.active { border-color:#183653; color:#fff; background:#183653; } &:disabled { cursor:not-allowed; opacity:.42; } } }
.distance-filter { width:130px; margin:12px auto 0; :deep(.el-input__wrapper) { border-radius:999px; background:transparent; box-shadow:0 0 0 1px rgba(19,36,61,.16) inset; } }
</style>

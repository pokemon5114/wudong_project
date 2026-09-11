<template>
  <main class="products-page">
    <section class="product-stage" aria-labelledby="products-heading">
      <div class="stage-copy">
        <p class="sequence">01 · WEAR THE STORY</p>
        <h1 id="products-heading">先从一件衣裳，<br>把乌东的手艺带回家。</h1>
        <p>银饰会轻响，蜡染会留下山川。挑一件带走，让旅程从手边开始。</p>
      </div>

      <div class="phone-wrap" aria-hidden="true">
        <div class="phone">
          <span>乌 东 手 作</span>
          <strong>选择你想<br>带走的纹样</strong>
          <small>从一件衣裳，靠近一座村寨</small>
          <i></i>
        </div>
        <p class="stage-note">挑选一件<br>带回旅程</p>
      </div>

      <div
        ref="pickerRef"
        class="product-picker"
        :class="{ 'is-paused': pickerPaused, 'has-selection': selectedCategory !== null }"
        tabindex="0"
        @mouseenter="pausePicker"
        @mouseleave="resumePicker"
        @focusin="pausePicker"
        @focusout="resumePicker"
        @wheel="pickerWheel"
      >
        <div v-if="loading" class="picker-loading">正在挑选乌东手作…</div>
        <article
          v-for="product in displayProducts"
          :id="`picker-product-${product.id}`"
          :key="product.id"
          class="picker-card"
          :class="{ 'is-focused': selectedCategory === product.category?.id }"
          @click="$router.push(`/products/${product.id}`)"
        >
          <div class="picker-image">
            <el-image :src="product.coverImage || '/placeholder.svg'" :alt="product.name" fit="cover" />
            <span v-if="product.heritageLevel > 0">{{ heritageLabels[product.heritageLevel] }}</span>
          </div>
          <p>{{ product.name }}</p>
          <small v-if="selectedCategory === product.category?.id">正在查看 · {{ product.category?.name }}</small>
        </article>
      </div>
    </section>

    <nav class="category-dock" aria-label="商品分类导航">
      <button :class="{ active: selectedCategory === null }" @click="chooseCategory(null)">全部手作</button>
      <button v-for="category in visibleCategories" :key="category.id" :class="{ active: selectedCategory === category.id }" @click="chooseCategory(category.id)">{{ category.name }}</button>
    </nav>

    <section class="selection-copy">
      <p class="sequence">THE HANDMADE EDIT</p>
      <h2>{{ selectedCategoryName }}</h2>
      <p>{{ selectedCategory === null ? '所有作品都来自当前项目已有的非遗商品数据。滑动缩略带，点进一件作品，继续查看它的故事。' : '已为你聚焦这一类手作；点击任意放大的作品，进入原有详情页。' }}</p>
      <button v-if="keyword" @click="clearKeyword">清除“{{ keyword }}”搜索</button>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryList, getProductList } from '@/api/product'

const route = useRoute()
const loading = ref(false)
const categories = ref([])
const products = ref([])
const displayProducts = ref([])
const keyword = ref('')
const selectedCategory = ref(null)
const pickerPaused = ref(false)
const pickerRef = ref(null)
let pickerTimer = null
let pickerDirection = 1
const heritageLabels = ['', '县级非遗', '州级非遗', '省级非遗', '国家级非遗']

const visibleCategories = computed(() => {
  const existing = new Set(products.value.map(item => item.category?.id))
  return categories.value.filter(item => existing.has(item.id))
})
const selectedCategoryName = computed(() => {
  if (selectedCategory.value === null) return '一串会移动的乌东手作'
  return visibleCategories.value.find(item => item.id === selectedCategory.value)?.name || '乌东手作'
})

const loadCategories = async () => {
  try { const res = await getCategoryList(); if (res.code === 0) categories.value = res.data } catch (error) { console.error('Failed to load categories:', error) }
}
const loadProducts = async () => {
  loading.value = true
  try {
    const res = await getProductList({ keyword: keyword.value || undefined, page: 1, pageSize: 100 })
    if (res.code === 0) {
      products.value = res.data.list
      displayProducts.value = [...res.data.list]
    }
  } catch (error) { console.error('Failed to load products:', error) } finally { loading.value = false }
}

const stopTicker = () => { if (pickerTimer) { clearInterval(pickerTimer); pickerTimer = null } }
const startTicker = () => {
  stopTicker()
  pickerTimer = setInterval(() => {
    const picker = pickerRef.value
    if (!picker || pickerPaused.value || selectedCategory.value !== null) return
    const firstCard = picker.querySelector('.picker-card')
    if (!firstCard || picker.scrollWidth <= picker.clientWidth) return
    const step = firstCard.offsetWidth + 16
    picker.scrollLeft += pickerDirection * 0.55
    if (picker.scrollLeft >= step) {
      picker.scrollLeft -= step
      const [first, ...rest] = displayProducts.value
      displayProducts.value = [...rest, first]
    }
  }, 16)
}
const pausePicker = () => { pickerPaused.value = true }
const resumePicker = () => { if (selectedCategory.value === null) pickerPaused.value = false }
const pickerWheel = (event) => {
  if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    event.preventDefault()
    pausePicker()
    event.currentTarget.scrollLeft += event.deltaX || event.deltaY
  }
}
const chooseCategory = async (categoryId) => {
  selectedCategory.value = categoryId
  pickerPaused.value = categoryId !== null
  await nextTick()
  const picker = pickerRef.value
  if (!picker) return
  if (categoryId === null) {
    picker.scrollTo({ left: 0, behavior: 'smooth' })
    pickerPaused.value = false
    return
  }
  const target = products.value.find(item => item.category?.id === categoryId)
  document.getElementById(`picker-product-${target?.id}`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}
const clearKeyword = () => { keyword.value = ''; selectedCategory.value = null; loadProducts() }
const syncKeyword = () => { keyword.value = route.query.keyword ? String(route.query.keyword) : ''; selectedCategory.value = null; return loadProducts() }
watch(() => route.query.keyword, syncKeyword)
onMounted(async () => { await Promise.all([loadCategories(), syncKeyword()]); await nextTick(); startTicker() })
onBeforeUnmount(stopTicker)
</script>

<style scoped lang="scss">
.products-page { min-height:100vh; overflow:hidden; color:#13243d; background:#f8f5ed; }.product-stage { position:relative; min-height:clamp(760px,86vh,980px); overflow:hidden; padding:clamp(112px,11vw,160px) max(48px,calc((100vw - 1280px)/2)) 168px; background:radial-gradient(circle at 50% 38%,rgba(224,185,82,.18),transparent 25%),#f8f5ed; }.stage-copy { position:absolute; top:clamp(155px,19vh,225px); left:max(48px,calc((100vw - 1280px)/2)); z-index:3; width:min(29vw,390px); }.sequence { margin:0; color:#bf9126; font-size:11px; font-weight:800; letter-spacing:.2em; }.stage-copy h1 { margin:15px 0 19px; font-family:'Noto Serif SC',serif; font-size:clamp(37px,3.7vw,60px); font-weight:500; letter-spacing:-.07em; line-height:1.12; }.stage-copy > p:last-child { max-width:300px; margin:0; color:#5d6877; font-size:14px; line-height:1.95; }.phone-wrap { position:absolute; top:clamp(120px,14vh,172px); left:50%; z-index:1; transform:translateX(-50%); }.phone { position:relative; display:flex; width:clamp(318px,27vw,454px); min-height:clamp(520px,42vw,680px); flex-direction:column; justify-content:center; gap:20px; padding:56px 47px; overflow:hidden; border:8px solid #13243d; border-radius:52px; background:#fffdfa; box-shadow:22px 25px 0 #e6dfd2,0 26px 55px rgba(19,36,61,.16); }.phone::before { position:absolute; top:14px; left:50%; width:104px; height:18px; border-radius:0 0 13px 13px; background:#13243d; content:''; transform:translateX(-50%); }.phone::after { position:absolute; right:-72px; bottom:-73px; width:214px; height:214px; border:1px solid rgba(191,145,38,.3); border-radius:50%; content:''; }.phone > span { color:#bf9126; font-size:10px; font-weight:800; letter-spacing:.22em; }.phone strong { position:relative; z-index:1; font-family:'Noto Serif SC',serif; font-size:clamp(32px,3.1vw,48px); font-weight:500; letter-spacing:-.06em; line-height:1.16; }.phone small { position:relative; z-index:1; color:#627083; font-size:13px; line-height:1.7; }.phone i { width:52px; border-top:2px solid #c99827; }.stage-note { position:absolute; top:24%; left:calc(100% + 55px); width:92px; margin:0; color:#43526a; font-size:12px; line-height:1.55; text-align:center; transform:rotate(7deg); }.stage-note::after { display:block; margin-top:11px; color:#bf9126; content:'⌄'; font-size:28px; }.product-picker { position:absolute; right:0; bottom:26px; left:0; z-index:4; display:flex; align-items:flex-end; gap:16px; padding:14px max(24px,calc((100vw - 1540px)/2)); overflow-x:auto; cursor:ew-resize; scrollbar-width:none; scroll-behavior:smooth; }.product-picker::-webkit-scrollbar { display:none; }.picker-loading { width:100%; color:#718093; text-align:center; }.picker-card { position:relative; width:clamp(132px,11vw,178px); min-width:clamp(132px,11vw,178px); padding:0 0 11px; overflow:hidden; border:1px solid rgba(19,36,61,.08); border-radius:14px; background:#fffdfa; box-shadow:0 11px 24px rgba(19,36,61,.1); cursor:pointer; transition:transform .45s cubic-bezier(.16,.84,.36,1),opacity .35s ease,box-shadow .35s ease; }.picker-card:hover { z-index:2; box-shadow:0 18px 34px rgba(19,36,61,.2); transform:translateY(-14px) scale(1.03); }.product-picker.has-selection .picker-card:not(.is-focused) { opacity:.48; transform:scale(.9); }.product-picker.has-selection .picker-card.is-focused { z-index:2; box-shadow:0 22px 42px rgba(19,36,61,.22); transform:translateY(-18px) scale(1.1); }.picker-image { position:relative; height:clamp(116px,9.5vw,154px); overflow:hidden; background:#e8ece9; }.picker-image :deep(.el-image) { width:100%; height:100%; transition:transform .45s ease; }.picker-card:hover .picker-image :deep(.el-image) { transform:scale(1.08); }.picker-image span { position:absolute; top:8px; right:8px; padding:4px 7px; color:#fffdf8; background:#b88722; font-size:9px; font-weight:700; }.picker-card > p { margin:10px 11px 0; overflow:hidden; color:#213953; font-size:12px; font-weight:800; text-overflow:ellipsis; white-space:nowrap; }.picker-card > small { display:block; margin:5px 11px 0; color:#bf9126; font-size:9px; font-weight:800; white-space:nowrap; }.category-dock { position:sticky; top:0; z-index:20; display:flex; justify-content:center; gap:clamp(20px,2.5vw,42px); width:100%; padding:26px 24px 32px; overflow-x:auto; background:#f8f5ed; scrollbar-width:none; }.category-dock::-webkit-scrollbar { display:none; }.category-dock button { position:relative; flex:0 0 auto; padding:0 0 7px; border:0; color:#697587; background:transparent; font:inherit; font-size:14px; cursor:pointer; transition:color .25s ease,font-weight .25s ease; }.category-dock button::after { position:absolute; right:0; bottom:0; left:0; height:2px; background:#c99827; content:''; transform:scaleX(0); transition:transform .25s ease; }.category-dock button:hover,.category-dock button.active { color:#13243d; font-weight:800; }.category-dock button:hover::after,.category-dock button.active::after { transform:scaleX(1); }.selection-copy { width:min(760px,calc(100% - 48px)); padding:clamp(88px,12vw,170px) 0; margin:auto; text-align:center; }.selection-copy h2 { margin:16px 0 18px; font-family:'Noto Serif SC',serif; font-size:clamp(34px,4.5vw,62px); font-weight:500; letter-spacing:-.06em; }.selection-copy > p:last-of-type { max-width:480px; margin:0 auto; color:#687587; font-size:15px; line-height:2; }.selection-copy button { margin-top:22px; border:0; color:#183653; background:transparent; font:inherit; font-weight:800; cursor:pointer; }.selection-copy button:hover { color:#bf9126; }
@media (max-width:820px) { .product-stage { min-height:760px; padding-inline:26px; }.stage-copy { top:108px; left:26px; width:calc(100% - 52px); text-align:center; }.stage-copy > p:last-child { margin-inline:auto; }.phone-wrap { top:300px; }.phone { width:235px; min-height:330px; padding:40px 28px; border-radius:38px; }.stage-note { display:none; }.product-picker { bottom:20px; padding-inline:18px; }.picker-card { width:150px; min-width:150px; }.category-dock { padding-inline:24px; }.selection-copy { width:calc(100% - 48px); } }
@media (prefers-reduced-motion:reduce) { .product-picker { scroll-behavior:auto; } }

/* Wide-screen presentation: the phone anchors the first screen, with the picker and categories both in view. */
.product-stage { min-height:clamp(680px,75vh,840px); }
.stage-copy { top:clamp(136px,16vh,186px); }
.phone-wrap { top:clamp(82px,9vh,112px); }
.phone { min-height:clamp(500px,37vw,630px); justify-content:flex-start; padding-top:clamp(124px,10vw,150px); }
.stage-note { width:116px; font-size:14px; font-weight:700; }
.product-picker { right:auto; left:50%; width:min(calc(100% - 48px),1280px); padding-inline:0; transform:translateX(-50%); }
.picker-card { transform:none; }
.product-picker.has-selection .picker-card:not(.is-focused) { transform:scale(.9); }
.category-dock { gap:clamp(24px,3vw,48px); padding:18px 24px 24px; }
.category-dock button { font-size:17px; }
@media (max-width:820px) { .product-stage { min-height:760px; }.product-picker { left:0; width:100%; padding-inline:18px; transform:none; }.category-dock { justify-content:flex-start; }.phone { justify-content:center; padding-top:40px; } }
</style>

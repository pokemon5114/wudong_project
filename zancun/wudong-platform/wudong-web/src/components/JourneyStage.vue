<template>
  <main class="journey-stage-page">
    <section class="journey-stage" :aria-labelledby="headingId">
      <div class="stage-copy">
        <p class="sequence">{{ sequence }}</p>
        <h1 :id="headingId" v-html="title"></h1>
        <p>{{ description }}</p>
      </div>

      <div class="phone-wrap" aria-hidden="true">
        <div class="phone">
          <span>{{ phoneKicker }}</span>
          <strong v-html="phoneTitle"></strong>
          <small>{{ phoneSubtitle }}</small>
          <i></i>
        </div>
        <p class="stage-note" v-html="note"></p>
      </div>

      <div
        ref="pickerRef"
        class="journey-picker"
        :class="{ 'is-paused': pickerPaused, 'has-selection': selectedId !== null, 'is-short-list': displayItems.length <= 5 }"
        tabindex="0"
        @mouseenter="pausePicker"
        @mouseleave="resumePicker"
        @focusin="pausePicker"
        @focusout="resumePicker"
        @wheel="pickerWheel"
      >
        <div v-if="loading" class="picker-loading">正在整理这一段旅程…</div>
        <article
          v-for="item in displayItems"
          :id="`journey-item-${item.id}`"
          :key="item.id"
          class="picker-card"
          :class="{ 'is-focused': selectedId !== null && String(item.categoryId) === String(selectedId) }"
          @click="$emit('select-item', item)"
        >
          <div class="picker-image">
            <el-image :src="item.coverImage || '/placeholder.svg'" :alt="item.name" fit="cover" />
            <span v-if="item.badge">{{ item.badge }}</span>
          </div>
          <p>{{ item.name }}</p>
          <small v-if="selectedId !== null && String(item.categoryId) === String(selectedId)">正在查看 · {{ item.categoryName }}</small>
        </article>
      </div>
    </section>

    <nav class="category-dock" :aria-label="`${chapterName}分类导航`">
      <button :class="{ active: selectedId === null }" @click="chooseCategory(null)">{{ allLabel }}</button>
      <button
        v-for="category in categories"
        :key="category.id"
        :class="{ active: String(selectedId) === String(category.id) }"
        @click="chooseCategory(category.id)"
      >{{ category.name }}</button>
    </nav>

    <section class="selection-copy">
      <p class="sequence">{{ selectedId === null ? closingKicker : selectedCategoryName }}</p>
      <h2>{{ selectedId === null ? closingTitle : selectedCategoryName }}</h2>
      <p>{{ selectedId === null ? closingDescription : `已为你聚焦「${selectedCategoryName}」。点击放大的卡片，继续查看这一站的完整故事。` }}</p>
      <slot name="tools"></slot>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  sequence: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  phoneKicker: { type: String, required: true },
  phoneTitle: { type: String, required: true },
  phoneSubtitle: { type: String, required: true },
  note: { type: String, required: true },
  chapterName: { type: String, required: true },
  allLabel: { type: String, required: true },
  items: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] },
  selectedId: { type: [String, Number], default: null },
  loading: Boolean,
  closingKicker: { type: String, required: true },
  closingTitle: { type: String, required: true },
  closingDescription: { type: String, required: true },
})

const emit = defineEmits(['update:selectedId', 'select-item'])
const pickerRef = ref(null)
const pickerPaused = ref(false)
const displayItems = ref([])
let pickerTimer = null

const headingId = computed(() => `journey-${props.chapterName}`)
const selectedCategoryName = computed(() => props.categories.find(item => String(item.id) === String(props.selectedId))?.name || props.chapterName)

const resetItems = () => { displayItems.value = [...props.items] }
watch(() => props.items, resetItems, { deep: true, immediate: true })

const stopTicker = () => {
  if (pickerTimer) {
    clearInterval(pickerTimer)
    pickerTimer = null
  }
}
const startTicker = () => {
  stopTicker()
  pickerTimer = setInterval(() => {
    const picker = pickerRef.value
    if (!picker || pickerPaused.value || props.selectedId !== null) return
    const firstCard = picker.querySelector('.picker-card')
    if (!firstCard || picker.scrollWidth <= picker.clientWidth) return
    const step = firstCard.offsetWidth + 16
    picker.scrollLeft += 0.55
    if (picker.scrollLeft >= step) {
      picker.scrollLeft -= step
      const [first, ...rest] = displayItems.value
      displayItems.value = [...rest, first]
    }
  }, 16)
}
const pausePicker = () => { pickerPaused.value = true }
const resumePicker = () => { if (props.selectedId === null) pickerPaused.value = false }
const pickerWheel = (event) => {
  if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    event.preventDefault()
    pausePicker()
    event.currentTarget.scrollLeft += event.deltaX || event.deltaY
  }
}
const chooseCategory = async (categoryId) => {
  emit('update:selectedId', categoryId)
  pickerPaused.value = categoryId !== null
  await nextTick()
  const picker = pickerRef.value
  if (!picker) return
  if (categoryId === null) {
    picker.scrollTo({ left: 0, behavior: 'smooth' })
    pickerPaused.value = false
    return
  }
  const target = displayItems.value.find(item => String(item.categoryId) === String(categoryId))
  document.getElementById(`journey-item-${target?.id}`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

onMounted(startTicker)
onBeforeUnmount(stopTicker)
</script>

<style scoped lang="scss">
.journey-stage-page { min-height:100vh; overflow:hidden; color:#13243d; background:#f8f5ed; }
.journey-stage { position:relative; min-height:clamp(680px,75vh,840px); overflow:hidden; padding:clamp(112px,11vw,160px) max(48px,calc((100vw - 1280px)/2)) 168px; background:radial-gradient(circle at 50% 38%,rgba(224,185,82,.18),transparent 25%),#f8f5ed; }
.stage-copy { position:absolute; top:clamp(136px,16vh,186px); left:max(48px,calc((100vw - 1280px)/2)); z-index:3; width:min(29vw,390px); }
.sequence { margin:0; color:#bf9126; font-size:11px; font-weight:800; letter-spacing:.2em; }
.stage-copy h1 { margin:15px 0 19px; font-family:'Noto Serif SC',serif; font-size:clamp(37px,3.7vw,60px); font-weight:500; letter-spacing:-.07em; line-height:1.12; }
.stage-copy > p:last-child { max-width:300px; margin:0; color:#5d6877; font-size:14px; line-height:1.95; }
.phone-wrap { position:absolute; top:clamp(82px,9vh,112px); left:50%; z-index:1; transform:translateX(-50%); }
.phone { position:relative; display:flex; width:clamp(318px,27vw,454px); min-height:clamp(500px,37vw,630px); flex-direction:column; justify-content:flex-start; gap:20px; padding:clamp(124px,10vw,150px) 47px 56px; overflow:hidden; border:8px solid #13243d; border-radius:52px; background:#fffdfa; box-shadow:22px 25px 0 #e6dfd2,0 26px 55px rgba(19,36,61,.16); }
.phone::before { position:absolute; top:14px; left:50%; width:104px; height:18px; border-radius:0 0 13px 13px; background:#13243d; content:''; transform:translateX(-50%); }
.phone::after { position:absolute; right:-72px; bottom:-73px; width:214px; height:214px; border:1px solid rgba(191,145,38,.3); border-radius:50%; content:''; }
.phone > span { color:#bf9126; font-size:10px; font-weight:800; letter-spacing:.22em; }.phone strong { position:relative; z-index:1; font-family:'Noto Serif SC',serif; font-size:clamp(32px,3.1vw,48px); font-weight:500; letter-spacing:-.06em; line-height:1.16; }.phone small { position:relative; z-index:1; color:#627083; font-size:13px; line-height:1.7; }.phone i { width:52px; border-top:2px solid #c99827; }
.stage-note { position:absolute; top:24%; left:calc(100% + 55px); width:116px; margin:0; color:#43526a; font-size:14px; font-weight:700; line-height:1.55; text-align:center; transform:rotate(7deg); }.stage-note::after { display:block; margin-top:11px; color:#bf9126; content:'⌄'; font-size:28px; }
.journey-picker { position:absolute; right:auto; bottom:26px; left:50%; z-index:4; display:flex; align-items:flex-end; gap:16px; width:min(calc(100% - 48px),1280px); padding:14px 0; overflow-x:auto; cursor:ew-resize; scrollbar-width:none; scroll-behavior:smooth; transform:translateX(-50%); }.journey-picker::-webkit-scrollbar { display:none; }.journey-picker.is-short-list { justify-content:center; }.picker-loading { width:100%; color:#718093; text-align:center; }
.picker-card { position:relative; width:clamp(132px,11vw,178px); min-width:clamp(132px,11vw,178px); padding:0 0 11px; overflow:hidden; border:1px solid rgba(19,36,61,.08); border-radius:14px; background:#fffdfa; box-shadow:0 11px 24px rgba(19,36,61,.1); cursor:pointer; transition:transform .45s cubic-bezier(.16,.84,.36,1),opacity .35s ease,box-shadow .35s ease; }.picker-card:hover { z-index:2; box-shadow:0 18px 34px rgba(19,36,61,.2); transform:translateY(-14px) scale(1.03); }.journey-picker.has-selection .picker-card:not(.is-focused) { opacity:.48; transform:scale(.9); }.journey-picker.has-selection .picker-card.is-focused { z-index:2; box-shadow:0 22px 42px rgba(19,36,61,.22); transform:translateY(-18px) scale(1.1); }
.picker-image { position:relative; height:clamp(116px,9.5vw,154px); overflow:hidden; background:#e8ece9; }.picker-image :deep(.el-image) { width:100%; height:100%; transition:transform .45s ease; }.picker-card:hover .picker-image :deep(.el-image) { transform:scale(1.08); }.picker-image span { position:absolute; top:8px; right:8px; padding:4px 7px; color:#fffdf8; background:#b88722; font-size:9px; font-weight:700; }.picker-card > p { margin:10px 11px 0; overflow:hidden; color:#213953; font-size:12px; font-weight:800; text-overflow:ellipsis; white-space:nowrap; }.picker-card > small { display:block; margin:5px 11px 0; color:#bf9126; font-size:9px; font-weight:800; white-space:nowrap; }
.category-dock { position:sticky; top:0; z-index:20; display:flex; justify-content:center; gap:clamp(24px,3vw,48px); width:100%; padding:18px 24px 24px; overflow-x:auto; background:#f8f5ed; scrollbar-width:none; }.category-dock::-webkit-scrollbar { display:none; }.category-dock button { position:relative; flex:0 0 auto; padding:0 0 7px; border:0; color:#697587; background:transparent; font:inherit; font-size:17px; cursor:pointer; transition:color .25s ease,font-weight .25s ease; }.category-dock button::after { position:absolute; right:0; bottom:0; left:0; height:2px; background:#c99827; content:''; transform:scaleX(0); transition:transform .25s ease; }.category-dock button:hover,.category-dock button.active { color:#13243d; font-weight:800; }.category-dock button:hover::after,.category-dock button.active::after { transform:scaleX(1); }
.selection-copy { width:min(760px,calc(100% - 48px)); padding:clamp(88px,12vw,170px) 0; margin:auto; text-align:center; }.selection-copy h2 { margin:16px 0 18px; font-family:'Noto Serif SC',serif; font-size:clamp(34px,4.5vw,62px); font-weight:500; letter-spacing:-.06em; }.selection-copy > p:last-of-type { max-width:520px; margin:0 auto; color:#687587; font-size:15px; line-height:2; }
@media (max-width:820px) { .journey-stage { min-height:760px; padding-inline:26px; }.stage-copy { top:108px; left:26px; width:calc(100% - 52px); text-align:center; }.stage-copy > p:last-child { margin-inline:auto; }.phone-wrap { top:300px; }.phone { width:235px; min-height:330px; justify-content:center; padding:40px 28px; border-radius:38px; }.stage-note { display:none; }.journey-picker { left:0; width:100%; padding-inline:18px; transform:none; }.picker-card { width:150px; min-width:150px; }.category-dock { justify-content:flex-start; }.category-dock button { font-size:14px; } }
@media (prefers-reduced-motion:reduce) { .journey-picker { scroll-behavior:auto; } }
</style>

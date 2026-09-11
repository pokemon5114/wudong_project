<template>
  <div class="home">
    <section class="splash" :class="'phase-' + splashPhase" aria-label="乌东影像开场">
      <div class="splash-stage">
        <p class="splash-type" aria-label="A journey through Wudong"><span>A journey through Wudong.</span></p>
        <div class="splash-title" aria-live="polite"><h1>从山路出发，<br />慢慢遇见乌东。</h1></div>
        <div class="splash-deck" aria-hidden="true">
          <figure v-for="(photo, index) in splashCards" :key="photo.key" class="splash-card" :style="splashCardStyle(index)">
            <el-image :src="photo.image" :alt="photo.title" fit="cover" />
          </figure>
        </div>
        <p class="splash-hint">向下滑动，开始这段乌东旅程 <span>↓</span></p>
      </div>
    </section>

    <section id="page-opening" class="opening wrap">
      <p class="eyebrow">DAY 01</p>
      <div><p class="opening-kicker">从一段陌生的山路，走进一座有温度的村寨。</p><h2>“我想用四种靠近，<br />认识乌东。”</h2></div>
      <p>不赶行程，也不急着打卡。先穿过一件衣裳里的手工纹样，再吃一口酸香的苗家风味；在木楼住下，然后循着山势去看更远的风景。</p>
    </section>

    <nav class="side-nav" :class="{ 'is-open': sideNavOpen }" aria-label="乌东游记目录" @mouseenter="showSideNav" @mouseleave="hideSideNav">
      <button class="side-toggle" type="button" :aria-label="sideNavOpen ? '收起章节目录' : '展开章节目录'" @click="toggleSideNav">
        <el-icon><Setting /></el-icon>
      </button>
      <div class="side-items">
        <button type="button" @click="scrollTo('page-opening')"><span>00</span>序</button>
        <button v-for="chapter in chapters" :key="chapter.id" type="button" @click="scrollTo(chapter.anchor)"><span>{{ chapter.number }}</span>{{ chapter.shortTitle }}</button>
        <button type="button" @click="scrollTo('page-community')"><span>05</span>纪</button>
      </div>
    </nav>

    <main class="story wrap">
      <svg class="story-route" viewBox="0 0 1280 2120" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M260 10C50 182 524 255 327 504C136 747 871 732 697 1009C507 1312 118 1268 442 1534C688 1735 1034 1651 800 2110" /></svg>
      <section v-for="(chapter, index) in chapters" :id="chapter.anchor" :key="chapter.id" class="chapter" :class="{ reverse: index % 2 }">
        <div class="marker"><span>{{ chapter.number }}</span><i></i></div>
        <article class="chapter-text">
          <p class="eyebrow">{{ chapter.english }}</p><p class="symbol">{{ chapter.symbol }}</p>
          <h2>{{ chapter.title }}</h2><p>{{ chapter.summary }}</p>
          <router-link class="text-link" :to="chapter.link">{{ chapter.action }} <span>↗</span></router-link>
        </article>
        <router-link class="chapter-photo" :to="chapter.link">
          <img :src="chapter.image" :alt="chapter.title" /><span class="caption">{{ chapter.caption }}</span><span class="index">0{{ index + 1 }}</span>
        </router-link>
      </section>
    </main>

    <section class="curated">
      <div class="wrap curated-heading-wrap">
        <div class="heading"><p class="eyebrow">TAKE A PIECE OF THE JOURNEY</p><h2>旅程里，值得停留的片刻</h2><p>从当前推荐内容中挑出的几站；向右滑动，继续探索。</p></div>
        <div class="rail-controls" aria-label="浏览旅程片刻">
          <button class="rail-control" type="button" aria-label="向左浏览" :disabled="!canRailLeft" @click="scrollRail(-1)">←</button>
          <button class="rail-control" type="button" aria-label="向右浏览" :disabled="!canRailRight" @click="scrollRail(1)">→</button>
        </div>
      </div>
      <div ref="photoRail" class="photo-rail" @scroll.passive="updateRailControls">
        <router-link v-for="(stop, index) in curatedStops" :key="stop.kind + '-' + stop.id" class="stop-card" :to="stop.link">
          <div class="stop-photo"><el-image :src="stop.image" fit="cover" lazy><template #error><div class="fallback">乌东</div></template></el-image><span>{{ stop.kind }}</span></div>
          <div class="stop-text"><small>0{{ index + 1 }} · {{ stop.kind }}</small><h3>{{ stop.title }}</h3><p>{{ stop.description }}</p><b>去看看 ↗</b></div>
        </router-link>
      </div>
    </section>

    <section id="page-community" class="community">
      <div class="community-copy"><p class="eyebrow light">PEOPLE MET ON THE ROAD</p><h2>旅途中，<br />也遇见别人的乌东</h2><p>有人记住清晨的梯田，有人分享一桌热气腾腾的饭。每一条记录，都是下一位旅人的出发理由。</p><router-link class="text-link light-link" to="/community">进入人文纪行 <span>↗</span></router-link></div>
      <div class="photo-wall">
        <router-link v-for="(post, index) in posts.slice(0, 4)" :key="post.id" :to="'/community/post/' + post.id" class="note" :class="'note-' + (index + 1)">
          <el-image :src="post.images?.[0] || fallbacks[index]" fit="cover" lazy /><span>{{ post.user?.nickname || '旅人' }}</span>
        </router-link>
      </div>
    </section>
    <section class="closing"><p>THE ROAD IS STILL OPEN</p><h2>下一段乌东故事，<br />等你写下。</h2><router-link to="/tickets" class="pill navy">规划我的旅程 <span>↗</span></router-link></section>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { getRecommendProducts } from '@/api/product'
import { getRecommendRestaurants } from '@/api/restaurant'
import { getRecommendHotels } from '@/api/hotel'
import { getRecommendRoutes } from '@/api/ticket'
import { getFeaturedPosts } from '@/api/community'

const chapters = [
  { id: 'clothes', number: '01', shortTitle: '衣', anchor: 'chapter-clothes', english: 'WEAR THE STORY', symbol: '衣', title: '先从一件衣裳，读懂山里的时间。', summary: '银饰会随着步伐轻响，蜡染把山川和祝愿留在布上。那些不急于完成的手工，是乌东最安静也最明亮的语言。', action: '去看看非遗好物', link: '/products', caption: '把纹样穿在身上，也把故事带回家。', image: 'https://images.pexels.com/photos/15955334/pexels-photo-15955334.jpeg?auto=compress&cs=tinysrgb&w=1400' },
  { id: 'food', number: '02', shortTitle: '食', anchor: 'chapter-food', english: 'TASTE THE VILLAGE', symbol: '食', title: '一口酸香，让陌生人坐到同一张桌前。', summary: '长桌宴不是一张菜单，而是一种邀请。热气、歌声和刚端上桌的苗家滋味，会替你把这座村寨介绍得很完整。', action: '去尝尝苗家风味', link: '/restaurants', caption: '把山野、河流和时令，做成一桌饭。', image: 'https://images.pexels.com/photos/34156954/pexels-photo-34156954.jpeg?auto=compress&cs=tinysrgb&w=1400' },
  { id: 'stay', number: '03', shortTitle: '住', anchor: 'chapter-stay', english: 'STAY A LITTLE LONGER', symbol: '住', title: '在吊脚楼的灯火里，住进一晚山风。', summary: '当白天的脚步慢下来，木楼的窗、远处的山和屋檐下的风，会让“住宿”变成一次真正的停留。', action: '去选择今晚的住处', link: '/hotels', caption: '推开窗，听见村寨慢慢睡去。', image: 'https://images.pexels.com/photos/16582298/pexels-photo-16582298.jpeg?auto=compress&cs=tinysrgb&w=1400' },
  { id: 'travel', number: '04', shortTitle: '行', anchor: 'chapter-travel', english: 'FOLLOW THE TRAIL', symbol: '行', title: '沿着山势前行，把风景走成自己的路线。', summary: '去梯田等一场日出，进古寨听一段故事。乌东的路没有标准答案，只有每一次停下时看见的不同风景。', action: '去规划一段行程', link: '/tickets', caption: '让下一次转弯，通往更开阔的地方。', image: 'https://images.pexels.com/photos/6129969/pexels-photo-6129969.jpeg?auto=compress&cs=tinysrgb&w=1400' }
]
const products = ref([]), restaurants = ref([]), hotels = ref([]), routes = ref([]), posts = ref([])
const sideNavOpen = ref(false)
const photoRail = ref(null)
const canRailLeft = ref(false)
const canRailRight = ref(false)
const hasLeftOpening = ref(false)
const splashPhase = ref('typing')
const splashTimers = []
const fallbacks = chapters.map(item => item.image)
const byKind = { 衣: chapters[0].image, 食: chapters[1].image, 住: chapters[2].image, 行: chapters[3].image }
const splashFallbacks = chapters.map((chapter, index) => ({ key: 'fallback-' + index, title: chapter.shortTitle + ' · 乌东片刻', image: chapter.image }))
const splashPhotos = computed(() => {
  const format = (items, kind) => (items || []).map(item => ({
    key: kind + '-' + item.id,
    title: item.name || item.user?.nickname || '乌东片刻',
    image: item.coverImage || item.images?.[0]
  })).filter(item => item.image)
  const photos = [
    ...format(routes.value, 'route'),
    ...format(hotels.value, 'hotel'),
    ...format(restaurants.value, 'food'),
    ...format(products.value, 'product'),
    ...format(posts.value, 'post')
  ].slice(0, 10)
  return photos.length ? photos : splashFallbacks
})
const splashCards = computed(() => splashPhotos.value.slice(0, 6))
const splashPositions = [
  { fanX: -535, fanY: 36, fanR: -19, scatterX: '-43vw', scatterY: '-35vh', scatterR: -29 },
  { fanX: -340, fanY: -4, fanR: -8, scatterX: '-46vw', scatterY: '2vh', scatterR: 13 },
  { fanX: -128, fanY: 18, fanR: 3, scatterX: '-29vw', scatterY: '-45vh', scatterR: -10 },
  { fanX: 75, fanY: -14, fanR: -5, scatterX: '29vw', scatterY: '-43vh', scatterR: 18 },
  { fanX: 286, fanY: 15, fanR: 11, scatterX: '45vw', scatterY: '-28vh', scatterR: -17 },
  { fanX: 515, fanY: -2, fanR: 20, scatterX: '0vw', scatterY: '-5vh', scatterR: 28 }
]
const splashCardStyle = index => {
  const position = splashPositions[index] || splashPositions[0]
  const withUnit = value => typeof value === 'number' ? value + 'px' : value
  return {
    '--fan-x': position.fanX + 'px', '--fan-y': position.fanY + 'px', '--fan-r': position.fanR + 'deg',
    '--scatter-x': withUnit(position.scatterX), '--scatter-y': withUnit(position.scatterY), '--scatter-r': position.scatterR + 'deg', '--order': index
  }
}
const curatedStops = computed(() => {
  const make = (items, kind, prefix) => (items || []).slice(0, 2).map(item => ({ id: item.id, kind, title: item.name || '乌东旅程推荐', description: item.description || item.address || '去感受这一站独有的乌东风景。', image: item.coverImage || byKind[kind], link: prefix + '/' + item.id }))
  return [...make(products.value, '衣', '/products'), ...make(restaurants.value, '食', '/restaurants'), ...make(hotels.value, '住', '/hotels'), ...make(routes.value, '行', '/routes')]
})
const updateRailControls = () => {
  const rail = photoRail.value
  if (!rail) return
  canRailLeft.value = rail.scrollLeft > 4
  canRailRight.value = rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4
}
const scrollRail = direction => {
  const rail = photoRail.value
  if (!rail) return
  const card = rail.querySelector('.stop-card')
  const distance = (card?.getBoundingClientRect().width || rail.clientWidth * .7) + 20
  rail.scrollBy({ left: direction * distance, behavior: 'smooth' })
}
const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const showSideNav = () => { sideNavOpen.value = true }
const hideSideNav = () => { if (!hasLeftOpening.value) sideNavOpen.value = false }
const toggleSideNav = () => { sideNavOpen.value = !sideNavOpen.value }
const updateSideNav = () => {
  hasLeftOpening.value = window.scrollY > 260
  if (hasLeftOpening.value) sideNavOpen.value = true
}
const revealSideNavNearEdge = event => {
  if (event.clientX > window.innerWidth - 108) sideNavOpen.value = true
  else if (!hasLeftOpening.value) sideNavOpen.value = false
}
const startSplashSequence = () => {
  splashTimers.forEach(window.clearTimeout)
  splashTimers.length = 0
  splashPhase.value = 'typing'
  splashTimers.push(window.setTimeout(() => { splashPhase.value = 'scattered' }, 2900))
  splashTimers.push(window.setTimeout(() => { splashPhase.value = 'revealed' }, 4100))
  splashTimers.push(window.setTimeout(() => { splashPhase.value = 'collecting' }, 6200))
  splashTimers.push(window.setTimeout(() => { splashPhase.value = 'settled' }, 7650))
}
onMounted(async () => {
  updateSideNav()
  window.addEventListener('scroll', updateSideNav, { passive: true })
  window.addEventListener('pointermove', revealSideNavNearEdge, { passive: true })
  window.addEventListener('resize', updateRailControls, { passive: true })
  startSplashSequence()
  try {
    const [a, b, c, d, e] = await Promise.all([getRecommendProducts(4), getRecommendRestaurants(4), getRecommendHotels(4), getRecommendRoutes(4), getFeaturedPosts(4)])
    if (a.code === 0) products.value = a.data || []
    if (b.code === 0) restaurants.value = b.data || []
    if (c.code === 0) hotels.value = c.data || []
    if (d.code === 0) routes.value = d.data || []
    if (e.code === 0) posts.value = e.data || []
  } catch (error) { console.error('Failed to load homepage recommendations:', error) }
  finally { nextTick(updateRailControls) }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateSideNav)
  window.removeEventListener('pointermove', revealSideNavNearEdge)
  window.removeEventListener('resize', updateRailControls)
  splashTimers.forEach(window.clearTimeout)
})
</script>

<style scoped lang="scss">
.phase-scattered .splash-type { opacity: 0; transition: opacity .25s ease; }
.home { overflow-x: clip; color: #13243d; background: #f8f5ed; }.wrap { width: min(100%, 1260px); padding-inline: 48px; margin-inline: auto; }.eyebrow { color: #bf9126; font-size: 11px; font-weight: 700; letter-spacing: .2em; }.light { color: #f1ce75; }
.splash { display:grid; min-height:min(760px,84vh); overflow:hidden; padding:30px; background:#edf1ef; }.splash-stage { position:relative; width:100%; min-height:calc(min(760px,84vh) - 60px); overflow:hidden; border-radius:34px; background:radial-gradient(circle at 50% 28%,#fff 0 14%,rgba(255,255,255,.73) 30%,transparent 58%),linear-gradient(135deg,#f9f7f1,#e8f0ee); box-shadow:inset 0 0 0 1px rgba(25,53,70,.05); }.splash-stage::before { position:absolute; inset:0; background:linear-gradient(110deg,transparent 48%,rgba(205,163,64,.06) 50%,transparent 52%); background-size:210% 100%; content:''; animation:stage-light 4.6s ease-in-out infinite; }.splash-type { position:absolute; top:35%; left:50%; z-index:3; width:0; margin:0; overflow:hidden; color:#142b45; font-size:clamp(30px,4.1vw,68px); font-weight:650; letter-spacing:-.065em; line-height:1.05; transform:translateX(-50%); white-space:nowrap; }.splash-type span { display:inline-block; padding-right:.15em; border-right:2px solid #c7952d; }.phase-typing .splash-type { animation:type-line 2.65s steps(25,end) .35s forwards; }.phase-typing .splash-type span { animation:caret .72s step-end infinite; }.splash-title { position:absolute; top:33%; left:50%; z-index:4; width:min(92%,780px); opacity:0; text-align:center; transform:translate(-50%,16px); transition:opacity .7s ease,transform .8s cubic-bezier(.16,.84,.36,1); }.splash-title p { margin:0 0 15px; color:#bf8b24; font-size:10px; font-weight:700; letter-spacing:.48em; }.splash-title h1 { margin:0; color:#152b45; font-family:'Noto Serif SC',serif; font-size:clamp(36px,4.6vw,67px); font-weight:500; letter-spacing:-.06em; line-height:1.15; }.phase-revealed .splash-type,.phase-settled .splash-type { opacity:0; transition:opacity .25s ease; }.phase-revealed .splash-title,.phase-settled .splash-title { opacity:1; transform:translate(-50%,0); }.splash-deck { position:absolute; inset:0; z-index:2; pointer-events:none; }.splash-card { position:absolute; bottom:-75px; left:50%; width:clamp(154px,13.5vw,232px); height:clamp(225px,20vw,335px); margin:0; overflow:hidden; border:0; border-radius:18px; background:#dce4e1; box-shadow:0 14px 30px rgba(21,43,57,.18); transform:translateX(calc(-50% + var(--fan-x))) translateY(var(--fan-y)) rotate(var(--fan-r)); transform-origin:50% 105%; transition:transform 1.2s cubic-bezier(.16,.84,.36,1),box-shadow .75s ease; }.splash-card :deep(.el-image) { width:100%; height:100%; }.splash-card:nth-child(1) { z-index:1; }.splash-card:nth-child(2) { z-index:2; }.splash-card:nth-child(3) { z-index:3; }.splash-card:nth-child(4) { z-index:4; }.splash-card:nth-child(5) { z-index:5; }.splash-card:nth-child(6) { z-index:6; }.phase-scattered .splash-card,.phase-revealed .splash-card { box-shadow:0 22px 43px rgba(21,43,57,.19); transform:translateX(calc(-50% + var(--scatter-x))) translateY(var(--scatter-y)) rotate(var(--scatter-r)) scale(.88); }.phase-settled .splash-card { animation:card-settle .9s cubic-bezier(.16,.84,.36,1) both; }.splash-hint { position:absolute; right:0; bottom:23px; left:0; z-index:8; margin:0; color:#71818a; font-size:10px; letter-spacing:.15em; text-align:center; opacity:0; transition:opacity .6s ease 1s; }.splash-hint span { margin-left:7px; color:#b88426; font-size:14px; }.phase-settled .splash-hint { opacity:1; }
.hero { position: relative; display: flex; min-height: min(790px, calc(100vh - 82px)); align-items: center; overflow: hidden; color: #fff; isolation: isolate; }.hero-image,.hero-mask { position: absolute; inset: 0; }.hero-image { z-index: -2; background: url('https://images.pexels.com/photos/6129969/pexels-photo-6129969.jpeg?auto=compress&cs=tinysrgb&w=2000') center / cover; animation: breathe 14s ease-in-out infinite alternate; }.hero-mask { z-index: -1; background: linear-gradient(90deg,rgba(8,24,44,.9),rgba(12,32,56,.6) 48%,rgba(8,19,33,.14)); }.hero-route { position: absolute; right: -4%; bottom: 5%; width: 90%; opacity: .9; }.hero-route path,.story-route path { stroke: #e1b84f; stroke-width: 2; stroke-dasharray: 16 13; animation: flow 3s linear infinite; }.hero-route circle { fill: #f7d778; animation: pulse 2s ease-in-out infinite; }.hero-copy { padding-block: 82px 100px; }.hero h1 { max-width: 770px; margin: 18px 0 22px; font-size: clamp(48px,7vw,92px); font-weight: 600; letter-spacing: -.06em; line-height: 1.08; }.hero-copy > p:not(.eyebrow) { max-width: 470px; margin-bottom: 36px; color: rgba(255,255,255,.9); font-size: 17px; line-height: 1.9; }.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; }.pill { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: 18px; padding: 0 22px; border: 1px solid rgba(255,255,255,.55); border-radius: 999px; color: #fff; background: transparent; font-size: 14px; font-weight: 700; transition: .25s; }.pill:hover { color: #fff; transform: translateY(-3px); }.gold { border-color: #e1b84f; background: #e1b84f; color: #142741; cursor: pointer; }.gold:hover { background: #f0ce75; color: #142741; }.ghost:hover { background: rgba(255,255,255,.12); }.hero-foot { position: absolute; right: 48px; bottom: 28px; left: 48px; display: flex; justify-content: space-between; color: rgba(255,255,255,.72); font-size: 10px; letter-spacing: .16em; }
.opening { display: grid; grid-template-columns: .45fr 1.2fr 1fr; gap: clamp(32px,7vw,100px); padding-block: 164px 145px; }.opening p:last-child { max-width: 340px; color: #5e6978; font-size: 15px; line-height: 2; }.opening-kicker { margin-bottom: 18px; color: #5d6877; font-size: 15px; }.opening h2,.heading h2,.community h2,.closing h2 { margin: 0; color: #13243d; font-size: clamp(35px,4.8vw,65px); font-weight: 600; letter-spacing: -.06em; line-height: 1.16; }
.side-nav { position: fixed; top: 50%; right: clamp(14px, 3vw, 52px); z-index: 20; display: flex; flex-direction: column; align-items: flex-end; transform: translateY(-50%); }.side-toggle { display: grid; width: 44px; height: 44px; place-items: center; border: 1px solid rgba(19,36,61,.15); border-radius: 50%; color: #183653; background: rgba(248,245,237,.84); box-shadow: 0 8px 25px rgba(19,36,61,.12); backdrop-filter: blur(14px); cursor: pointer; transition: transform .3s ease, background .3s ease; }.side-toggle .el-icon { font-size: 19px; transition: transform .5s ease; }.side-nav:hover .side-toggle,.side-nav.is-open .side-toggle { background: #183653; color: #f1ce75; }.side-nav.is-open .side-toggle .el-icon { transform: rotate(90deg); }.side-items { display: flex; max-height: 0; flex-direction: column; gap: 7px; padding: 0; overflow: hidden; opacity: 0; transform: translateY(-8px); transition: max-height .38s ease, padding .32s ease, opacity .22s ease, transform .32s ease; }.side-nav.is-open .side-items { max-height: 390px; padding: 10px 1px 8px; opacity: 1; transform: translateY(0); }.side-items button { display: flex; width: 42px; min-height: 42px; flex-direction: column; align-items: center; justify-content: center; gap: 1px; border: 1px solid rgba(19,36,61,.1); border-radius: 12px; background: rgba(248,245,237,.84); color: #40516a; font: inherit; font-size: 13px; box-shadow: 0 5px 16px rgba(19,36,61,.07); cursor: pointer; transition: background .2s,color .2s,transform .2s; }.side-items button span { color: #c99827; font-size: 8px; font-weight: 700; letter-spacing: .08em; }.side-items button:hover { background: #183653; color: #fff; transform: translateX(-3px); }.side-items button:hover span { color: #f1ce75; }
.story { position: relative; padding-block: 80px 65px; }.story-route { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }.story-route path { stroke: #d7a930; stroke-dasharray: 9 12; opacity: .8; }.chapter { position: relative; display: grid; grid-template-columns: minmax(280px,.88fr) minmax(350px,1.12fr); gap: clamp(48px,10vw,150px); min-height: 565px; padding: 90px 5.5vw; align-items: center; }.chapter:target { scroll-margin-top: 150px; }.reverse .chapter-text { order: 2; }.reverse .chapter-photo { order: 1; }.marker { position: absolute; top: 55px; left: 1%; display: flex; align-items: center; gap: 10px; color: #c99827; font-size: 11px; font-weight: 700; letter-spacing: .15em; }.marker i { width: 36px; height: 1px; background: currentColor; }.symbol { margin: 12px 0 4px; color: #d7a930; font-family: serif; font-size: 38px; }.chapter h2 { max-width: 480px; margin: 0 0 22px; font-size: clamp(33px,4vw,54px); font-weight: 600; letter-spacing: -.055em; line-height: 1.2; }.chapter-text > p:not(.eyebrow):not(.symbol) { max-width: 410px; margin-bottom: 28px; color: #5e6978; font-size: 15px; line-height: 2; }.text-link { display: inline-flex; align-items: center; gap: 12px; padding-bottom: 5px; border-bottom: 1px solid #d7a930; color: #13243d; font-size: 14px; font-weight: 700; transition: .25s; }.text-link:hover { gap: 19px; color: #13243d; }.text-link span { color: #c99827; font-size: 19px; }.chapter-photo { position: relative; display: block; min-height: 420px; overflow: hidden; box-shadow: 18px 18px 0 #ece2c9; }.chapter-photo::after { position: absolute; inset: 0; background: linear-gradient(180deg,transparent 55%,rgba(12,30,51,.65)); content: ''; }.chapter-photo img { width: 100%; height: 100%; min-height: 420px; object-fit: cover; transition: .8s; }.chapter-photo:hover img { transform: scale(1.055); }.caption,.index { position: absolute; z-index: 1; color: #fff; }.caption { right: 28px; bottom: 24px; left: 28px; font-size: 14px; }.index { top: 19px; right: 20px; font-size: 12px; letter-spacing: .15em; }
.curated { padding: 140px 0 132px; background: #e8e5dd; }.curated-heading-wrap { display:flex; align-items:end; justify-content:space-between; gap:30px; margin-bottom:48px; }.heading { margin-bottom:0; }.heading h2 { margin: 14px 0 15px; }.heading > p:last-child { color: #5d6877; font-size: 15px; }.rail-controls { display:flex; flex-shrink:0; gap:10px; padding-bottom:4px; }.rail-control { display:grid; width:44px; height:44px; place-items:center; border:1px solid rgba(19,36,61,.22); border-radius:50%; background:transparent; color:#183653; font:400 25px/1 sans-serif; cursor:pointer; transition:transform .25s ease,background .25s ease,color .25s ease,border-color .25s ease; }.rail-control:hover:not(:disabled) { border-color:#183653; background:#183653; color:#fffdfa; transform:translateY(-2px); }.rail-control:focus-visible { outline:2px solid #c99827; outline-offset:3px; }.rail-control:disabled { opacity:.3; cursor:not-allowed; }.photo-rail { display: flex; gap: 20px; padding: 0 max(48px,calc((100vw - 1260px)/2 + 48px)) 24px; overflow-x: auto; scroll-behavior:smooth; scroll-snap-type: x mandatory; scrollbar-width:none; }.photo-rail::-webkit-scrollbar { display:none; }.stop-card { display: flex; width: min(72vw,430px); min-width: min(72vw,430px); min-height: 410px; flex-direction: column; scroll-snap-align: start; background: #fdfcf8; box-shadow: 0 15px 35px rgba(26,39,58,.1); transition: .3s; }.stop-card:hover { color: inherit; transform: translateY(-8px); box-shadow: 0 24px 45px rgba(26,39,58,.16); }.stop-photo { position: relative; height: 230px; overflow: hidden; background: #d5d5d2; }.stop-photo :deep(.el-image) { width: 100%; height: 100%; transition: .6s; }.stop-card:hover :deep(.el-image) { transform: scale(1.04); }.stop-photo > span { position: absolute; top: 16px; left: 16px; padding: 5px 11px; background: #fdfcf8; color: #20344f; font-size: 12px; font-weight: 700; }.stop-text { display: flex; flex: 1; flex-direction: column; padding: 22px 24px 24px; }.stop-text small { color: #bd8e20; font-size: 10px; font-weight: 700; }.stop-text h3 { margin: 9px 0 8px; color: #13243d; font-size: 22px; }.stop-text p { display: -webkit-box; overflow: hidden; color: #687382; font-size: 13px; line-height: 1.75; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }.stop-text b { margin-top: auto; color: #13243d; font-size: 13px; }.fallback { display: grid; width: 100%; height: 100%; place-items: center; background: #d7d4cc; }
.community { display: grid; grid-template-columns: minmax(280px,.78fr) minmax(420px,1.22fr); gap: clamp(44px,8vw,120px); padding: 145px max(48px,calc((100vw - 1160px)/2)); background: #183653; }.community-copy { align-self: center; }.community h2 { margin: 14px 0 23px; color: #fff; }.community-copy > p:not(.eyebrow) { max-width: 355px; color: rgba(255,255,255,.74); font-size: 15px; line-height: 2; }.light-link { margin-top: 26px; color: #fff; border-color: #e0b952; }.light-link:hover { color: #fff; }.photo-wall { position: relative; min-height: 485px; }.note { position: absolute; overflow: hidden; background: #294967; box-shadow: 10px 12px 0 rgba(255,255,255,.13); transition: .3s; }.note :deep(.el-image) { width: 100%; height: 100%; }.note:hover { color: #fff; transform: translateY(-8px) rotate(0deg) !important; }.note span { position: absolute; right: 14px; bottom: 12px; left: 14px; color: #fff; font-size: 12px; font-weight: 700; text-shadow: 0 1px 8px #000; }.note-1 { top: 12px; left: 4%; width: 43%; height: 270px; transform: rotate(-4deg); }.note-2 { top: 55px; right: 4%; width: 42%; height: 202px; transform: rotate(4deg); }.note-3 { bottom: 8px; left: 21%; width: 46%; height: 250px; transform: rotate(-1deg); }.note-4 { right: 0; bottom: 34px; width: 27%; height: 176px; transform: rotate(5deg); }.closing { padding: 155px 48px 165px; text-align: center; background: #f8f5ed; }.closing > p { color: #c99827; font-size: 11px; font-weight: 700; letter-spacing: .2em; }.closing h2 { margin: 15px 0 34px; }.navy { border: 0; background: #183653; }.navy:hover { background: #285678; }
@keyframes breathe { to { transform: scale(1.1); } } @keyframes flow { to { stroke-dashoffset: -145; } } @keyframes pulse { 50% { opacity: .42; transform: scale(.74); } } @keyframes type-line { to { width:25ch; } } @keyframes caret { 50% { border-color:transparent; } } @keyframes stage-light { 50% { background-position:100% 0; } } @keyframes card-settle { from { filter:brightness(.94); } to { filter:brightness(1); } }
@media (max-width:920px) { .opening { grid-template-columns:1fr; padding-block:120px 95px; }.side-nav { left:12px; }.chapter { grid-template-columns:1fr; min-height:auto; padding:80px 5vw; }.reverse .chapter-text,.reverse .chapter-photo { order:initial; }.community { grid-template-columns:1fr; }.photo-wall { min-height:410px; } }
@media (max-width:620px) { .wrap { padding-inline:24px; }.splash { min-height:670px; padding:14px; }.splash-stage { min-height:642px; border-radius:24px; }.splash-type { top:37%; font-size:29px; }.splash-title { top:34%; }.splash-title h1 { font-size:37px; }.splash-card { width:145px; height:212px; }.splash-hint { font-size:9px; }.side-nav { display:none; }.chapter { gap:31px; padding-inline:4vw; }.chapter-photo,.chapter-photo img { min-height:310px; }.curated { padding-block:95px 90px; }.curated-heading-wrap { align-items:flex-start; gap:18px; }.rail-controls { padding-top:10px; }.rail-control { width:38px; height:38px; font-size:22px; }.photo-rail { padding-inline:24px; }.stop-card { width:82vw; min-width:82vw; }.community { padding:98px 24px; }.photo-wall { min-height:350px; }.note-1 { width:49%; height:197px; }.note-2 { width:46%; height:155px; }.note-3 { width:50%; height:184px; }.note-4 { width:31%; height:132px; }.closing { padding:105px 24px; } }
@media (prefers-reduced-motion:reduce) { *,*::before,*::after { scroll-behavior:auto!important; animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; } }
.splash { padding:0; background:#f8f5ed; }.splash-stage { min-height:min(760px,84vh); border-radius:0; background:radial-gradient(circle at 50% 31%,#fff 0 13%,rgba(255,255,255,.67) 34%,transparent 62%),#f8f5ed; box-shadow:none; }.splash-stage::before { background:linear-gradient(110deg,transparent 48%,rgba(205,163,64,.045) 50%,transparent 52%); }.splash-type { top:35%; width:0; transform:translate(-50%,-50%) scale(1); transform-origin:center; transition:top .9s cubic-bezier(.16,.84,.36,1),transform .9s cubic-bezier(.16,.84,.36,1),opacity .35s ease; }.phase-typing .splash-type { animation:type-line 2.65s steps(25,end) .35s forwards; }.phase-scattered .splash-type,.phase-revealed .splash-type,.phase-settled .splash-type { top:12%; width:32ch; opacity:1; transform:translate(-50%,0) scale(.46); animation:none; }.phase-scattered .splash-type span,.phase-revealed .splash-type span,.phase-settled .splash-type span { border-right-color:transparent; }.splash-title { top:31%; }.splash-title h1 { margin:0; font-size:clamp(36px,3.9vw,58px); line-height:1.18; }.splash-card { bottom:-146px; width:clamp(148px,12.8vw,220px); height:clamp(216px,18.5vw,310px); border-radius:16px; }.phase-settled .splash-card { animation:fan-drift 6.2s ease-in-out infinite; animation-delay:calc(var(--order) * -640ms); }.splash-hint { bottom:18px; }.splash-hint span { font-size:13px; } @keyframes type-line { to { width:32ch; } } @keyframes fan-drift { 0%,100% { transform:translateX(calc(-50% + var(--fan-x))) translateY(var(--fan-y)) rotate(var(--fan-r)); } 50% { transform:translateX(calc(-50% + var(--fan-x))) translateY(calc(var(--fan-y) - 10px)) rotate(var(--fan-r)); } }
@keyframes fan-drift { 0%,100% { transform:translateX(calc(-50% + var(--fan-x))) translateY(var(--fan-y)) rotate(var(--fan-r)); } 50% { transform:translateX(calc(-50% + var(--fan-x) + 13px)) translateY(calc(var(--fan-y) - 10px)) rotate(var(--fan-r)); } }
.splash-type { line-height:1.32; padding-block:.12em; }.phase-scattered .splash-type,.phase-revealed .splash-type,.phase-settled .splash-type { top:18%; }.splash-title { top:30%; }.splash-card { bottom:-86px; pointer-events:auto; }.splash-deck { pointer-events:none; }.phase-settled .splash-card { animation:fan-drift 5.4s ease-in-out infinite; animation-delay:calc(var(--order) * -600ms); }.phase-settled .splash-card:hover { z-index:12; animation-play-state:paused; box-shadow:0 28px 46px rgba(21,43,57,.28); transform:translateX(calc(-50% + var(--fan-x))) translateY(calc(var(--fan-y) - 44px)) rotate(var(--fan-r)) scale(1.045); transition:transform .42s cubic-bezier(.16,.84,.36,1),box-shadow .35s ease; }.splash-card:hover :deep(.el-image) { transform:scale(1.035); transition:transform .45s ease; } @keyframes fan-drift { 0%,100% { transform:translateX(calc(-50% + var(--fan-x) - 22px)) translateY(var(--fan-y)) rotate(var(--fan-r)); } 50% { transform:translateX(calc(-50% + var(--fan-x) + 22px)) translateY(calc(var(--fan-y) - 10px)) rotate(var(--fan-r)); } }
.splash-type { left:0; width:100%; overflow:visible; text-align:center; transform:translateY(-50%) scale(1); }.splash-type span { width:0; overflow:hidden; padding-block:.16em; line-height:1.32; vertical-align:middle; }.phase-typing .splash-type { animation:none; }.phase-typing .splash-type span { animation:type-line 2.65s steps(25,end) .35s forwards,caret .72s step-end infinite; }.phase-scattered .splash-type,.phase-revealed .splash-type,.phase-settled .splash-type { left:0; width:100%; transform:translateY(0) scale(1); }.phase-scattered .splash-type span,.phase-revealed .splash-type span,.phase-settled .splash-type span { width:auto; overflow:visible; transform:scale(.46); transform-origin:center; }.splash-card { bottom:-35px; }.phase-settled .splash-card { animation:fan-drift 5.4s ease-in-out infinite; }
.phase-collecting .splash-type,.phase-settled .splash-type { top:14%; }.phase-collecting .splash-title,.phase-settled .splash-title { opacity:1; transform:translate(-50%,0); }.splash-card { width:clamp(170px,15.5vw,286px); height:clamp(240px,21.5vw,352px); transition:transform 1.25s cubic-bezier(.16,.84,.36,1),box-shadow .42s ease; }.phase-collecting .splash-card { transform:translateX(calc(-50% + var(--fan-x))) translateY(var(--fan-y)) rotate(var(--fan-r)); transition-delay:calc(var(--order) * 72ms); }.phase-settled .splash-card { transition-delay:0ms; animation:fan-drift 5.4s ease-in-out infinite; }.phase-collecting .splash-hint { opacity:0; } @keyframes fan-drift { 0%,100% { transform:translateX(calc(-50% + var(--fan-x) - 26px)) translateY(var(--fan-y)) rotate(var(--fan-r)); } 50% { transform:translateX(calc(-50% + var(--fan-x) + 26px)) translateY(calc(var(--fan-y) - 12px)) rotate(var(--fan-r)); } }
.splash-title { transition:opacity .7s ease,transform .8s cubic-bezier(.16,.84,.36,1),top .9s cubic-bezier(.16,.84,.36,1); }
.phase-collecting .splash-title,.phase-settled .splash-title { top:24%; }
.splash-type span { transition:transform .9s cubic-bezier(.16,.84,.36,1); }
.phase-scattered .splash-type,.phase-collecting .splash-type,.phase-settled .splash-type { top:clamp(28px,3.2vw,54px); left:0; width:100%; opacity:1; transform:translateY(0) scale(1); text-align:center; }
.phase-scattered .splash-type span,.phase-collecting .splash-type span,.phase-settled .splash-type span { width:auto; overflow:visible; border-right-color:transparent; transform:translateX(-35vw) scale(.46); transform-origin:center; }
</style>

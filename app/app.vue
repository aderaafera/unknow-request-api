<template>
  <component :is="isMobile ? MobileView : WebView">
    <div class="overlay">
      <div class="cards">
        <button class="card card--spor" @click="onSelect('spor')">
          <span class="emoji" aria-hidden="true">⚽</span>
          <span class="title">Spor</span>
        </button>
        <button class="card card--casino" @click="onSelect('casino')">
          <span class="emoji" aria-hidden="true">🎰</span>
          <span class="title">Casino</span>
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="popup.visible" class="popup">
        <div class="popup-content">
          <div class="popup-title">{{ popup.title }}</div>
          <div class="popup-message">{{ popup.message }}</div>
          <button class="popup-close" @click="popup.visible = false">Kapat</button>
        </div>
      </div>
    </transition>
  </component>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import MobileView from '../components/MobileView.vue'
import WebView from '../components/WebView.vue'
import { useRoute } from '#imports'
import { useUsername } from '../composables/useUsername'

const isMobile = ref(false)

function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})

// Read ?username=... from URL and store globally
const route = useRoute()
const { setUsername } = useUsername()

function normalizeUsernameParam(value: unknown): string | null {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : null
  }
  return typeof value === 'string' && value.length > 0 ? value : null
}

function syncUsernameFromRoute() {
  const usernameFromQuery = normalizeUsernameParam(route?.query?.username)
  setUsername(usernameFromQuery)
}

onMounted(() => {
  syncUsernameFromRoute()
})

watch(() => route?.query?.username, () => {
  syncUsernameFromRoute()
})

// UI state
const popup = ref({ visible: false, title: '', message: '' })
const isSubmitting = ref(false)

// IDs from user
const TYPE_TO_CAMPAIGN_ID: Record<string, number> = {
  casino: 598654,
  spor: 598655
}

function showPopup(title: string, message: string) {
  popup.value = { visible: true, title, message }
}

async function onSelect(type: 'spor' | 'casino') {
  const { username } = useUsername()
  const name = username.value

  if (!name) {
    showPopup('Hata', 'Kullanıcı adı bulunamadı. URL ile ?username=... gönderin.')
    return
  }

  const bonusId = TYPE_TO_CAMPAIGN_ID[type]
  isSubmitting.value = true
  showPopup('İşleniyor', `${type === 'spor' ? 'Spor' : 'Casino'} isteği gönderiliyor...`)

  try {
    const payload = {
      username: name,
      bonusId,
      campaignId: null
    }
    console.log('[Client] sending payload', payload)

    const res = await $fetch('/api/bonus.request', {
      method: 'POST',
      body: payload
    })
    console.log('[Client] response', res)
    const r: any = res as any
    if (!r?.ok) {
      showPopup('Hata', r?.error || 'İstek başarısız oldu')
      return
    }
    showPopup('Başarılı', 'İsteğiniz gönderildi.')
  } catch (err: any) {
    console.error('[Client] error', err)
    showPopup('Hata', err?.data?.error || err?.message || 'İstek başarısız oldu')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style>
html, body, #__nuxt {
  width: 100%;
  height: 100%;
  margin: 0;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 320px));
  gap: 20px;
}

.card {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  position: relative;
  border-radius: 16px;
  padding: 24px 28px;
  background: radial-gradient(140% 120% at 50% 0%, rgba(32,36,44,0.96) 0%, rgba(20,22,26,0.98) 60%, rgba(10,12,14,1) 100%);
  color: #ffffff;
  box-shadow: 0 26px 60px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.35) inset;
  transition: transform 0.14s ease, box-shadow 0.14s ease, filter 0.14s ease, background 0.14s ease;
}

.card::before { display: none; }

.card:hover {
  transform: translateY(-3px);
  filter: brightness(1.03);
  box-shadow: 0 26px 64px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.4) inset;
}

.card--spor {
  border-left: 6px solid #36c86f;
}

.card--casino {
  border-left: 6px solid #e273ff;
}

.emoji {
  font-size: 22px;
  margin-right: 10px;
  opacity: 0.95;
}

.title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #ffffff;
  text-shadow: 0 1px 0 rgba(0,0,0,0.35);
}

.card:focus-visible {
  outline: 3px solid rgba(102, 214, 120, 0.65);
  outline-offset: 2px;
}

.popup {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
}

.popup-content {
  background: #111;
  color: #fff;
  padding: 20px 24px;
  border-radius: 12px;
  min-width: 280px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.popup-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.popup-message {
  opacity: 0.9;
}

.popup-close {
  margin-top: 14px;
  border: none;
  background: #2b8a3e;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .cards {
    grid-template-columns: 1fr;
    width: min(420px, 100%);
  }

  .card {
    width: 100%;
    text-align: center;
    padding: 18px 20px;
  }
}
</style>

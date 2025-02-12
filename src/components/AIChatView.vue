<template>
  <q-dialog
    v-model="isOpen"
    position="right"
    full-height
    seamless
    maximized
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card class="ai-chat">
      <!-- Header -->
      <q-card-section class="ai-chat__header">
        <div class="ai-chat__header-content">
          <div class="ai-chat__title">
            <q-icon name="bi-alexa" size="24px" />
            <span>Moss</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="bi-x-lg"
            class="ai-chat__close-btn"
            @click="isOpen = false"
          />
        </div>
      </q-card-section>

      <!-- Chat Messages -->
      <q-card-section class="ai-chat__messages">
        <div class="ai-chat__message ai-chat__message--ai">
          <div class="ai-chat__message-avatar">
            <q-icon name="bi-alexa" size="20px" />
          </div>
          <div class="ai-chat__message-content">
            <div class="ai-chat__message-text">
                Merhaba! Ben Moss, yapay zeka destekli asistanınız. 
                Hasar operasyonları, müşteri hizmetleri ve sigorta süreçleri konusunda özel olarak eğitildim. 
                Size hasar bildirimi, eksper atamaları, müşteri talepleri ve operasyonel süreçler gibi konularda yardımcı olabilirim. Nasıl destek olabilirim?
            </div>
            <div class="ai-chat__message-time">14:30</div>
          </div>
        </div>

        <div class="ai-chat__message ai-chat__message--user">
          <div class="ai-chat__message-content">
            <div class="ai-chat__message-text">
                Merhaba! Yeni bir hasar dosyası oluşturmak istiyorum.
            </div>
            <div class="ai-chat__message-time">14:31</div>
          </div>
        </div>

        <div class="ai-chat__message ai-chat__message--ai">
          <div class="ai-chat__message-avatar">
            <q-icon name="bi-alexa" size="20px" />
          </div>
          <div class="ai-chat__message-content">
            <div class="ai-chat__message-text">
                Tabii ki yardımcı olabilirim. Hasar bildirim sürecinde size rehberlik edeyim. 
                Öncelikle hasarın türü ve detayları hakkında bilgi alabilir miyim?
            </div>
            <div class="ai-chat__message-time">14:31</div>
          </div>
        </div>
      </q-card-section>

      <!-- Input Area -->
      <q-card-section class="ai-chat__input">
        <div class="ai-chat__input-wrapper">
          <q-input
            v-model="message"
            type="textarea"
            placeholder="Mesajınızı yazın..."
            rows="1"
            autogrow
            dense
            class="ai-chat__input-field"
          >
            <template v-slot:after>
              <q-btn
                flat
                round
                dense
                color="grey-8"
                icon="bi-send"
                class="ai-chat__send-btn"
              />
            </template>
          </q-input>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const message = ref('')

defineExpose({
  isOpen
})
</script>

<style lang="sass">
.ai-chat
  width: 400px
  background: #fff
  display: flex
  flex-direction: column
  height: 100%

  &__header
    padding: 16px
    border-bottom: 1px solid rgba(0,0,0,0.06)
    background: linear-gradient(135deg, #d7e1ea, #f5f1ff)

    &-content
      display: flex
      align-items: center
      justify-content: space-between

  &__title
    display: flex
    align-items: center
    gap: 12px
    font-size: 16px
    font-weight: 500
    color: #202124

    .q-icon
      color: #7c4dff
      opacity: 0.9

  &__close-btn
    .q-icon
      font-size: 16px
      color: #5f6368
      opacity: 0.87
    &:hover
      background: rgba(0,0,0,0.04)
      .q-icon
        opacity: 1

  &__messages
    flex: 1
    padding: 16px
    overflow-y: auto
    background: #f9f9f9
    display: flex
    flex-direction: column
    gap: 16px

  &__message
    display: flex
    gap: 12px
    max-width: 85%

    &--ai
      align-self: flex-start

    &--user
      align-self: flex-end
      flex-direction: row-reverse

    &-avatar
      width: 32px
      height: 32px
      min-width: 32px
      border-radius: 16px
      background: #f5f1ff
      display: flex
      align-items: center
      justify-content: center

      .q-icon
        color: #7c4dff
        opacity: 0.9

    &-content
      display: flex
      flex-direction: column
      gap: 4px
      max-width: 100%

    &-text
      padding: 12px 16px
      border-radius: 12px
      font-size: 14px
      line-height: 1.4
      color: #202124
      max-width: 350px
      word-wrap: break-word
      white-space: pre-wrap

    &--ai &-text
      background: #fff
      box-shadow: 0 1px 2px rgba(0,0,0,0.1)
      border: 1px solid rgba(0,0,0,0.06)

    &--user &-text
      background: #f5f1ff
      color: #202124

    &-time
      font-size: 11px
      color: #5f6368
      opacity: 0.8
      align-self: flex-end

  &__input
    padding: 16px
    background: #fff
    border-top: 1px solid rgba(0,0,0,0.06)

    &-wrapper
      background: #f9f9f9
      border-radius: 8px
      transition: all 0.2s ease

      &:focus-within
        background: #fff
        box-shadow: 0 1px 3px rgba(0,0,0,0.1)

    &-field
      .q-field__control
        padding: 8px 12px
        min-height: 40px
        background: transparent
      .q-field__native
        padding: 0
        color: #202124
        font-size: 14px
        line-height: 1.4
      &.q-textarea--autogrow textarea
        padding: 6px 0

  &__send-btn
    margin-left: 8px
    .q-icon
      font-size: 18px
      color: #5f6368
      opacity: 0.87
      transition: all 0.2s ease
    &:hover
      background: rgba(0,0,0,0.04)
      .q-icon
        opacity: 1

  // Scroll bar styling
  ::-webkit-scrollbar
    width: 8px
    height: 8px

  ::-webkit-scrollbar-track
    background: transparent

  ::-webkit-scrollbar-thumb
    background: rgba(0,0,0,0.2)
    border-radius: 4px

    &:hover
      background: rgba(0,0,0,0.3)
</style> 
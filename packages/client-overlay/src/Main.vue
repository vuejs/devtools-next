<script setup lang="ts">
</script>

<template>
  <div id="vue-devtools-anchor">
    <svg viewBox="0 0 256 198" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z" />
      <path fill="#41B883" d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z" />
      <path fill="#35495E" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z" />
    </svg>
  </div>
</template>

<style scoped>
#vue-devtools-anchor {
  position: fixed;
  z-index: 2147483645;
  transform-origin: center center;
  transform: translate(-50%, -50%) rotate(0);
}

#vue-devtools-anchor.fullscreen {
  transform: none !important;
  left: 0 !important;
}

#vue-devtools-anchor .vue-devtools-icon-button {
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  color: inherit;
}

#vue-devtools-anchor.vue-devtools-hide .vue-devtools-panel {
  max-width: 32px;
  padding: 2px 0;
}

#vue-devtools-anchor .vue-devtools-panel-content {
  transition: opacity 0.4s ease;
}

#vue-devtools-anchor .vue-devtools-hide .vue-devtools-panel-content {
  opacity: 0;
}

#vue-devtools-anchor .vue-devtools-glowing {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  opacity: 0;
  transition: all 1s ease;
  pointer-events: none;
  z-index: -1;
  border-radius: 9999px;
  background-image: linear-gradient(45deg, #00dc82, #36e4da, #0047e1);
  filter: blur(60px);
}

#vue-devtools-anchor .vue-devtools-icon-button {
  border-radius: 100%;
  border-width: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
}

#vue-devtools-anchor .vue-devtools-icon-button:hover {
  opacity: 1;
}

#vue-devtools-anchor .vue-devtools-icon-button svg {
  width: 14px;
  height: 14px;
}

#vue-devtools-anchor:hover .vue-devtools-glowing {
  opacity: 0.6;
}

#vue-devtools-anchor .vue-devtools-panel {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
  align-items: center;
  gap: 2px;
  height: 30px;
  padding: 4px 4px 4px 5px;
  box-sizing: border-box;
  border: 1px solid var(--vue-devtools-widget-border);
  border-radius: 20px;
  background-color: var(--vue-devtools-widget-bg);
  backdrop-filter: blur(10px);
  color: var(--vue-devtools-widget-fg);
  box-shadow: 2px 2px 8px var(--vue-devtools-widget-shadow);
  user-select: none;
  max-width: 150px;
  transition: max-width 0.4s ease, padding 0.5s ease, transform 0.3s ease, all 0.4s ease;
}

#vue-devtools-anchor .vue-devtools-vue-button {
  flex: none;
}

#vue-devtools-anchor.vue-devtools-vertical .vue-devtools-vue-button {
  transform: rotate(-90deg);
}

#vue-devtools-anchor.vue-devtools-hide .vue-devtools-panel {
  max-width: 32px;
  padding: 2px 0;
}

#vue-devtools-anchor.vue-devtools-vertical .vue-devtools-panel {
  transform: translate(-50%, -50%) rotate(90deg);
  box-shadow: 2px -2px 8px var(--vue-devtools-widget-shadow);
}

#vue-devtools-anchor .vue-devtools-inspector-button.disabled {
  opacity: 0.2;
  cursor: not-allowed;
  animation: blink 1.5s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.6;
  }

  100% {
    opacity: 0.2;
  }
}

@media print {
  #vue-devtools-anchor {
    display: none;
  }
}
</style>

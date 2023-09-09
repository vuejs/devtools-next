import { ref } from 'vue'

export function useIframe(clientUrl: string, onLoad: () => void) {
  const iframe = ref<HTMLIFrameElement>()
  function getIframe() {
    if (iframe.value)
      return iframe.value
    iframe.value = document.createElement('iframe')
    iframe.value.id = 'vue-devtools-iframe'
    iframe.value.src = clientUrl
    iframe.value.setAttribute('data-v-inspector-ignore', 'true')
    iframe.value.onload = onLoad
    return iframe.value
  }

  return {
    getIframe,
    iframe,
  }
}

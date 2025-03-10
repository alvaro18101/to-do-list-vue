import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Nueva versión disponible. ¿Actualizar ahora?")) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log("La aplicación ahora funciona sin conexión.")
  }
})

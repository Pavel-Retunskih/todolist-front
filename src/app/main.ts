import { createApp } from 'vue'
import App from '@/app/App.vue'
import { router } from '@/app/router/router.ts'
import { configure } from 'vee-validate'
import { setupProviders } from '@/app/providers'

configure({
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
})

const app = createApp(App)

// Use FSD providers
setupProviders(app)
app.use(router)
app.mount('#app')

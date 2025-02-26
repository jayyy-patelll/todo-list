import { createApp } from 'vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Components
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(vuetify).mount('#app')

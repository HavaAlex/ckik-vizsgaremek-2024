import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VTimePicker } from 'vuetify/labs/VTimePicker' // Import from Labs

const vuetify = createVuetify({
  components: {
    ...components, // Spread existing components
    VTimePicker,   // Add the VTimePicker separately
  },
  directives,
})

export default vuetify

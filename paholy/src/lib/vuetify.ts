import 'vuetify/styles'
import { createVuetify ,type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VTimePicker } from 'vuetify/labs/VTimePicker' // Import from Labs

const paholy: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#333333',
    surface: '#525252',
    primary: '#631313',
    'primary-darken-1': '#851d15',
    secondary: '#631313',
    'secondary-darken-1': '#333333',
    error: '#fff200',
    info: '#989cfa',
    success: '#98fa9a',
    warning: '#ff9500',
    navbar:'#3d0c0c',
    title:'#525252'
  },
}

const vuetify = createVuetify({
  components: {
    ...components, // Spread existing components
    VTimePicker,   // Add the VTimePicker separately
  },
  directives,
  theme: {
    defaultTheme: 'paholy',
    themes: {
      paholy,
    },
  },
})

export default vuetify

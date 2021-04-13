import { createApp } from 'vue'
// import { inspect } from '@xstate/inspect'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { auth } from './firebase'
import '../public/index.css'
import App from './App.vue'
import SvgIcon from './components/SvgIcon.vue'
import NavigationBar from './components/NavigationBar.vue'

// LogRocket
// import LogRocket from 'logrocket'
// LogRocket.init('5elb4u/pinaserrunds')

// XState Inspect
// inspect({ iframe: false })

let app = ''
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
    app.component('svg-icon', SvgIcon)
    app.component('navigation-bar', NavigationBar)
    app
      .use(store)
      .use(router)
      .mount('#app')
  }
})

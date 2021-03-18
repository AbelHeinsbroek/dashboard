import Vue from 'vue'
import Router from 'vue-router'
import LocationList from '@/templates/location-list'
import LocationMap from '@/templates/location-map'
import Proces from '@/templates/proces'
import Reinwater from '@/templates/Reinwater'
import Location from '@/templates/location'
import Demo from '@/templates/demo'
import Demo2 from '@/templates/demo2'
import Grondwater from '@/templates/Grondwater'
import Softsensor from '@/templates/softsensor'
import Dispensatie from '@/templates/dispensatietabel'
import Winstraat from '@/templates/Winstraat'
import Analyse from '@/templates/reinwater-analyse'
import Put from '@/templates/put'
import Ontharding from '@/templates/ontharding'
import Reactor from '@/templates/reactor'

// iframe tamples
import DBM from '@/templates/dbm'
import NachtWacht from '@/templates/nachtwacht'

// quantity templates

import LocationQMap from '@/templates/location-quantity-map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: LocationMap
    },
    {
      path: '/demo',
      name: 'Demo',
      component: Demo
    },
    {
      path: '/demo2',
      name: 'Demo2',
      component: Demo2
    },
    {
      path: '/map',
      name: 'Map',
      component: LocationMap
    },
    {
      path: '/vergunningen',
      name: 'Winvergunningen',
      component: LocationQMap
    },
    {
      path: '/list',
      name: 'Locatielijst',
      component: LocationList
    },
    {
      path: '/analyse',
      name: 'Analyse',
      component: Analyse
    },
    {
      path: '/dbm',
      name: 'DBM',
      component: DBM
    },
    {
      path: '/n8w8',
      name: 'NachtWacht',
      component: NachtWacht
    },
    {
      path: '/reinwater/:context',
      name: 'reinwater',
      component: Reinwater
    },

    {
      path: '/dispensatie',
      name: 'dispensatie',
      component: Dispensatie
    },

    { path: '/grondwater/:context', name: 'grondwaterwinning', component: Grondwater },
    { path: '/softsensor/:context', name: 'softsensor', component: Softsensor },
    { path: '/winstraat/:context', name: 'winstraat', component: Winstraat },
    { path: '/proces/:context', name: 'snelfiltratie', component: Proces },
    { path: '/proces/:context', name: 'voorfiltratie', component: Proces },
    { path: '/proces/:context', name: 'nafiltratie', component: Proces },
    { path: '/proces/:context', name: 'beluchting', component: Proces },
    { path: '/proces/:context', name: 'ontharding-old', component: Proces },
    { path: '/proces/:context', name: 'ontzuring', component: Proces },
    { path: '/proces/:context', name: 'membraanfiltratie', component: Proces },
    { path: '/proces/:context', name: 'ontkleuring', component: Proces },
    { path: '/proces/:context', name: 'oc verwijdering', component: Proces },
    { path: '/proces/:context', name: 'vacuumontgassing', component: Proces },
    { path: '/proces/:context', name: 'ontharding', component: Proces },
    { path: '/put/:context', name: 'put', component: Put },
    { path: '/ontharding/:context', name: 'ontharding-demo', component: Ontharding},
    { path: '/reactor/:context', name: 'reactor', component: Reactor},
    {
      path: '/locatie/:context',
      name: 'Locatie',
      component: Location
    },
  ]
})

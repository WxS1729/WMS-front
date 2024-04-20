import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  screenHeight: document.documentElement.clientHeight, //屏幕高度
  stationShow: {
    opened: Cookies.get('stationShowStatus') ? !!+Cookies.get('stationShowStatus') : true,
  }
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_SCREENH_EIGHT: (state, screenHeight) => {
    state.screenHeight = screenHeight
  },
  TOGGLE_STATION_SHOW: state => {
    state.stationShow.opened = !state.stationShow.opened;
    if (state.stationShow.opened) {
      Cookies.set('stationShowStatus', 1)
    } else {
      Cookies.set('stationShowStatus', 0)
    }

  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setScreenHeight({ commit }, screenHeight) {
    commit('SET_SCREENH_EIGHT', screenHeight)
  },
  toggleStationShow({ commit }) {
    commit('TOGGLE_STATION_SHOW')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

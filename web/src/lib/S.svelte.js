export const LS = window.localStorage

export const SS = window.sessionStorage

export const S = $state({
  token: LS.token || '',
  user: '',
  channel: '',
  userInfo: {},
  channelInfo: {},
  messages: [],
  meta: {},
  showChannel: false, // show channel list on mobile
  channelUnread: {} // for new message
})

export const M = {
  refreshChannelList: () => {},
  editMessage: () => {}
}

export default S

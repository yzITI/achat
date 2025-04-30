export const LS = window.localStorage

export const SS = window.sessionStorage

export const S = $state({
  token: LS.token || '',
  user: '',
  channel: '',
  userInfo: JSON.parse(LS.userInfo || '{}'),
  channelInfo: {},
  messages: [],
  meta: {},
  showChannel: true
})

export default S

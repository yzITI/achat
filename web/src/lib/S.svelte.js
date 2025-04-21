export const LS = window.localStorage

export const SS = window.sessionStorage

export const S = $state({
  token: LS.token || '',
  user: '',
  channel: '',
  userInfo: {},
  channelInfo: {},
  messages: [],
  meta: { channels: { 'TEST': { name: 'Test Channel' } } },
  showChannel: true
})

export default S

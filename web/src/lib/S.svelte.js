export const LS = window.localStorage

export const SS = window.sessionStorage

export const S = $state({
  token: LS.token || '',
  user: '',
  channel: '',
  messages: [],
  meta: {}
})

export default S

export function load({ url }) {
  const channelInfo = {}
  if (url.searchParams.get('channelInfo.name')) channelInfo.name = url.searchParams.get('channelInfo.name')
  return {
    token: url.searchParams.get('token'),
    channel: url.searchParams.get('channel'),
    channelInfo
  }
}

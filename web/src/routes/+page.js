export function load({ url }) {
  const channelInfo = {}
  if (url.searchParams.get('channelInfo.name')) channelInfo.name = url.searchParams.get('channelInfo.name')
  return {
    channel: url.searchParams.get('channel'),
    channelInfo
  }
}

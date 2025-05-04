<script>
  import { S, M } from '$lib/S.svelte'
  import { query } from '$lib/C.js'
  import { mdiForumOutline, mdiPlus, mdiHomeAccount } from '@mdi/js'
  import { AIcon } from 'ace.svelte'
  import { random } from '$lib/utilities/crypto.js'

  function select (c) {
    if (S.channel === c) return
    S.channel = c
    S.messages = []
    if (c === '~' + S.user) S.channelInfo = { name: 'My Channel' }
    else S.channelInfo = JSON.parse(JSON.stringify(S.meta?.channels?.[c] || {}))
    S.showChannel = false
    query(c, {})
  }

  function add () {
    const id = random(12)
    S.channel = id
    S.messages = []
    S.channelInfo = { name: 'New Channel' }
    S.showChannel = false
  }

  let chatIDs = $state([])
  M.refreshChannelList = () => chatIDs = Object.keys(S.meta?.channels || {}).sort((a, b) => {
    return (Number(S.channelUnread[b] || 0) - Number(S.channelUnread[a] || 0)) || (S.meta.channels[a].name < S.meta.channels[b].name ? -1 : 1)
  })
  M.refreshChannelList()
</script>

<div class="w-full h-full bg-zinc-700 overflow-y-auto overflow-x-hidden">
  <div>
    <div class="font-bold m-2 flex items-center justify-between">
      <h3>Channels</h3>
      <div class="flex items-center">
        <button class="cursor-pointer mx-2 transition-all text-zinc-400 hover:text-zinc-300 {(S.channelUnread['~' + S.user] ? 'text-white' : '')}" onclick={() => select('~' + S.user)}>
          <AIcon path={mdiHomeAccount} size="1.25rem"></AIcon>
        </button>
        <button class="transition-all cursor-pointer hover:rotate-360" onclick={add}>
          <AIcon path={mdiPlus}></AIcon>
        </button>
      </div>
    </div>
    {#each chatIDs as c}
      <button class={'w-full flex items-center p-2 transition-all hover:bg-zinc-600 hover:text-zinc-100 cursor-pointer ' + (S.channel === c ? 'bg-zinc-600 text-zinc-100 ' : 'bg-zinc-700 text-zinc-200 ') + (S.channelUnread[c] ? 'font-bold' : '')} onclick={() => select(c)}>
        <AIcon path={mdiForumOutline} size="1.5rem" />
        <div class="ml-2 whitespace-nowrap">{S.meta.channels[c].name}</div>
      </button>
    {/each}
  </div>
</div>

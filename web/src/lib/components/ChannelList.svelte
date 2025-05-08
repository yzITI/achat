<script>
  import { S, M } from '$lib/S.svelte'
  import { query, subscribe } from '$lib/C.js'
  import { mdiForumOutline, mdiPlus } from '@mdi/js'
  import { AIcon } from 'ace.svelte'
  import { random } from '$lib/C.js'

  function select (c) {
    if (S.channel === c) return
    S.channel = c
    S.messages = []
    S.channelInfo = JSON.parse(JSON.stringify(S.meta?.channels?.[c] || {}))
    S.showChannel = false
    subscribe({ [c]: 1 })
  }

  function add () {
    S.channel = random(16)
    S.messages = []
    S.channelInfo = { name: 'New Channel' }
    S.showChannel = false
    subscribe({ [S.channel]: 1 })
  }

  let chats = $state([])
  M.refreshChannelList = () => chats = Object.keys(S.meta?.channels || {}).sort((a, b) => {
    return (Number(S.channelUnread[b] || 0) - Number(S.channelUnread[a] || 0)) || (S.meta.channels[a].name < S.meta.channels[b].name ? -1 : 1)
  })
  M.refreshChannelList()
</script>

<div class="w-full h-full bg-zinc-700 overflow-y-auto overflow-x-hidden">
  <div>
    <div class="font-bold m-2 flex items-center justify-between">
      <h3>Channels</h3>
      <div class="flex items-center">
        <button class="transition-all cursor-pointer hover:rotate-360" onclick={add}>
          <AIcon path={mdiPlus}></AIcon>
        </button>
      </div>
    </div>
    {#each chats as c}
      <button class={'w-full flex items-center p-2 transition-all hover:bg-zinc-600 hover:text-zinc-100 cursor-pointer ' + (S.channel === c ? 'bg-zinc-600 text-zinc-100 ' : 'bg-zinc-700 text-zinc-200 ') + (S.channelUnread[c] ? 'font-bold' : '')} onclick={() => select(c)}>
        <AIcon path={mdiForumOutline} size="1.5rem" />
        <div class="ml-2 whitespace-nowrap">{S.meta?.channels?.[c]?.name}</div>
      </button>
    {/each}
  </div>
</div>

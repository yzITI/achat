<script>
  import S from '$lib/S.svelte'
  import { query } from '$lib/C.js'
  import { mdiForumOutline, mdiPlus } from '@mdi/js'
  import { AIcon } from 'ace.svelte'
  import { random } from '$lib/utilities/crypto.js'

  function select (c) {
    if (S.channel === c) return
    S.channel = c
    S.messages = []
    S.channelInfo = JSON.parse(JSON.stringify(S.meta?.channels?.[c] || {}))
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
</script>

<div class="w-full h-full bg-zinc-700 overflow-y-auto overflow-x-hidden">
  <div>
    <div class="font-bold m-2 flex items-center justify-between">
      <h3>Channels</h3>
      <button class="transition-all cursor-pointer hover:rotate-360" onclick={add}>
        <AIcon path={mdiPlus}></AIcon>
      </button>
    </div>
    {#each Object.keys(S.meta?.channels || {}) as c}
      <button class={'w-full flex items-center p-2 transition-all hover:bg-zinc-600 hover:text-zinc-100 cursor-pointer ' + (S.channel === c ? 'bg-zinc-600 text-zinc-100' : 'bg-zinc-700 text-zinc-200')} onclick={() => select(c)}>
        <AIcon path={mdiForumOutline} size="1.5rem" />
        <div class="ml-2 whitespace-nowrap">{S.meta.channels[c].name}</div>
      </button>
    {/each}
  </div>
</div>

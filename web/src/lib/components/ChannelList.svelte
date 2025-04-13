<script>
  import S from '$lib/S.svelte'
  import { mdiForumOutline } from '@mdi/js'
  import { AIcon } from 'ace.svelte'
  const channels = { 'CHANNELID': 'Test Channel', 'TEST': 'Test' }
</script>

<div class="w-full h-full bg-zinc-700 overflow-y-auto overflow-x-hidden">
  <div>
    <h3 class="font-bold m-2">Channels</h3>
    {#each Object.keys(channels) as c}
      <button class={'w-full flex items-center p-2 transition-all hover:bg-zinc-600 hover:text-zinc-100 cursor-pointer ' + (S.channel === c ? 'bg-zinc-600 text-zinc-100' : 'bg-zinc-700 text-zinc-200')} onclick={() => { S.channel = c }}>
        <AIcon path={mdiForumOutline} size="1.5rem" />
        <div class="ml-2">{channels[c]}</div>
      </button>
    {/each}
  </div>
</div>

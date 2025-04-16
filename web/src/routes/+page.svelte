<script>
  import S from '$lib/S.svelte'
  import '$lib/C.js'
  import PassCode from '$lib/components/PassCode.svelte'
  import Status from '$lib/components/Status.svelte'
  import ChannelList from '$lib/components/ChannelList.svelte'
  import Chat from '$lib/components/Chat.svelte'
  import { fade } from 'svelte/transition'
</script>

<div class="w-full h-dvh overflow-hidden bg-black text-white">
  {#if !S.token}
    <div transition:fade class="fixed w-full h-full top-0 left-0 z-50">
      <PassCode />
    </div>
  {/if}
  <div class="flex h-full">
    <div class="w-80 h-full" style="min-width: 20rem;">
      <div class="h-16">
        <Status />
      </div>
      <div style="height: calc(100% - 4rem)">
        <ChannelList />
      </div>
    </div>
    <div class="h-full grow">
      {#if S.channel}
        <Chat />
      {/if}
    </div>
  </div>
</div>


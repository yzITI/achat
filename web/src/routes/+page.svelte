<script>
  import S from '$lib/S.svelte'
  import '$lib/C.js'
  import PassCode from '$lib/components/PassCode.svelte'
  import Status from '$lib/components/Status.svelte'
  import ChannelList from '$lib/components/ChannelList.svelte'
  import Chat from '$lib/components/Chat.svelte'
  import { fade } from 'svelte/transition'
  let { data } = $props()
  if (data.channel) {
    S.channel = data.channel
    S.channelInfo = data.channelInfo
  }
</script>

<div class="w-full h-dvh overflow-hidden bg-black text-white">
  {#if !S.token}
    <div transition:fade class="fixed w-full h-full top-0 left-0 z-50">
      <PassCode />
    </div>
  {/if}
  <div class="flex h-full">
    <div class="w-80 h-full top-0 fixed z-40 md:relative transition-all duration-300 { S.showChannel ? 'left-0' : '-left-96 md:left-0' }" style="min-width: 20rem;">
      <div class="h-16">
        <Status />
      </div>
      <div style="height: calc(100% - 4rem)">
        <ChannelList />
      </div>
    </div>
    <div class="h-full grow z-0">
      {#if S.channel}
        <Chat />
      {/if}
    </div>
  </div>
  {#if S.showChannel}
    <button transition:fade class="md:hidden fixed bg-black opacity-80 z-10 w-full h-dvh left-0 top-0 text-left" onclick={() => S.showChannel = false}>x</button>
  {/if}
</div>


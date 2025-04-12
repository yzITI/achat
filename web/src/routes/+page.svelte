<script>
  import S from '$lib/S.svelte'
  import PassCode from '$lib/components/PassCode.svelte'
  import ChannelList from '$lib/components/ChannelList.svelte'
  import Chat from '$lib/components/Chat.svelte'
</script>

<div class="w-full h-svh overflow-hidden bg-black text-white">
  {#if !S.token}
    <PassCode />
  {/if}
  <div class="flex h-full">
    <div class="w-80 h-full bg-neutral-800">
      <ChannelList />
    </div>
    <div class="h-full grow bg-neutral-900">
      <Chat />
    </div>
  </div>
</div>


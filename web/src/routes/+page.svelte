<script>
  import { page } from '$app/state'
  import { connect, random } from '$lib/C.js'
  import { SS, LS, S } from '$lib/S.svelte'
  import { throttle } from '$lib/utilities/utils.js'
  import PassCode from '$lib/components/PassCode.svelte'
  import Status from '$lib/components/Status.svelte'
  import ChannelList from '$lib/components/ChannelList.svelte'
  import Chat from '$lib/components/Chat.svelte'
  import Cover from '$lib/components/Cover.svelte'
  import { fade } from 'svelte/transition'

  const handler = {}

  const init = throttle(() => {
    connect()
    let data = {}, hashString = page.url.hash.substring(1)
    if (!hashString) return
    try { data = JSON.parse(atob(hashString)) } catch {}
    if (data.channel) {
      S.channel = data.channel
      S.channelInfo = data.channelInfo
      S.messages = []
    }
    if (data.userKey) SS.userKey = data.userKey
    if (data.autoKey) SS.userKey = SS.userKey || LS.userKey || random(16)
    if (SS.userKey !== LS.userKey && handler.login) handler.login()
    setTimeout(() => window.location.hash = '')
  }, 1000)
  init()
  window.onhashchange = init
</script>

<div class="w-full h-dvh overflow-hidden bg-black text-white">
  {#if !S.token}
    <div transition:fade class="fixed w-full h-full top-0 left-0 z-50">
      <PassCode {handler} />
    </div>
  {/if}
  <div class="flex h-full">
    <div class="w-80 h-full top-0 fixed z-40 md:relative transition-all duration-300 { S.showChannel ? 'left-0' : '-left-80 md:left-0' }" style="min-width: 20rem;">
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
      {:else}
        <Cover />
      {/if}
    </div>
  </div>
  {#if S.showChannel}
    <button transition:fade class="md:hidden fixed bg-black opacity-80 z-10 w-full h-dvh left-0 top-0 text-left" onclick={() => S.showChannel = false}>x</button>
  {/if}
</div>


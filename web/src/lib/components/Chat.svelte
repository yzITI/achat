<script>
  import { onMount, onDestroy } from 'svelte'
  import S from '$lib/S.svelte'
  import { query, updateMeta } from '$lib/C.js'
  import { debounce, throttle } from '$lib/utilities/utils.js'
  import Input from '$lib/components/Input.svelte'
  import Message from '$lib/components/Message.svelte'
  import { mdiMenu, mdiForumOutline, mdiLocationEnter, mdiLocationExit, mdiShare } from '@mdi/js'
  import { AIcon } from 'ace.svelte'

  let chatContainer = $state(), chatEl = $state()
  let topEl = $state()

  async function updateChannel (button) {
    if (!button && !S.meta?.channels?.[S.channel]) return
    if (!S.channelInfo?.name || !S.channelInfo.name.match(/\S/)) return
    if (!S.meta.channels) S.meta.channels = {}
    if (button && S.meta?.channels[S.channel]) delete S.meta.channels[S.channel]
    else S.meta.channels[S.channel] = JSON.parse(JSON.stringify(S.channelInfo))
    S.meta.type = 'meta'
    updateMeta()
  }
  const debouncedUpdateChannel = debounce(updateChannel, 1000)

  let scrollHeight = 0, scrolling = 0, smoothScroll = false
  function onscroll (e) {
    if (scrolling) return
    scrollHeight = chatContainer.scrollHeight - chatContainer.clientHeight - chatContainer.scrollTop
    if (scrollHeight < 10) S.channelUnread[S.channel] = 0
  }
  function scrollTo (top) {
    scrolling++
    const smooth = smoothScroll && Math.abs(chatContainer.scrollTop - top) < 400
    chatContainer.scrollTo({ top, behavior: smoothScroll ? 'smooth' : 'instant' })
    setTimeout(() => {
      scrolling--
      onscroll()
    }, smoothScroll ? 600 : 100)
  }

  function loadMore () {
    if (S.user) query(S.channel, { time: { $lt: S.messages[0]?.time || Date.now() * 2 } })
  }
  const throttledLoadMore = throttle(loadMore, 500)

  const resizeObserver = new ResizeObserver(e => {
    scrollTo(chatContainer.scrollHeight - chatContainer.clientHeight - scrollHeight)
  })
  const loadMoreObserver = new IntersectionObserver(() => {
    smoothScroll = false
    throttledLoadMore()
    setTimeout(() => {
      smoothScroll = true
      if (chatContainer.scrollTop < 40) scrollTo(40)
    }, 500)
  }, { threshold: 1 })
  onMount(() => {
    resizeObserver.observe(chatEl)
    loadMoreObserver.observe(topEl)
  })
  onDestroy(() => {
    resizeObserver.disconnect()
    loadMoreObserver.disconnect()
  })
  $effect(() => { // channel change
    S.channel;
    scrollHeight = 0
    smoothScroll = false
    setTimeout(() => { smoothScroll = true }, 1000)
    throttledLoadMore()
  })

  function share () {
    const url = window.location.href.replace(/\?.*$/, '').replace(/#.*$/, '') + '#' + btoa(JSON.stringify({ channel: S.channel, channelInfo: S.channelInfo }))
    navigator.share({ url, title: `AChat | Channel ${S.channelInfo.name}` })
  }
</script>

<div class="w-full h-full flex flex-col" style="background: #222;">
  <div class="p-2 flex items-center justify-between h-16 border-b-1 border-zinc-500 text-gray-200" style="min-height: 4rem;">
    <div class="flex flex-row items-center grow">
      <button class="m-2 cursor-pointer md:hidden" onclick={() => S.showChannel = true}>
        <AIcon path={mdiMenu} size="1.5rem" />
      </button>
      <AIcon path={mdiForumOutline} size="1.5rem" class="m-2" />
      <input class="block grow bg-transparent outline-none px-2 font-bold" bind:value={S.channelInfo.name} oninput={() => debouncedUpdateChannel()} placeholder="Untitled" readonly={S.channel === S.user}/>
    </div>
    <div class="flex items-center">
      <button class="p-1 cursor-pointer" onclick={share}>
        <AIcon path={mdiShare} size="1.25rem" />
      </button>
      <button class="p-1 cursor-pointer" onclick={() => updateChannel(true)}>
        <AIcon path={S.meta?.channels?.[S.channel] ? mdiLocationExit : mdiLocationEnter} size="1.25rem" />
      </button>
    </div>
  </div>
  <div class="grow overflow-x-hidden overflow-y-auto" style="scrollbar-color: #666 #222;" bind:this={chatContainer} {onscroll}>
    <div bind:this={chatEl} style="min-height: calc(100% + 40px);">
      <div bind:this={topEl} style="height: 40px;" class="bg-zinc-700 p-2 font-bold flex items-center">Loading...</div>
      {#each S.messages as message}
        {#if !message.msg?.hide}
          {#key message._id + message.time}
            <Message {message} />
          {/key}
        {/if}
      {/each}
    </div>
  </div>
  <div>
    <Input />
  </div>
</div>

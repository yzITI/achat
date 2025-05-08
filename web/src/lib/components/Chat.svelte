<script>
  import { onMount, onDestroy } from 'svelte'
  import S from '$lib/S.svelte'
  import { query, updateMeta } from '$lib/C.js'
  import { debounce, throttle } from '$lib/utilities/utils.js'
  import Input from '$lib/components/Input.svelte'
  import Message from '$lib/components/Message.svelte'
  import { mdiMenu, mdiForumOutline, mdiLocationEnter, mdiLocationExit, mdiShare } from '@mdi/js'
  import { AIcon } from 'ace.svelte'

  let chatContainer = $state(), chatEl = $state(), reachBottom = true
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

  let blockOnScroll = false
  function onscroll () {
    if (blockOnScroll) return
    reachBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 10
    if (reachBottom) S.channelUnread[S.channel] = 0
  }

  let smoothScroll = false
  function scrollToBottom () {
    const now = Date.now()
    blockOnScroll = now
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: smoothScroll && (chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 400) ? 'smooth' : 'instant'
    })
    S.channelUnread[S.channel] = 0
    setTimeout(() => { if (blockOnScroll === now) blockOnScroll = false }, 500)
  }
  const debouncedScrollToBottom = debounce(scrollToBottom, 100)
  $effect(() => {
    S.channel;
    smoothScroll = false
    setTimeout(() => { smoothScroll = true }, 1000)
  })

  function loadMore () {
    chatContainer.scrollTo({ top: 40, behavior: 'smooth' })
    query(S.channel, { time: { $lt: S.messages[0]?.time || Date.now() * 2 } })
  }
  const throttledLoadMore = throttle(loadMore, 2000)

  const resizeObserver = new ResizeObserver(() => {
    if (reachBottom) scrollToBottom()
  })
  const loadMoreObserver = new IntersectionObserver(() => {
    chatContainer.scrollTo({ top: 40, behavior: 'smooth' })
    throttledLoadMore()
  }, { threshold: 1 })
  onMount(() => {
    resizeObserver.observe(chatEl)
    loadMoreObserver.observe(topEl)
  })
  onDestroy(() => {
    resizeObserver.disconnect()
    loadMoreObserver.disconnect()
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
        {#key message._id + message.time}
          <Message {message} />
        {/key}
      {/each}
    </div>
  </div>
  <div>
    <Input />
  </div>
</div>

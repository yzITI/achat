<script>
  import { onMount } from 'svelte'
  import S from '$lib/S.svelte'
  import { updateMeta } from '$lib/C.js'
  import { debounce } from '$lib/utilities/utils.js'
  import Input from '$lib/components/Input.svelte'
  import Message from '$lib/components/Message.svelte'
  import { mdiMenu, mdiForumOutline, mdiLocationEnter, mdiLocationExit, mdiShare } from '@mdi/js'
  import { AIcon } from 'ace.svelte'

  let chatContainer = $state(), reachBottom = true
  let top = $state()
  const observer = new IntersectionObserver(loadMore, { threshold: 1 })
  onMount(() => { observer.observe(top) })

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

  function onscroll () {
    reachBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 10
    if (reachBottom) S.channelUnread[S.channel] = 0
  }

  function scrollToBottom () {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: (chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 400) ? 'smooth' : 'instant'
    })
    S.channelUnread[S.channel] = 0
  }
  const debouncedScrollToBottom = debounce(scrollToBottom, 100)

  $effect(() => {
    S.messages[S.messages.length - 1]
    if (reachBottom) debouncedScrollToBottom()
  })

  function share () {
    const url = window.location.href.replace(/\?.*$/, '').replace(/#.*$/, '') + '#' + btoa(JSON.stringify({ channel: S.channel, channelInfo: S.channelInfo }))
    navigator.share({ url, title: `AChat | Channel ${S.channelInfo.name}` })
  }

  function loadMore () {
    // TODO: load more messages
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
    <div bind:this={top}></div>
    {#each S.messages as message}
      {#key message._id + message.time}
        <Message {message} />
      {/key}
    {/each}
  </div>
  <div>
    <Input />
  </div>
</div>

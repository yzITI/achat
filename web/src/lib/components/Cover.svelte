<script>
  import S from '$lib/S.svelte'
  import { subscribe, random } from '$lib/C.js'
  import { mdiMenu, mdiPlus } from '@mdi/js'
  import { AIcon } from 'ace.svelte'
  let link = $state('')

  function add () {
    S.channel = random(16)
    S.messages = []
    S.channelInfo = { name: 'New Channel' }
    S.showChannel = false
    subscribe({ [S.channel]: 1 })
  }

  function onkeyup (e) {
    if (e.key !== 'Enter') return
    const m = link.match(/#.+$/)
    if (!m) return
    const hashString = m[0].substring(1)
    if (!hashString) return
    let data = {}
    try { data = JSON.parse(atob(hashString)) } catch {}
    if (data.channel) {
      S.channel = data.channel
      S.channelInfo = data.channelInfo
      S.messages = []
    }
    // if (data.userKey) SS.userKey = data.userKey
  }
</script>

<div class="w-full h-full flex flex-col" style="background: #222;">
  <div class="p-2 flex items-center justify-between h-16 border-b-1 border-zinc-500 text-gray-200" style="min-height: 4rem;">
    <button class="m-2 cursor-pointer md:hidden" onclick={() => S.showChannel = true}>
      <AIcon path={mdiMenu} size="1.5rem" />
    </button>
    <div class="font-bold mx-2">AChat</div>
  </div>
  <div class="px-4 py-8 text-zinc-200">
    <h2 class="font-bold text-2xl mb-4">Welcome to AChat!</h2>
    <div class="flex items-center flex-wrap">
      <button class="flex items-center px-4 py-2 m-2 bg-zinc-700 rounded text-lg font-bold md:hidden cursor-pointer transition-all hover:bg-zinc-600" onclick={() => S.showChannel = true}>
        <AIcon path={mdiMenu} size="1.5rem" class="mr-2" /> Menu
      </button>
      <button class="flex items-center px-4 py-2 m-2 bg-zinc-700 rounded text-lg font-bold cursor-pointer transition-all hover:bg-zinc-600" onclick={add}>
        <AIcon path={mdiPlus} size="1.5rem" class="mr-2" /> Create Channel
      </button>
    </div>
    <p class="mt-4 mb-2">Having a channel invitation?</p>
    <input class="block w-full bg-zinc-700 focus:bg-zinc-600 outline-none p-2 font-mono rounded text-sm" placeholder="Enter channel link" bind:value={link} {onkeyup}>
  </div>
</div>

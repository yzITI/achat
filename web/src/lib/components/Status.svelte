<script>
  import Avatar from '$lib/components/Avatar.svelte'
  import { S, LS } from '$lib/S.svelte'
  import { connect } from '$lib/C.js'
  import { mdiLogout } from '@mdi/js'
  import { AIcon } from 'ace.svelte'

  function logout() {
    LS.removeItem('token')
    LS.removeItem('userInfo')
    S.token = ''
    S.user = ''
    S.channel = ''
    S.userInfo = {}
    S.channelInfo = {}
    S.messages = []
    S.meta = {}
    connect() // reconnect server
  }
</script>

<div class="h-full w-full bg-zinc-700 border-b-1 border-zinc-500 p-2 flex justify-between items-center">
  <div class="flex items-center grow">
    <Avatar user={S.user} size="2rem" />
    <div class="grow">
      <input class="font-bold mx-2 px-1 block outline-none text-lg w-full" placeholder="Nickname" bind:value={S.userInfo.name}>
    </div>
  </div>
  <div class="flex items-center ml-4">
    <button class="opacity-90 hover:opacity-100 transition-all cursor-pointer" onclick={logout}>
      <AIcon path={mdiLogout} size="1.25rem" />
    </button>
  </div>
</div>

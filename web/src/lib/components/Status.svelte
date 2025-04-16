<script>
  import Avatar from '$lib/components/Avatar.svelte'
  import { S, LS } from '$lib/S.svelte'
  import { mdiLogout } from '@mdi/js'
  import { AIcon } from 'ace.svelte'

  async function logout() {
    LS.removeItem('token')
    S.token = ''
    S.user = ''
    // S.userInfo = ''
    S.channel = ''
    S.messages = []
  }
</script>

<div class="h-full w-full bg-zinc-700 border-b-1 border-zinc-500 p-2 flex justify-between items-center">
  <div class="flex items-center">
    <Avatar user={S.user} size="2rem" />
    <h3 class="text-xl ml-2 font-bold">AChat</h3>
  </div>
  <div class="flex items-center">
    <AIcon path={mdiLogout} size="1.25rem" class="cursor-pointer" onclick={logout} />
  </div>
</div>

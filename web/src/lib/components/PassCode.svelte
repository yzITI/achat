<script>
  import { AIcon } from 'ace.svelte'
  import { mdiLock, mdiArrowRight } from '@mdi/js'
  import { sha256 } from '$lib/utilities/crypto.js'
  import { S, LS } from '$lib/S.svelte'
  import { handshake } from '$lib/C.js'

  let passcode = $state(''), nickname = $state('')
  async function enter () {
    S.token = await sha256(passcode)
    LS.token = S.token
    handshake()
    const id = await sha256(S.token)
    S.userInfo = { name: nickname || id.substring(0, 6) }
    LS.userInfo = JSON.stringify(S.userInfo)
  }
</script>

<div class="w-full h-full bg-black flex justify-center items-center">
  <div class="p-6 rounded-xl flex flex-col justify-center items-center">
    <AIcon path={mdiLock} size="5rem"/>
    <h1 class="text-4xl font-bold my-4">PassCode</h1>
    <input type="password" class="w-80 px-4 py-2 my-2 bg-neutral-700 rounded outline-none text-lg text-center transition-all focus:bg-neutral-600" placeholder="Enter your PassCode" bind:value={passcode} />
    <input type="text" class="w-80 px-4 py-2 my-2 bg-neutral-700 rounded outline-none text-lg text-center transition-all focus:bg-neutral-600" placeholder="Nickname" bind:value={nickname} />
    <button class="bg-white transition-all duration-500 rounded-full text-black flex items-center justify-end h-12 w-12 my-4 hover:w-32 cursor-pointer overflow-hidden" onclick={enter}>
      <b class="mx-3 text-lg">Enter</b>
      <AIcon path={mdiArrowRight} size="2rem" class="mx-2"></AIcon>
    </button>
  </div>
</div>

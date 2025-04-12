<script>
  import { AIcon } from 'ace.svelte'
  import { mdiLock } from '@mdi/js'
  import { sha256 } from '$lib/utilities/crypto.js'
  import { S, LS } from '$lib/S.svelte'

  async function enter (e) {
    if (e.key !== 'Enter') return
    const passcode = e.target.value
    S.token = await sha256(passcode)
    LS.token = S.token
  }
</script>

<div class="w-full h-full bg-black flex justify-center items-center">
  <div class="p-6 rounded-xl text-white flex flex-col justify-center items-center">
    <AIcon path={mdiLock} size="5rem"/>
    <h1 class="text-4xl font-bold my-4">PassCode</h1>
    <input type="password" class="w-80 px-4 py-2 my-4 bg-neutral-900 rounded outline-none text-lg text-center transition-all focus:bg-neutral-800" placeholder="Enter your PassCode" onkeyup={enter} />
  </div>
</div>

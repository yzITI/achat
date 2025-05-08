<script>
  import { AIcon, AExpand } from 'ace.svelte'
  import { mdiLock, mdiArrowRight, mdiHelp } from '@mdi/js'
  import { S, SS, LS } from '$lib/S.svelte'
  import { handshake, hash } from '$lib/C.js'

  let passcode = $state(''), showHelp = $state(false)

  async function login (hs = false) {
    S.userKey = SS.userKey || LS.userKey
    S.token = await hash(S.userKey)
    if (hs) handshake()
  }

  if (LS.userKey || SS.userKey) login() // auto login

  async function enter () {
    LS.userKey = await hash(passcode)
    login(true)
  }
  
  function keyup (e) {
    if (e.key === 'Enter') enter()
  }
</script>

<div class="w-full h-full bg-black flex justify-center items-center">
  <div class="p-6 rounded-xl flex flex-col justify-center items-center">
    <AIcon path={mdiLock} size="5rem"/>
    <h1 class="text-4xl font-bold my-4">PassCode</h1>
    <div class="relative flex items-center overflow-hidden group">
      <input type="password" class="w-80 px-4 py-2 my-2 bg-neutral-700 rounded outline-none text-lg text-center transition-all focus:bg-neutral-600" placeholder="Enter your PassCode" bind:value={passcode} onkeyup={keyup} />
      <button class="absolute rounded-full p-1 bg-neutral-500 cursor-pointer transition-all duration-300 opacity-30 group-hover:opacity-100 { showHelp ? '-right-8' : 'right-2' }" onclick={() => showHelp = true}>
        <AIcon path={mdiHelp} size="1.25rem"></AIcon>
      </button>
    </div>
    <button class="bg-white transition-all duration-500 rounded-full text-black flex items-center justify-end h-12 w-12 my-4 hover:w-32 cursor-pointer overflow-hidden" onclick={enter}>
      <b class="mx-3 text-lg">Enter</b>
      <AIcon path={mdiArrowRight} size="2rem" class="mx-2"></AIcon>
    </button>
    <AExpand show={showHelp}>
      <div class="w-80 flex flex-col items-start text-sm py-4">
        <h3 class="font-bold text-lg">What's PassCode?</h3>
        <p>PassCode is your identity and permission in AChat. Think about it as username + password.</p>
        <p>Your passcode should be something only you know (secret) and something others would not use (unique). <b>Don't forget it!</b></p>
        <p class="my-2 text-zinc-400"><span class="italic">What the observer knows is inseparable from what the observer is.</span> (Wojciech H. Zurek)</p>
      </div>
    </AExpand>
  </div>
</div>

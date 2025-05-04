<script>
  import S from '$lib/S.svelte'
  import { mdiMenu } from '@mdi/js'
  import { AIcon } from 'ace.svelte'
</script>

<div class="w-full h-full flex flex-col" style="background: #222;">
  <div class="p-2 flex items-center justify-between h-16 border-b-1 border-zinc-500 text-gray-200" style="min-height: 4rem;">
    <button class="m-2 cursor-pointer md:hidden" onclick={() => S.showChannel = true}>
      <AIcon path={mdiMenu} size="1.5rem" />
    </button>
    <div class="font-bold mx-2">AChat</div>
  </div>
  <div class="px-4 py-8 text-zinc-200">
    <h2 class="font-bold text-2xl">Welcome to AChat!</h2>
  </div>
</div>

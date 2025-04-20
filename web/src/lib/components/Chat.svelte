<script>
  import S from '$lib/S.svelte'
  import Input from '$lib/components/Input.svelte'
  import Message from '$lib/components/Message.svelte'
  import { mdiMenu } from '@mdi/js'
  import { AIcon } from 'ace.svelte'
</script>

<div class="w-full h-full flex flex-col" style="background: #222;">
  <div class="p-2 flex items-center justify-between h-16 border-b-1 border-zinc-500" style="min-height: 4rem;">
    <div class="flex flex-row items-center">
      <button class="m-2 cursor-pointer md:hidden" onclick={() => S.showChannel = true}>
        <AIcon path={mdiMenu} size="1.5rem" />
      </button>
      <div>Channel ID: {S.channel}</div>
    </div>
  </div>
  <div class="grow overflow-x-hidden overflow-y-auto">
    {#each S.messages as m}
      <Message message={m} />
    {/each}
  </div>
  <div>
    <Input />
  </div>
</div>

<script>
  import { onMount } from 'svelte'
  import { S, M } from '$lib/S.svelte'
  import { message as Cmessage } from '$lib/C.js'
  import Avatar from '$lib/components/Avatar.svelte'
  import { mdiTrashCanOutline, mdiPencil } from '@mdi/js'
  import { AIcon } from 'ace.svelte'
  import moment from 'moment'
  const { message } = $props()
  const loaders = {
    default: () => import('$lib/components/MsgDefault.svelte'),
    delete: () => import('$lib/components/MsgDelete.svelte'),
    markdown: () => import('$lib/components/MsgMarkdown.svelte'),
    image: () => import('$lib/components/MsgImage.svelte')
  }

  let Component = $state()
  onMount(async () => {
    const loader = loaders[message.msg?.type] || loaders.default
    Component = await loader().then(r => r.default)
  })

  function deleteMessage() {
    Cmessage(S.channel, { type: 'delete', userInfo: S.userInfo }, message._id)
  }

  function editMessage() {
    M.editMessage(message)
  }
</script>

<div class="p-2 border-t-1 border-zinc-600 text-zinc-200 group relative overflow-hidden">
  <div class="flex items-start">
    <div class="py-2 sm:p-2">
      <Avatar user={message.user} size="2rem" />
    </div>
    <div class="ml-2 grow">
      <div class="flex items-center">
        <b>{message.msg?.userInfo?.name || ''}</b>
        <div class="relative flex items-center ml-2 text-xs text-zinc-400 select-none whitespace-nowrap">
          <code>{moment(message.created).format('YYYY-MM-DD HH:mm:ss')}</code>
          <div class="absolute transition-all opacity-100 hover:opacity-0 flex items-center" style="background: #222;">
            <code>{moment(message.time).format('YYYY-MM-DD HH:mm:ss')}</code>
            {#if message.created !== message.time}
              <AIcon path={mdiPencil} size="0.75rem" class="ml-1 text-zinc-400" />
            {/if}
          </div>
        </div>
      </div>
      <div class="w-full">
        <Component msg={message.msg} _id={message._id} />
      </div>
    </div>
  </div>
  <div class="transition-all absolute right-1 -top-6 group-hover:top-1 flex items-center text-zinc-400 bg-zinc-800 rounded">
    {#if message.msg?.type === 'markdown' && message.user === S.user}
      <button class="p-1 hover:text-white cursor-pointer" onclick={editMessage}>
        <AIcon path={mdiPencil} size="1rem" />
      </button>
    {/if}
    {#if message.msg?.type !== 'delete' && message.user === S.user}
      <button class="p-1 hover:text-white cursor-pointer" onclick={deleteMessage}>
        <AIcon path={mdiTrashCanOutline} size="1rem" />
      </button>
    {/if}
  </div>
</div>

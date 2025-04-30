<script>
  import Avatar from '$lib/components/Avatar.svelte'
  import moment from 'moment'
  const { message } = $props()
</script>

<div class="p-2 border-t-1 border-zinc-600 text-zinc-200">
  <div class="flex items-start">
    <div class="p-2">
      <Avatar user={message.user} size="2rem" />
    </div>
    <div class="ml-2">
      <div class="flex items-center">
        <b>{message.msg?.userInfo?.name || ''}</b>
        <div class="text-sm text-zinc-400 ml-2">{moment(message.time).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
      <div class="">{message.msg.content}</div>
    </div>
  </div>
</div>

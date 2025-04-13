<script>
  import S from '$lib/S.svelte'
  import Input from '$lib/components/Input.svelte'
</script>

<div class="w-full h-full flex flex-col" style="background: #222;">
  <div class="p-2 flex items-center justify-between h-16 border-b-1 border-zinc-500">
    Channel ID: {S.channel}
  </div>
  <div class="grow"></div>
  <div>
    <Input />
  </div>
</div>

<script>
  import Avatar from '$lib/components/Avatar.svelte'
  import S from '$lib/S.svelte'
</script>

<div class="h-full w-full bg-zinc-700 border-b-1 border-zinc-500 p-2 flex justify-between items-center">
  <div class="flex items-center">
    <Avatar user={S.user} size="2rem" />
    <h3 class="text-xl ml-2 font-bold">AChat</h3>
  </div>
  <div class="flex items-center">
  </div>
</div>

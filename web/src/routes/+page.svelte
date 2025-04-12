<script>
  import S from '$lib/S.svelte'
  import PassCode from '$lib/components/PassCode.svelte'
</script>

<div class="w-full h-svh overflow-hidden bg-black">
  {#if !S.token}
    <PassCode />
  {/if}
</div>


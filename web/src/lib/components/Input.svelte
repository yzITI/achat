<script>
  import { S, M } from '$lib/S.svelte'
  import { message } from '$lib/C.js'
  import { AIcon } from 'ace.svelte'
  import { mdiSend, mdiPencil } from '@mdi/js'
  let content = $state(''), textareaEl = $state(), editing = $state('')
  let rows = $derived(Math.min(5, content.split('\n').length))

  function insert (el, text) {
    el.focus()
    if (typeof el.selectionStart == 'number' && typeof el.selectionEnd == 'number') {
      let val = el.value
      let selStart = el.selectionStart
      el.value = val.slice(0, selStart) + text + val.slice(el.selectionEnd)
      el.selectionEnd = el.selectionStart = selStart + text.length
    } else if (typeof document.selection != 'undefined') {
      let textRange = document.selection.createRange()
      textRange.text = text
      textRange.collapse(false)
      textRange.select()
    }
    content = el.value
  }

  async function enter () {
    message(S.channel, { type: 'markdown', content, userInfo: S.userInfo }, editing)
    content = ''
    editing = ''
  }

  function onkeydown (e) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (e.shiftKey) insert(e.target, '\n')
    else enter()
  }

  function oninput () {
    if (content === '' && editing) editing = ''
  }

  M.editMessage = message => {
    content = message.msg?.content || ''
    editing = message._id
    textareaEl.focus()
  }
</script>

<div>
  <div class="border border-zinc-500 m-3 rounded overflow-hidden has-focus:ring ring-blue-300 bg-zinc-700">
    <textarea class="group w-full outline-none p-3" rows={rows} style="resize: none;" placeholder="Send Message" bind:value={content} onkeydown={onkeydown} oninput={oninput} bind:this={textareaEl}></textarea>
    <div class="bg-zinc-600 flex items-center justify-between">
      <div></div>
      <div class="flex items-center">
        {#if editing}
          <button class="text-xs text-zinc-300 mr-2 cursor-pointer" onclick={() => editing = content = ''}>
            <AIcon path={mdiPencil} size="1.25rem" />
          </button>
        {/if}
        <button class={'rounded text-white p-1 cursor-pointer m-1 transition-all ' + (content.match(/\S/) ? 'bg-blue-500' : 'bg-zinc-600')} onclick={enter}>
          <AIcon path={mdiSend} size="1.25rem" />
        </button>
      </div>
    </div>
  </div>
</div>

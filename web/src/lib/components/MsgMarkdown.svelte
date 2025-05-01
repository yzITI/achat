<script>
  import { marked } from 'marked'
  import DOMPurify from 'dompurify'
  const { msg } = $props()
  let el = $state()
  const html = DOMPurify.sanitize(marked.parse(msg.content, { breaks: true }))
  setTimeout(() => window.renderMathInElement(el))
</script>

<div class="prose prose-zinc prose-invert" bind:this={el}>
  {@html html}
</div>

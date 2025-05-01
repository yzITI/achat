<script>
  import { marked } from 'marked'
  import DOMPurify from 'dompurify'
  const { msg } = $props()
  const html = DOMPurify.sanitize(marked.parse(msg.content, { breaks: true }))
</script>

<div>
  {@html html}
</div>

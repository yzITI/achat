<script>
  import { marked } from 'marked'
  import katex from 'katex'
  import 'katex/dist/katex.min.css'
  import 'highlight.js/styles/monokai-sublime.css'
  import DOMPurify from 'dompurify'
  const { msg, _id } = $props()
  let el = $state()

  function renderInHTMLString (htmlString) {
    let outputString = htmlString
    const replaceLatex = (match, latex, displayMode) => {
      try { return katex.renderToString(latex, { displayMode: displayMode, throwOnError: false, output: 'mathml' }) }
      catch (error) { return match }
    }
    // Regular expressions to find LaTeX delimiters
    outputString = outputString.replace(/(?<!\\)\$\$([\s\S]+?)(?<!\\)\$\$/g, (match, p1) => replaceLatex(match, p1, true))
    outputString = outputString.replace(/(?<!\\)\$(.+?)(?<!\\)\$/g, (match, p1) => replaceLatex(match, p1, false))
    outputString = outputString.replace(/(?<!\\)\\\((.+?)(?<!\\)\\\)/g, (match, p1) => replaceLatex(match, p1, false))
    outputString = outputString.replace(/(?<!\\)\\\[([\s\S]+?)(?<!\\)\\\]/g, (match, p1) => replaceLatex(match, p1, true))
    return outputString
  }

  function parse () {
    let raw = marked.parse(msg.content, { breaks: true })
    raw = renderInHTMLString(raw)
    setTimeout(async () => {
      const els = document.querySelectorAll(`div[_id='${_id}'] pre code`)
      const hljs = await import('highlight.js').then(m => m.default)
      for (const e of els) hljs.highlightElement(e)
    })
    return DOMPurify.sanitize(raw)
  }
  const html = parse()
</script>

<div class="w-full prose prose-zinc prose-invert prose-blockquote:border-zinc-400 prose-li:marker:text-zinc-400 prose-pre:p-0" bind:this={el} style="max-width: 100%;" {_id}>
  {@html html}
</div>

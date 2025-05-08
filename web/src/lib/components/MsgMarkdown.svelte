<script>
  import { marked } from 'marked'
  import katex from 'katex'
  import 'katex/dist/katex.min.css'
  import DOMPurify from 'dompurify'
  const { msg } = $props()
  let el = $state()

  // TODO: add highlight.js support

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
    return DOMPurify.sanitize(raw)
  }
  const html = parse()
</script>

<div class="w-full prose prose-zinc prose-invert prose-blockquote:border-zinc-400 prose-li:marker:text-zinc-400" bind:this={el} style="max-width: 100%;">
  {@html html}
</div>

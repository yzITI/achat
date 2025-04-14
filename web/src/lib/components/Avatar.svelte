<script>
  let styles = $state([])
  let { size, user } = $props()
  function getStyles () {
    const id = user
    if (!id) return []
    const idArray = []
    for (let i = 0; i < id.length; i += 6) {
      idArray.push(id.slice(i, i + 6))
    }
    styles = idArray.map(x => `background: #${x};`)
  }
  $effect(getStyles)
</script>

<div class="overflow-hidden rounded relative grid grid-cols-2" style={`height: ${size}; width: ${size};`}>
  <div style={styles[1]}></div>
  <div style={styles[2]}></div>
  <div style={styles[3]}></div>
  <div style={styles[4]}></div>
  <div style={styles[0] + ' height: 60%; width: 60%; left: 20%; top: 20%;'} class="absolute rounded-full"></div>
</div>

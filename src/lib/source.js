export function getSource() {
  const params = new URLSearchParams(window.location.search)
  return params.get('source') || 'direct'
}

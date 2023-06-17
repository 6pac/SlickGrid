const svgs = [
  { name: 'sgi-clouds', value: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/></svg>' },
]
// https://bl.ocks.org/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
export function encodeSvg(svg) {
  return svg.replace('<svg', (~svg.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
}

export function encodeAllIcons() {
  for (let svg of svgs) {
    const dataUri = `data:image/svg+xml;utf8,${encodeSvg(svg)}`;
  }
}
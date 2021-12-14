export function trailerMarkup(data) {
  return `<iframe
  id="player"
  type="text/html"
  width="640"
  height="360"
  src="https://www.youtube.com/embed/${data.videos.results[0].key}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
  frameborder="0"
></iframe>`;
}

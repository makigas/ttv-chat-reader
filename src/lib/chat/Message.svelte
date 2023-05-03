<script lang="ts">
  import type { MessagePayload } from "../stores";
  import TimeAgo from "javascript-time-ago";
  import es from "javascript-time-ago/locale/es";
  import { formatMessage } from "./tmi";
  import { onDestroy, onMount } from "svelte";

  export let message: MessagePayload;

  let iso = new Date(message.datetime).toISOString();

  TimeAgo.addDefaultLocale(es);
  const timeago = new TimeAgo("es");

  function getTimeAgo(datetime) {
    let ago = timeago.format(datetime, 'round');
    const diff = Date.now() - datetime;
    if (diff > 5 * 60 * 1000) {
      ago = ago + " 💀";
    }
    return ago;
  }

  let ago = getTimeAgo(message.datetime);

  let interval;

  onMount(() => {
    interval = setInterval(() => {
      ago = getTimeAgo(message.datetime);
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="root" data-uuid={message.uuid} data-user={message.user}>
  <p
    class="sender"
    style:--color={message.userColor}
    data-color={message.userColor}
  >
    {message.user}
  </p>
  <div class="message-content">
    {@html formatMessage(message)}
  </div>
  <p class="ago">
    <time datetime={iso}>{ago}</time>
  </p>
</div>

<style>
  div {
    font-size: 36px;
    line-height: 1.5;
  }
  .sender {
    color: var(--color);
    font-weight: bold;
    margin-bottom: 0;
  }
  .ago {
    margin-top: 1em;
    font-size: 24px;
    font-weight: bold;
  }
</style>

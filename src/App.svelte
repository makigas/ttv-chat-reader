<script lang="ts">
  import ChatProvider from './lib/io/ChatProvider.svelte';

  let url = window.location.href;
  let qs = new URL(url);
  let channel = qs.searchParams.get("channel");
</script>

<main>
  {#if channel}
    <ChatProvider channelName={channel} />
  {:else}
    <form method="GET" action=".">
      <input type="text" name="channel" placeholder="Nombre de canal" />
      <button type="submit">Ver</button>
    </form>
  {/if}
</main>

<style>
</style>

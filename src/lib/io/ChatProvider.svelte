<script lang="ts">
  import { onMount } from "svelte";
  import tmi from "tmi.js";
  import {
    deleteMessagePayload,
    messages,
    newMessagePayload,
    popMessagePayload,
    pushMessagePayload,
  } from "../stores";
  import Message from "../chat/Message.svelte";
  import { SpeakerQueue } from "./speaker";

  export let channelName: string;

  let speaker = new SpeakerQueue("Jorge", "es-ES");

  let client = new tmi.Client({
    channels: [channelName],
  });

  client.on("message", (channel, tags, message, self) => {
    console.log("message", { channel, tags, message, self });
    if (message.includes("http://") || message.includes("https://")) {
      speaker.pushMessage(`${tags["display-name"]} ha enviado un link`);
    } else {
      speaker.pushMessage(message);
    }
    messages.update((list) =>
      pushMessagePayload(list, {
        datetime: parseInt(tags["tmi-sent-ts"]),
        emotes: tags["emotes"],
        message: message,
        user: tags["display-name"],
        userColor: tags["color"],
        uuid: tags["id"],
      })
    );
  });

  client.on(
    "messagedeleted",
    (channel, username, deletedMessage, userstate) => {
      console.log("messagedeleted", {
        channel,
        username,
        deletedMessage,
        userstate,
      });
      messages.update((list) =>
        deleteMessagePayload(list, userstate["target-msg-id"])
      );
    }
  );

  client.on("clearchat", (channel) => {
    console.log("clearchat", { channel });
    messages.update((list) => newMessagePayload());
  });

  onMount(() => {
    client.connect();
  });

  const nextMessage = () => {
    messages.update((list) => popMessagePayload(list));
  };

  const purge = () => {
    messages.update((list) => newMessagePayload());
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      nextMessage();
    }

    // delete button
    if (event.key === "Delete") {
      purge();
    }
  };
</script>

<div class="container" data-channel={channelName}>
  <div class="queue-length-block">
    <p class="queue-length">
      <strong>Mensajes en cola: {$messages.messages.length}</strong>
    </p>
  </div>

  {#if $messages.messages[0]}
    <Message message={$messages.messages[0]} />
  {:else}
    <p class="no-messages">Al día ☀️</p>
  {/if}

  <div class="buttons-block">
    <p class="buttons">
      <button on:click={nextMessage}>Pasar al siguiente</button>
      <button on:click={purge}>Limpiar cola</button>
    </p>
  </div>
</div>

<svelte:window on:keydown={handleKeyPress} />

<style>
  .queue-length-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .buttons-block {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .no-messages {
    font-size: 36px;
  }
</style>

import { createSignal, onMount, For } from "solid-js";
import { createStore } from "solid-js/store";
import { socket } from "~/lib/socket";

export default function ChatBox() {
  const [messageInput, setMessageInput] = createSignal("");
  const [messages, setMessages] = createStore<string[]>([]);

  onMount(() => {
    askUserName();
    appendMessage("You joined");
    socket.on("chat-message", (data) => {
      appendMessage(`${data.name}: ${data.message}`);
    });
    socket.on("user-connected", (name) => {
      appendMessage(`${name} connected`);
    });
    socket.on("user-disconnected", (name) => {
      appendMessage(`${name} disconnected`);
    });
  });

  const appendMessage = (message: string) =>
    setMessages(messages.length, message);

  const askUserName = () => {
    let myName = prompt("What is your name?");
    if (!myName) {
      socket.emit("new-user", "unknown");
    } else {
      socket.emit("new-user", myName);
    }
  };

  const handleInput = (e: Event) => {
    e.preventDefault();
    const message = messageInput();
    appendMessage(`You: ${message}`);
    socket.emit("send-chat-message", message);
    setMessageInput("");
  };

  return (
    <>
      <div id="message-container">
        <For each={messages}>{(msg) => <div>{msg}</div>}</For>
      </div>
      <form id="send-container" onSubmit={handleInput}>
        <input
          type="text"
          value={messageInput()}
          onChange={(e) => setMessageInput(e.target.value)}
          id="message-input"
        />
        <button type="submit" id="send-button">
          Send
        </button>
      </form>
    </>
  );
}

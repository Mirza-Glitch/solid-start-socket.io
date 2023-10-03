import ChatBox from "~/components/ChatBox";
import { socket } from "~/lib/socket";

export default function Home() {
  socket.on("connect", () => {
    console.log("connected to server!!");
  });

  return (
    <main>
      <ChatBox />
    </main>
  );
}

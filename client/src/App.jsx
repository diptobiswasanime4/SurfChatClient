import { useState, useEffect } from "react";
import io from "socket.io-client";
import Register from "./components/Register";
import { userState } from "./state/atoms/userState";
import { useRecoilState } from "recoil";

const ENDPOINT = "ec2-54-175-162-106.compute-1.amazonaws.com:3000";
let socket;

function App() {
  const [user] = useRecoilState(userState);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  async function sendPrivateMessage(s) {
    const data = { sender: user.username, message: input };
    console.log(data);
    setChat((prevChat) => [...prevChat, { ...data, dir: " ml-auto" }]);
    await s.emit("send-chat-message", data);
  }

  useEffect(() => {
    if (user.username != "") {
      socket = io(ENDPOINT, {
        query: { ...user },
      });

      socket.on("chat-message", (data) => {
        console.log(data);
        setChat((prevChat) => [...prevChat, { ...data, dir: " mr-auto" }]);
      });
    }
  }, [user]);

  if (!user.username) {
    return <Register />;
  } else {
    return (
      <div className="bg-orange-100 flex flex-col items-center gap-4 pt-8 pb-32">
        <div className="text-xl">Welcome to the chat, {user.username}</div>
        <div className="bg-gray-100 flex flex-col gap-2 border-2 border-black rounded-lg shadow-md h-[350px] w-[400px] overflow-y-auto">
          {chat &&
            chat.map((data, index) => {
              return (
                <div
                  key={index}
                  className={
                    "bg-orange-700 text-white p-2 text-lg rounded-md w-2/3 mx-2" +
                    data.dir
                  }
                >
                  {data.sender}: {data.message}
                </div>
              );
            })}
        </div>
        <div className="w-[400px] flex gap-2">
          <textarea
            placeholder="You're chatting with a stranger. Say Hi!"
            className="w-full rounded-lg p-1 text-lg shadow-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => sendPrivateMessage(socket)}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xl px-2 my-4 rounded-md shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default App;

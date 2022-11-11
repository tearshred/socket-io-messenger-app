import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat.js';

// Connecting our front end to the back end
const socket = io('http://192.168.1.17:3001');


function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      // Sends the room to the back-end
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
      <div className="joinChatContainer">
        <h4>Join a chat room</h4>
        <input
          type="text"
          placeholder="John..."
          onChange={(event) => { setUsername(event.target.value) }}
        />
        <input
          type="text"
          placeholder="Room ID"
          onChange={(event) => {setRoom(event.target.value) }}
        />

        <button onClick={joinRoom}>Join Room</button>
      </div>
        )
      : 
        (
      <Chat
        socket={socket}
        username={username}
        room={room}
      />)}
    </div>

  );
}

export default App;

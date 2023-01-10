import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import { conversations } from '../chats';
import { generateID } from '../utils';
import Darkmode from 'drkmd-js'


export default function Home() {
  const [chats, updateChats] = useState(conversations);
  const darkmode = new Darkmode()
  darkmode.toggle()
  darkmode.attach()

  return (
    <div className="container text-center landing-hero">
      <h1>
        Demonstrate your experiments with a suitable layout for your audience
      </h1>
      <p style={{ margin: '10px 0' }}>
        Create, customize and share your experiments with an easy-to-use and
        interactive interface
      </p>
      <Link className="button" to="/templates">
        Get started
      </Link>
      <div className="divider" />
      <ChatWindow
        title="CoronaBot Demo"
        session_id={generateID()}
        chats={chats}
        updateChats={updateChats}
        width={280}
        height={350}
      />
    </div>
  );
}

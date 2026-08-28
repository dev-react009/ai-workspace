"use client";

import {useState} from "react";

export default function ChatPage() {
    const [message,setMessage] = useState<string>("");
    const [chatHistory,setChatHistory] = useState<{role:string; content:string}[]>([]);

    async function handleSendmessage() {
        if(!message.trim()) return;


        const response =  await fetch("/api/chat",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                message,
                chatHistory
            })
        });

        const data = await response.json();
        setChatHistory([...chatHistory,{role:"user",content:message},{role:"assistant",content:data.message}]);

    }

    
    return (
        <div>

            {chatHistory.map((chat,index)=>(
               <div key ={index}>
                <strong>{chat.role}</strong> : <p>{chat.content}</p>
               </div>

            ) )}
            <input
                type="text"
                value={message}
                onChange={(event)=>setMessage(event.target.value)}
                placeholder="Ask anything"
            />

            <button onClick={handleSendmessage}>Send</button>
        </div>
    )
}
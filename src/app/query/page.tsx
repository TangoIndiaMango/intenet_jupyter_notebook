"use client"
import { useChat } from "ai/react";
import { Atom, Send } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

    useEffect(() => {
      const messageContainer = document.getElementById('message-container');
      messageContainer?.scrollTo(0, messageContainer.scrollHeight);
    }, [messages])
    
    return (
        <div className="container mx-auto px-4" id="message-container">
            <div className="pt-4 pb-32">
                {messages.map((message) => (
                    <div key={message.id} className={`border-t border-black/10 ${message.role === 'assistant' && 'bg-gray-50'}`}>
                        <div className="max-w-3xl mx-auto py-6 flex prose break-words">
                            {message.role === 'assistant' && <span><Atom className="" /></span>}
                            <div className="ml-3 rounded-lg">
                                {message.content}
                            </div>
                        </div>
                    </div>
                ))}
                <form onSubmit={handleSubmit} className="fixed inset-x-0 bottom-10 flex mx-auto items-center justify-center">
                    <input 
                        placeholder="Send a message" 
                        value={input} 
                        onChange={handleInputChange} 
                        className="flex-grow max-w-3xl shadow-xl py-2 px-4 h-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <button 
                        type="submit" 
                        disabled={!input || isLoading} 
                        className={`ml-2 py-2 px-4 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
                    >
                        <Send />
                    </button>
                </form>
            </div>
        </div>
    )
}

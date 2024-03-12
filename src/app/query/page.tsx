"use client"
import { useChat } from "ai/react";
import { Atom, Send } from "lucide-react";

export default function Home() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

    return (
        <div className="container mx-auto px-4">
            <div className="pt-4 pb-32">
                {messages.map((message, index) => (
                    <div key={index} className={`border-t border-black/10 ${message.role === 'assistant' && 'bg-gray-50'}`}>
                        <div className="max-w-3xl mx-auto py-6 flex prose break-words">
                            {message.role === 'assistant' && <span><Atom className="" /></span>}
                            <span className="ml-3">
                                {message.content}
                            </span>
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

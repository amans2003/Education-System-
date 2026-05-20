import React, { useState } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { userInfo } = useAuthStore();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can we help you today?", sender: 'system' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');

        try {
            await api.post('/messages', {
                text: currentInput,
                senderName: userInfo ? userInfo.name : 'Guest User',
                senderEmail: userInfo ? userInfo.email : 'guest@example.com',
                senderId: userInfo ? userInfo._id : null
            });
            
            // Mock system response for UX
            setTimeout(() => {
                const systemMsg = { 
                    id: Date.now() + 1, 
                    text: "Thanks for your message! An agent will get back to you soon.", 
                    sender: 'system' 
                };
                setMessages(prev => [...prev, systemMsg]);
            }, 1000);
        } catch (error) {
            console.error('Chat error:', error);
            toast.error('Message could not be sent to support');
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[100]">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-80 md:w-80 h-[400px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-primary-600 p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold">Live Support</h4>
                                <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-300">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${m.sender === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20 text-sm"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button className="bg-primary-600 text-white p-3 rounded-2xl hover:bg-primary-700 transition-300">
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Float Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 hover:shadow-primary-200/50 ${isOpen ? 'bg-white text-primary-600 rotate-90' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
            >
                {isOpen ? <X className="w-6 h-6 sm:w-8 sm:h-8" /> : <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />}
            </button>
        </div>
    );
};

export default Chatbox;

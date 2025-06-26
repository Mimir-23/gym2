import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { MessageSquare, Send, X } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hola! Soy tu coach virtual. ¿En qué puedo ayudarte?' },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const { data: productos } = await supabase
        .from('productos')
        .select('nombre, descripcion')
        .limit(50);

      const { reply } = await fakeGeminiChat(newMessages, productos || []);
      setMessages([...newMessages, { role: 'bot', content: reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'bot', content: 'Ocurrió un error al obtener la respuesta.' },
      ]);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-50 hover:bg-red-700 transition"
        >
          <MessageSquare size={24} />
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-20 right-4 bg-white text-black rounded-lg shadow-lg w-80 flex flex-col z-50">
          <div className="flex justify-between items-center p-3 border-b border-gray-200">
            <span className="font-bold text-primary">Coach</span>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div
            ref={messagesEndRef}
            className="flex-1 overflow-y-auto p-3 space-y-2"
            style={{ maxHeight: '300px' }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={m.role === 'user' ? 'text-right' : 'text-left'}
              >
                <div
                  className={`inline-block px-2 py-1 rounded text-sm ${m.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-2 border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-2 py-1 mr-2 text-black"
              placeholder="Escribe tu mensaje"
            />
            <button
              onClick={handleSend}
              className="text-primary hover:text-red-700"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

async function fakeGeminiChat(messages, productos) {
  const productosTexto = productos.map((p) => p.nombre).join(', ');
  const last = messages[messages.length - 1].content;
  return {
    reply: `Respuesta simulada para "${last}". Productos disponibles: ${productosTexto}`,
  };
}

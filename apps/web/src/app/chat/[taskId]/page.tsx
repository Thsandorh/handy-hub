'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { io, Socket } from 'socket.io-client';

export default function ChatPage() {
  const params = useParams();
  const taskId = params.taskId as string;

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchConversation();
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';
    const newSocket = io(wsUrl);

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('newMessage', (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);
  };

  const fetchConversation = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

      // Get or create conversation
      const convResponse = await fetch(
        `${apiUrl}/messages/conversation/task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const convData = await convResponse.json();
      setConversation(convData);

      // Join conversation room
      if (socket) {
        socket.emit('joinConversation', { conversationId: convData.id });
      }

      // Get messages
      const messagesResponse = await fetch(
        `${apiUrl}/messages/conversation/${convData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const messagesData = await messagesResponse.json();
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !conversation || !user) return;

    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

    try {
      // Send via Socket.io for real-time
      if (socket) {
        socket.emit('sendMessage', {
          conversationId: conversation.id,
          senderId: user.id,
          content: newMessage,
        });
      } else {
        // Fallback to HTTP if Socket not available
        await fetch(`${apiUrl}/messages/conversation/${conversation.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newMessage }),
        });

        // Refresh messages
        fetchConversation();
      }

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Betöltés...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MesterPont
          </Link>
          <Link href={`/tasks/${taskId}`}>
            <Button variant="outline" size="sm">
              Feladat megtekintése
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle>Chat</CardTitle>
            <p className="text-sm text-gray-600">
              Feladat: {conversation?.task?.title || 'Betöltés...'}
            </p>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p className="mb-2">Még nincsenek üzenetek</p>
                <p className="text-sm">Kezdd el a beszélgetést!</p>
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const isOwnMessage = user?.id === message.sender.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        } rounded-lg px-4 py-2`}
                      >
                        {!isOwnMessage && (
                          <p className="text-xs font-semibold mb-1">
                            {message.sender.firstName} {message.sender.lastName}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString('hu-HU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Írj üzenetet..."
                className="flex-1"
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                Küldés
              </Button>
            </form>
          </div>
        </Card>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tipp:</strong> A chat valós időben működik! Az üzenetek azonnal megjelennek mindkét félnél.
          </p>
        </div>
      </div>
    </div>
  );
}

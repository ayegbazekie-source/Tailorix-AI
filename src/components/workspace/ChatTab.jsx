import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatTab({ workspaceId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    
    const unsubscribe = base44.entities.WorkspaceMessage.subscribe((event) => {
      if (event.data.workspace_id === workspaceId) {
        if (event.type === 'create' && event.data.sender_user_id !== currentUser.id) {
          toast.success(`${event.data.sender_name}: ${event.data.message_text.substring(0, 50)}...`);
        }
        loadMessages();
      }
    });

    return unsubscribe;
  }, [workspaceId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const workspaceMessages = await base44.entities.WorkspaceMessage.filter({
        workspace_id: workspaceId
      }, 'created_date', 100);
      setMessages(workspaceMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const tempId = `temp_${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      workspace_id: workspaceId,
      sender_user_id: currentUser.id,
      sender_name: currentUser.full_name || currentUser.email,
      message_text: messageText,
      created_date: new Date().toISOString(),
      _optimistic: true
    };

    // Optimistic UI update
    setMessages(prev => [...prev, optimisticMessage]);
    const currentMessage = messageText;
    setMessageText('');
    setSending(true);

    try {
      const newMessage = await base44.entities.WorkspaceMessage.create({
        workspace_id: workspaceId,
        sender_user_id: currentUser.id,
        sender_name: currentUser.full_name || currentUser.email,
        message_text: currentMessage
      });

      // Replace optimistic message with real one
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? newMessage : msg
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      // Rollback on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setMessageText(currentMessage);
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-amber-500/20 h-[600px] flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-amber-200/60">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.sender_user_id === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900'
                      : 'bg-slate-700/50 text-white'
                  }`}
                >
                  {!isCurrentUser && (
                    <p className="text-xs font-semibold mb-1 text-amber-300">
                      {msg.sender_name}
                    </p>
                  )}
                  <p className="text-sm">{msg.message_text}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser ? 'text-slate-700' : 'text-amber-200/40'}`}>
                    {new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-amber-500/20 p-4">
        <div className="flex gap-3">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-900/50 border-amber-500/20 text-white"
          />
          <Button
            onClick={sendMessage}
            disabled={sending || !messageText.trim()}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
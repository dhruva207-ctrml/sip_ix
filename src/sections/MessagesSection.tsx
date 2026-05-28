import { useState } from 'react';
import { Send, User } from 'lucide-react';
import { useApp } from '../store';
import EmptyState from '../components/EmptyState';

export default function MessagesSection() {
  const { state, dispatch } = useApp();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const myConversations = state.conversations.filter(c =>
    c.participantIds.includes(state.currentUser.id)
  );

  const selectedConversation = myConversations.find(c => c.id === selectedConv);
  const convMessages = selectedConversation
    ? state.messages.filter(m => m.conversationId === selectedConversation.id)
    : [];

  const handleSend = () => {
    if (!messageText.trim() || !selectedConv) return;
    const newMsg = {
      id: Math.random().toString(36).substring(2, 10),
      conversationId: selectedConv,
      senderId: state.currentUser.id,
      senderName: state.currentUser.name,
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      isSystem: false,
    };
    dispatch({ type: 'SEND_MESSAGE', payload: newMsg });
    setMessageText('');
  };

  if (myConversations.length === 0) {
    return (
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Messages</h2>
        <EmptyState icon="message" title="No messages yet" description="Start a conversation with a farmer or buyer." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-140px)]">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Messages</h2>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden flex h-full">
        {/* Conversation list */}
        <div className="w-72 border-r border-slate-100 overflow-y-auto flex-shrink-0">
          {myConversations.map(conv => {
            const otherParticipant = conv.participantIds.find(id => id !== state.currentUser.id);
            const otherUser = state.users.find(u => u.id === otherParticipant);
            return (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedConv(conv.id);
                  dispatch({ type: 'MARK_CONVERSATION_READ', payload: conv.id });
                }}
                className={`w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-slate-50 ${
                  selectedConv === conv.id ? 'bg-green-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0">
                  {otherUser?.avatar || <User className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold text-slate-800' : 'font-medium text-slate-700'}`}>
                      {otherUser?.name || conv.participantNames.find(n => n !== state.currentUser.name)}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                  {state.users.find(u => selectedConversation.participantIds.includes(u.id) && u.id !== state.currentUser.id)?.avatar || <User className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">
                    {selectedConversation.participantNames.find(n => n !== state.currentUser.name)}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {convMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isSystem ? 'justify-center' : msg.senderId === state.currentUser.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.isSystem ? (
                      <div className="bg-warm-100 text-slate-500 text-xs px-4 py-2 rounded-full max-w-[80%]">
                        {msg.content}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                          msg.senderId === state.currentUser.id
                            ? 'bg-green-500 text-white rounded-br-md'
                            : 'bg-slate-100 text-slate-700 rounded-bl-md'
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-green-400"
                />
                <button
                  onClick={handleSend}
                  className="p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

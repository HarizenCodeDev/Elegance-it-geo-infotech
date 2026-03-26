import { useState, useMemo, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Search, Plus, X, Send, MoreVertical, Phone, Video, ArrowLeft, CheckCheck, Image, Smile, MessageCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ChatWindow = () => {
  const [user, setUser] = useState(null);
  const [directContacts, setDirectContacts] = useState([]);
  const [customGroups, setCustomGroups] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState({});
  const [text, setText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData._id) {
      const token = localStorage.getItem("token");
      if (token) {
        axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
          if (res.data.user) {
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        }).catch(() => {});
      }
    } else {
      setUser(userData);
    }
  }, []);

  const userId = user?._id;

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/employees`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 500 },
        });
        const contacts = res.data.users
          ?.filter((u) => u._id !== userId)
          .map((u) => ({ 
            id: u._id, 
            name: u.name, 
            department: u.department, 
            avatar: u.profileImage,
            role: u.role 
          })) || [];
        setDirectContacts(contacts);
        
        const online = new Set(contacts.map(c => c.id));
        online.forEach(id => onlineUsers.add(id));
        setOnlineUsers(online);
        
        if (!activeContact && contacts.length > 0) {
          setActiveContact(contacts[0].id);
        }
      } catch {}
    };
    loadContacts();
  }, [userId]);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/chat/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setCustomGroups(res.data.groups || []);
        }
      } catch {}
    };
    loadGroups();
  }, []);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return directContacts;
    const query = searchQuery.toLowerCase();
    return directContacts.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.department && c.department.toLowerCase().includes(query))
    );
  }, [searchQuery, directContacts]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return customGroups;
    const query = searchQuery.toLowerCase();
    return customGroups.filter((g) =>
      g.name.toLowerCase().includes(query)
    );
  }, [searchQuery, customGroups]);

  const loadMessages = async (contactId = activeContact) => {
    if (!contactId) return;
    setLoadingMessages(true);
    try {
      const token = localStorage.getItem("token");
      const isGroup = contactId.startsWith("grp-");
      const res = await axios.get(`${API_BASE}/api/chat`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { contactId, type: isGroup ? "group" : "direct" },
      });
      const msgs = res.data?.messages || [];
      setMessages((prev) => ({ ...prev, [contactId]: msgs }));
      
      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        setLastMessages((prev) => ({ ...prev, [contactId]: lastMsg }));
      }
    } catch {} finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeContact) loadMessages();
  }, [activeContact]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeContact) loadMessages(activeContact);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  const currentMessages = useMemo(() => {
    let msgs = messages[activeContact] || [];
    if (messageSearch.trim()) {
      const query = messageSearch.toLowerCase();
      msgs = msgs.filter(m => m.text?.toLowerCase().includes(query));
    }
    return msgs;
  }, [messages, activeContact, messageSearch]);

  const send = async (e) => {
    e?.preventDefault();
    if (!text.trim() || !activeContact) return;

    const isGroup = activeContact.startsWith("grp-");
    const tempId = `temp-${Date.now()}`;
    const newMsg = {
      _id: tempId,
      text: text.trim(),
      from: { _id: userId, name: user?.name || "You" },
      isYou: true,
      ts: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), newMsg],
    }));
    setText("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/api/chat`,
        { contactId: activeContact, type: isGroup ? "group" : "direct", text: text.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadMessages(activeContact);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/api/chat/groups`,
        { name: newGroupName, description: newGroupDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCustomGroups((prev) => [res.data.group, ...prev]);
        setShowCreateGroup(false);
        setNewGroupName("");
        setNewGroupDesc("");
        toast.success("Group created!");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const activeContactData = [
    ...directContacts.filter((c) => c.id === activeContact),
    ...customGroups.filter((g) => g.id === activeContact),
  ][0];

  const activeName = activeContactData?.name;
  const isGroupChat = activeContact?.startsWith("grp-");
  const isOnline = activeContact && !isGroupChat && onlineUsers.has(activeContact);

  const getInitials = (name) => {
    return (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const getMessageDate = (ts) => {
    if (!ts) return null;
    return new Date(ts).toDateString();
  };

  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDate = null;
    
    currentMessages.forEach((msg, idx) => {
      const msgDate = getMessageDate(msg.ts);
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ type: "date", date: msgDate, displayDate: formatDate(msg.ts) });
      }
      groups.push({ type: "message", ...msg });
    });
    
    return groups;
  }, [currentMessages]);

  return (
    <div className="h-full flex rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <aside className={`${showSidebar ? 'w-80' : 'w-0'} flex-shrink-0 overflow-hidden transition-all duration-300 border-r`} style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
        <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Messages</h2>
          <button onClick={() => setShowCreateGroup(true)} className="p-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-primary)' }}>
            <Plus size={20} />
          </button>
        </div>

        <div className="p-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input type="text" placeholder="Search contacts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-9 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-110px)]">
          {filteredGroups.length > 0 && (
            <div className="px-3 py-1">
              <span className="text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>Groups</span>
            </div>
          )}
          {filteredGroups.map((g) => {
            const lastMsg = lastMessages[g.id];
            return (
              <button key={g.id} onClick={() => { setActiveContact(g.id); setShowSidebar(false); }}
                className="w-full flex items-center gap-3 px-3 py-3 transition-colors" style={{ backgroundColor: activeContact === g.id ? 'var(--color-primary-muted)' : 'transparent' }}>
                <div className="relative">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#25D366' }}>
                    <span className="text-white font-medium">{getInitials(g.name)}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{g.name}</div>
                    {lastMsg && <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatTime(lastMsg.ts)}</div>}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {lastMsg ? (lastMsg.isYou ? "You: " : `${lastMsg.from?.name}: `) : ""}{lastMsg?.text || 'No messages yet'}
                  </div>
                </div>
                {unreadCounts[g.id] > 0 && (
                  <div className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">{unreadCounts[g.id]}</div>
                )}
              </button>
            );
          })}

          {filteredGroups.length > 0 && filteredContacts.length > 0 && (
            <div className="px-3 py-1 mt-2">
              <span className="text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>Contacts</span>
            </div>
          )}
          {filteredContacts.map((c) => {
            const lastMsg = lastMessages[c.id];
            return (
              <button key={c.id} onClick={() => { setActiveContact(c.id); setShowSidebar(false); }}
                className="w-full flex items-center gap-3 px-3 py-3 transition-colors" style={{ backgroundColor: activeContact === c.id ? 'var(--color-primary-muted)' : 'transparent' }}>
                <div className="relative">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: onlineUsers.has(c.id) ? 'var(--color-primary)' : 'var(--color-bg-tertiary)' }}>
                    <span className="font-medium" style={{ color: onlineUsers.has(c.id) ? 'var(--color-bg-primary)' : 'var(--color-text-muted)' }}>{getInitials(c.name)}</span>
                  </div>
                  {onlineUsers.has(c.id) && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2" style={{ borderColor: 'var(--color-bg-secondary)' }}></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{c.name}</div>
                    {lastMsg && <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatTime(lastMsg.ts)}</div>}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {lastMsg ? (lastMsg.isYou ? "You: " : `${lastMsg.from?.name}: `) : ""}{lastMsg?.text || (onlineUsers.has(c.id) ? "Online" : "Offline")}
                  </div>
                </div>
                {unreadCounts[c.id] > 0 && (
                  <div className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">{unreadCounts[c.id]}</div>
                )}
              </button>
            );
          })}

          {filteredContacts.length === 0 && filteredGroups.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>No contacts found</p>
            </div>
          )}
        </div>
      </aside>

      <section className="flex-1 flex flex-col">
        {activeContact ? (
          <>
            <header className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
              <button onClick={() => setShowSidebar(true)} className="p-1 rounded-full" style={{ color: 'var(--color-primary)' }}>
                <ArrowLeft size={24} />
              </button>
              <div className="relative">
                <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isGroupChat ? '#25D366' : 'var(--color-primary)' }}>
                  <span className="font-medium text-sm" style={{ color: isGroupChat ? 'white' : 'var(--color-bg-primary)' }}>{getInitials(activeName)}</span>
                </div>
                {!isGroupChat && isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2" style={{ borderColor: 'var(--color-bg-secondary)' }}></div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{activeName}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {isGroupChat ? `${customGroups.find(g => g.id === activeContact)?.description || 'Group'}` : (isOnline ? "Online" : "Offline")}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-full" style={{ color: 'var(--color-primary)', backgroundColor: showSearch ? 'var(--color-primary-muted)' : 'transparent' }}>
                  <Search size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-opacity-10 transition-colors" style={{ color: 'var(--color-primary)' }}><Phone size={20} /></button>
                <button className="p-2 rounded-full hover:bg-opacity-10 transition-colors" style={{ color: 'var(--color-primary)' }}><Video size={20} /></button>
                <button className="p-2 rounded-full hover:bg-opacity-10 transition-colors" style={{ color: 'var(--color-primary)' }}><MoreVertical size={20} /></button>
              </div>
            </header>

            {showSearch && (
              <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                  <input type="text" placeholder="Search in chat..." value={messageSearch} onChange={(e) => setMessageSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }} />
                  {messageSearch && (
                    <button onClick={() => setMessageSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-1" style={{ backgroundColor: '#0B141A' }}>
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-sm" style={{ color: '#8696A0' }}>Loading messages...</div>
                </div>
              ) : groupedMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="h-20 w-20 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <span className="text-3xl font-medium" style={{ color: 'var(--color-bg-primary)' }}>{getInitials(activeName)}</span>
                  </div>
                  <div className="text-lg font-medium" style={{ color: '#E9EDEF' }}>{activeName}</div>
                  <div className="text-sm mt-1" style={{ color: '#8696A0' }}>
                    {messageSearch ? "No messages found" : "Start a conversation"}
                  </div>
                </div>
              ) : (
                <>
                  {groupedMessages.map((item) => {
                    if (item.type === "date") {
                      return (
                        <div key={`date-${item.date}`} className="flex justify-center my-4">
                          <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#1F2C33', color: '#8696A0' }}>
                            {item.displayDate}
                          </span>
                        </div>
                      );
                    }

                    const showAvatar = !item.isYou && (groupedMessages[groupedMessages.indexOf(item) - 1]?.from?._id !== item.from?._id || groupedMessages[groupedMessages.indexOf(item) - 1]?.type === "date");
                    
                    return (
                      <div key={item._id} className={`flex ${item.isYou ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[65%] flex gap-1 ${item.isYou ? "flex-row-reverse" : ""}`}>
                          {!item.isYou && showAvatar && (
                            <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 self-end mb-1" style={{ backgroundColor: 'var(--color-primary)' }}>
                              <span className="text-xs font-medium" style={{ color: 'var(--color-bg-primary)' }}>{getInitials(item.from?.name)}</span>
                            </div>
                          )}
                          <div>
                            {!item.isYou && showAvatar && (
                              <div className="text-xs mb-1 ml-1" style={{ color: '#8696A0' }}>{item.from?.name}</div>
                            )}
                            <div className={`px-3 py-2 ${item.isYou ? "rounded-l-lg rounded-tr-lg" : "rounded-r-lg rounded-tl-lg"}`}
                              style={{ backgroundColor: item.isYou ? '#005C4B' : '#1F2C33', color: '#E9EDEF' }}>
                              <div className="text-sm break-words whitespace-pre-wrap">{item.text}</div>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${item.isYou ? "justify-end" : ""}`}>
                              <span className="text-[10px]" style={{ color: '#8696A0' }}>{formatTime(item.ts)}</span>
                              {item.isYou && <CheckCheck size={14} style={{ color: '#53BDEB' }} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <form onSubmit={send} className="p-3 flex items-center gap-2" style={{ backgroundColor: '#0B141A' }}>
              <button type="button" className="p-2 rounded-full" style={{ color: '#8696A0' }}><Smile size={24} /></button>
              <button type="button" className="p-2 rounded-full" style={{ color: '#8696A0' }}><Image size={24} /></button>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Message"
                className="flex-1 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: '#1F2C33', color: '#E9EDEF' }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
              <button type="submit" disabled={!text.trim()} className="p-2 rounded-full disabled:opacity-50" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-primary)' }}>
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#0B141A' }}>
            <div className="text-center">
              <div className="h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1F2C33' }}>
                <MessageCircle size={48} style={{ color: '#8696A0' }} />
              </div>
              <div className="text-xl font-light" style={{ color: '#E9EDEF' }}>Elegance Chat</div>
              <div className="text-sm mt-2" style={{ color: '#8696A0' }}>
                Select a contact to start messaging
              </div>
            </div>
          </div>
        )}
      </section>

      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-md mx-4" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Create Group</h3>
              <button onClick={() => setShowCreateGroup(false)} className="p-1 rounded" style={{ color: 'var(--color-text-muted)' }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Group Name *</label>
                <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Enter group name"
                  className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} maxLength={50} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Description</label>
                <input type="text" value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} placeholder="Enter description"
                  className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateGroup(false)} className="flex-1 px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}>Cancel</button>
                <button onClick={handleCreateGroup} disabled={creating || !newGroupName.trim()} className="flex-1 px-4 py-2 rounded-lg font-medium disabled:opacity-50" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-primary)' }}>
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;

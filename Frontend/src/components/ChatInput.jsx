import { useState, useRef, memo } from "react";
import { Smile, Paperclip, Send, Mic } from "lucide-react";

const EMOJIS = ["😀", "😂", "😍", "🥰", "😊", "😎", "🤔", "😅", "😭", "😤", "🥳", "😴", "🤗", "😇", "🙄", "😏", "👍", "👎", "👏", "🙌", "❤️", "💔", "✨", "🔥", "💯", "🎉", "🎊", "✅", "❌", "⚠️"];

const ChatInput = ({ onSend, activeContact }) => {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if ((!text.trim() && !attachment) || !activeContact) return;
    onSend(text.trim(), attachment);
    setText("");
    setAttachment(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setAttachment(file);
    e.target.value = "";
  };

  const insertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 flex flex-col gap-2 flex-shrink-0" style={{ backgroundColor: '#131c21' }}>
      {showEmojiPicker && (
        <div className="flex flex-wrap gap-1 p-2 bg-[#182229] rounded-lg max-w-xs">
          {EMOJIS.map((emoji) => (
            <button key={emoji} type="button" onClick={() => insertEmoji(emoji)}
              className="p-1 hover:bg-[#2a3338] rounded text-lg">{emoji}</button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 rounded-full hover:bg-[#182229] flex-shrink-0">
          <Smile size={24} className="text-gray-400" />
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full hover:bg-[#182229] flex-shrink-0">
          <Paperclip size={24} className="text-gray-400" />
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt" />
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-2xl text-sm text-white bg-[#182229] border-none outline-none"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }} />
        {(text.trim() || attachment) ? (
          <button type="submit" className="p-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#00a884', color: '#0d1117' }}>
            <Send size={20} />
          </button>
        ) : (
          <button type="button" className="p-2.5 rounded-full flex-shrink-0 bg-[#182229]">
            <Mic size={20} className="text-gray-400" />
          </button>
        )}
      </div>
      {attachment && (
        <div className="text-xs text-gray-400 px-2">Attached: {attachment.name}</div>
      )}
    </form>
  );
};

export default memo(ChatInput);

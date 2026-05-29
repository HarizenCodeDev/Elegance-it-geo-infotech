import { useState, memo } from "react";
import { X } from "lucide-react";

const ChatCreateGroup = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await onCreate(name.trim(), description.trim());
      setCreating(false);
      onClose();
    } catch {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-xl p-6 w-full max-w-md mx-4 bg-[#131c21]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Create Group</h3>
          <button onClick={onClose} className="p-1 rounded text-gray-400"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Group Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name" className="w-full rounded-lg px-3 py-2 bg-[#182229] text-white border-none" maxLength={50} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description" className="w-full rounded-lg px-3 py-2 bg-[#182229] text-white border-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg font-medium bg-[#182229] text-white">Cancel</button>
            <button onClick={handleCreate} disabled={creating || !name.trim()}
              className="flex-1 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              style={{ backgroundColor: '#00a884', color: '#0d1117' }}>
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatCreateGroup);

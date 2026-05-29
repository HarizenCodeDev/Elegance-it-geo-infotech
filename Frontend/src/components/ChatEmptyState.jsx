import { memo } from "react";
import { MessageCircle } from "lucide-react";

const ChatEmptyState = () => (
  <div className="flex-1 flex items-center justify-center bg-[#0d1117]">
    <div className="text-center">
      <div className="h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#182229]">
        <MessageCircle size={48} className="text-gray-400" />
      </div>
      <div className="text-xl font-light text-white">Elegance Chat</div>
      <div className="text-sm text-gray-400 mt-2">
        Select a contact to start messaging
      </div>
    </div>
  </div>
);

export default memo(ChatEmptyState);

import { memo } from "react";
import useChat from "../hooks/useChat";
import ChatContactList from "./ChatContactList";
import ChatMessageArea from "./ChatMessageArea";
import ChatInput from "./ChatInput";
import ChatCreateGroup from "./ChatCreateGroup";
import ChatEmptyState from "./ChatEmptyState";

const ChatWindow = () => {
  const {
    activeContact,
    setActiveContact,
    contactList,
    groupList,
    loadingContacts,
    loadingMessages,
    currentMessages,
    searchQuery,
    setSearchQuery,
    messageSearch,
    setMessageSearch,
    showSearch,
    setShowSearch,
    showCreateGroup,
    setShowCreateGroup,
    activeName,
    handleSend,
    handleCreateGroup,
    handleCloseCreateGroup,
  } = useChat();

  return (
    <div className="h-full flex rounded-xl overflow-hidden" style={{ backgroundColor: '#0d1117' }}>
      <ChatContactList
        groups={groupList}
        contacts={contactList}
        activeContact={activeContact}
        onSelect={setActiveContact}
        loading={loadingContacts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateGroup={() => setShowCreateGroup(true)}
      />

      {activeContact ? (
        <section className="flex-1 flex flex-col min-w-0 h-full bg-[#0d1117]">
          <ChatMessageArea
            activeContact={activeContact}
            activeName={activeName}
            messages={currentMessages}
            loading={loadingMessages}
            messageSearch={messageSearch}
            showSearch={showSearch}
            onToggleSearch={() => setShowSearch(!showSearch)}
            onSearchChange={setMessageSearch}
            onClearSearch={() => setMessageSearch("")}
          />
          <ChatInput onSend={handleSend} activeContact={activeContact} />
        </section>
      ) : (
        <ChatEmptyState />
      )}

      {showCreateGroup && (
        <ChatCreateGroup
          onClose={handleCloseCreateGroup}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default memo(ChatWindow);

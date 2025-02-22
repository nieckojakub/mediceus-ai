"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ConversationContextType {
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
}

export const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  return (
    <ConversationContext.Provider value={{ conversationId, setConversationId }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return context;
};

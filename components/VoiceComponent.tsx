"use client";

import React, { useEffect, useState } from "react";

// ElevenLabs
import { useConversation } from "@11labs/react";

// UI
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

const VoiceChat = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
    },
    onMessage: (message: string) => {
      console.log("Received message:", message);
    },
    onError: (error: string | Error) => {
      setErrorMessage(typeof error === "string" ? error : error.message);
      console.error("Error:", error);
    },
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    // Request microphone permission on component mount
    const requestMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        console.log("Microphone access granted");
      } catch (error) {
        setErrorMessage("Microphone access denied. Please enable microphone.");
        console.error("Error accessing microphone:", error);
      }
    };

    requestMicPermission();
  }, []);

  const handleStartConversation = async () => {
    try {
      // Replace with your actual agent ID or URL
      const conversationId = await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
        clientTools: {
          displayEvent: async ({eventValue, eventType}: {eventValue: string, eventType: string}) => {
            await fetch('http://localhost:5000/sendNotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventValue, eventType })
            });
          }
        }
      });
      console.log("Started conversation:", conversationId);
    } catch (error) {
      setErrorMessage("Failed to start conversation");
      console.error("Error starting conversation:", error);
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      setErrorMessage("Failed to end conversation");
      console.error("Error ending conversation:", error);
    }
  };

  return (
      <div className="space-y-4 flex flex-col items-center">
        <div className="flex justify-center w-full">
          {status === "connected" ? (
            <Button
              variant="destructive"
              onClick={handleEndConversation}
              className="w-auto"
            >
              <MicOff className="mr-2 h-4 w-4" />
              End Conversation
            </Button>
          ) : (
            <Button
              onClick={handleStartConversation}
              disabled={!hasPermission}
              className="w-auto"
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Conversation
            </Button>
          )}
        </div>

        <div className="text-center text-sm">
          {status === "connected" && (
            <p className="text-green-600">
              {isSpeaking ? "Agent is speaking..." : "Listening..."}
            </p>
          )}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {!hasPermission && (
            <p className="text-yellow-600">
              Please allow microphone access to use voice chat
            </p>
          )}
        </div>
      </div>
  );
};

export default VoiceChat;

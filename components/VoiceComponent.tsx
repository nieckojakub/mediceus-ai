"use client";

import React, { useEffect, useState, useContext } from "react";
import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { TableContext } from "@/components/TableContext"; // Import TableContext

const VoiceChat = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const tableContext = useContext(TableContext);
  const addRow = tableContext?.addRow || (() => {}); // Use TableContext to add rows or provide a default function

  const conversation = useConversation({
    onConnect: () => console.log("Connected to ElevenLabs"),
    onDisconnect: () => console.log("Disconnected from ElevenLabs"),
    onMessage: (message: string) => console.log("Received message:", message),
    onError: (error: string | Error) => {
      setErrorMessage(typeof error === "string" ? error : error.message);
      console.error("Error:", error);
    },
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        setErrorMessage("Microphone access denied. Please enable microphone.");
        console.error("Error accessing microphone:", error);
      }
    };
    requestMicPermission();
  }, []);

  const handleStartConversation = async () => {
    try {
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
        clientTools: {
          displayEvent: async ({ eventValue }: { eventValue: string }) => {
            const timestamp = new Date().toISOString();
            addRow(eventValue); // Add event data to table
          },
        },
      });
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

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch (error) {
      setErrorMessage("Failed to change volume");
      console.error("Error changing volume:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Voice Chat
          <Button variant="outline" size="icon" onClick={toggleMute} disabled={status !== "connected"}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={status === "connected" ? handleEndConversation : handleStartConversation} disabled={!hasPermission} className="w-full">
            {status === "connected" ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {status === "connected" ? "End Conversation" : "Start Conversation"}
          </Button>
          <div className="text-center text-sm">
            {status === "connected" && <p className="text-green-600">{isSpeaking ? "Agent is speaking..." : "Listening..."}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {!hasPermission && <p className="text-yellow-600">Please allow microphone access to use voice chat</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceChat;
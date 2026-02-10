import { useConversation } from "@elevenlabs/react";
import { useCallback, useState } from "react";
import AudioVisualizer from "./AudioVisualizer";

const AGENT_ID = "agent_01jzxaj4ytezvs1wxfbdev7wyx";

type Message = {
  source: "user" | "agent";
  text: string;
};

export default function VoiceAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const conversation = useConversation({
    onMessage: (message) => {
      if (message.source === "ai" && message.message) {
        setMessages((prev) => [
          ...prev,
          { source: "agent", text: message.message },
        ]);
      } else if (message.source === "user" && message.message) {
        setMessages((prev) => [
          ...prev,
          { source: "user", text: message.message },
        ]);
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      setErrorMessage("Connection error. Please try again.");
    },
    onConnect: () => {
      setErrorMessage(null);
    },
  });

  const startConversation = useCallback(async () => {
    setErrorMessage(null);
    setMessages([]);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setErrorMessage(
        "Microphone access is required. Please allow microphone access and try again."
      );
      return;
    }

    if (!AGENT_ID) {
      setErrorMessage("Voice agent not configured.");
      return;
    }

    try {
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "websocket",
      });
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setErrorMessage("Failed to connect. Please try again.");
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";

  const getOutputFrequency = useCallback(() => {
    return conversation.getOutputByteFrequencyData();
  }, [conversation]);

  const getInputFrequency = useCallback(() => {
    return conversation.getInputByteFrequencyData();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Orb */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
        <AudioVisualizer
          getFrequencyData={isConnected ? getOutputFrequency : null}
          isActive={isConnected}
          isSpeaking={conversation.isSpeaking}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {!isConnected && !isConnecting && (
            <button
              onClick={startConversation}
              className="pointer-events-auto group flex flex-col items-center gap-3 cursor-pointer"
              aria-label="Start voice conversation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-stone-400 group-hover:text-rose-300 transition-colors duration-300"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              <span className="text-sm tracking-widest text-stone-500 group-hover:text-stone-300 transition-colors duration-300 uppercase">
                start conversation
              </span>
            </button>
          )}

          {isConnecting && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-stone-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm tracking-widest text-stone-500 uppercase">
                connecting
              </span>
            </div>
          )}

          {isConnected && (
            <span className="text-sm tracking-widest text-stone-400 uppercase">
              {conversation.isSpeaking ? "speaking" : "listening"}
            </span>
          )}
        </div>

        {/* Input visualizer (when user speaks) */}
        {isConnected && !conversation.isSpeaking && (
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <AudioVisualizer
              getFrequencyData={getInputFrequency}
              isActive={true}
              isSpeaking={false}
            />
          </div>
        )}
      </div>

      {/* End button */}
      {isConnected && (
        <button
          onClick={stopConversation}
          className="text-sm tracking-widest text-stone-500 hover:text-rose-300 transition-colors duration-300 uppercase cursor-pointer"
          aria-label="End conversation"
        >
          end conversation
        </button>
      )}

      {/* Error */}
      {errorMessage && (
        <p className="text-sm text-rose-400/80 text-center max-w-sm">
          {errorMessage}
        </p>
      )}

      {/* Transcript */}
      {messages.length > 0 && (
        <div className="w-full max-w-md mt-4">
          <div className="max-h-48 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm font-extralight tracking-wide ${
                  msg.source === "agent"
                    ? "text-stone-300"
                    : "text-stone-500 italic"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

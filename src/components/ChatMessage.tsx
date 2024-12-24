import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isAi: boolean;
}

export const ChatMessage = ({ message, isAi }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-message-fade-in opacity-0",
        isAi ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm sm:text-base",
          isAi
            ? "bg-white text-gray-800 shadow-sm"
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        )}
      >
        {message}
      </div>
    </div>
  );
};
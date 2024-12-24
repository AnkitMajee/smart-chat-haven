import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  text: string;
  isAi: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      // Add user message
      setMessages((prev) => [...prev, { text: message, isAi: false }]);

      // Make API call to Perplexity
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("PERPLEXITY_API_KEY") || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant. Be precise and concise.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const aiMessage = data.choices[0].message.content;

      // Add AI response
      setMessages((prev) => [...prev, { text: aiMessage, isAi: true }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const apiKey = formData.get("apiKey") as string;
    localStorage.setItem("PERPLEXITY_API_KEY", apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully!",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white p-4 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-gray-800">AI Chat Assistant</h1>
      </header>

      {!localStorage.getItem("PERPLEXITY_API_KEY") && (
        <div className="mx-auto mt-8 w-full max-w-md rounded-lg border bg-white p-4 shadow-sm">
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                Enter your Perplexity API Key
              </label>
              <Input
                id="apiKey"
                name="apiKey"
                type="password"
                required
                placeholder="sk-..."
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Save API Key
            </Button>
          </form>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message.text} isAi={message.isAi} />
          ))}
        </div>
      </main>

      <footer className="border-t bg-white p-4">
        <div className="mx-auto max-w-2xl">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default Index;
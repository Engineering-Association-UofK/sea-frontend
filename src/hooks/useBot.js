import { useState, useCallback } from "react";
import api from "../utils/api.js";

export const useBot = (initialLang = "en") => {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);

  const sendMessage = useCallback(
    async (keyword, label = null) => {
      setLoading(true);

      // Chat history
      if (label) {
        setMessages((prev) => [...prev, { sender: "user", text: label }]);
      }

      try {
        const response = await api.post("/bot/command", {
          lang: initialLang,
          keyword: keyword,
        });

        const { responseText, options: newOptions, final } = response.data;

        setMessages((prev) => [...prev, { sender: "bot", text: responseText }]);
        setOptions(newOptions || []);
        setIsFinal(final);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "I'm having trouble connecting to the server. Please try again later.",
          },
        ]);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [initialLang],
  );

  const resetBot = useCallback(() => {
    setMessages([]);
    setOptions([]);
    setIsFinal(false);
    // Start the conversation
    sendMessage("@root");
  }, [sendMessage]);

  return { messages, options, loading, isFinal, sendMessage, resetBot };
};

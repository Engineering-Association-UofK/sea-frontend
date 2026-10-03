import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { botService } from "../api/bot.service";

export const useBot = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ sessionId, keyword, input, language }) =>
      botService.interact(sessionId, keyword, input, language),
    onSuccess: (data) => {
      if (data.metadata) {
        const { action_text, is_internal } = data.metadata;

        // Give the user 1.5s to read the message
        // before the view shifts
        setTimeout(() => {
          if (is_internal) {
            // Internal move: No page reload
            navigate(action_text);
          } else {
            // External move: Open in a new tab
            window.open(action_text, "_blank");
          }
        }, 1500);
      }
    },
  });
};

export const useBotGraph = () => {
  return useQuery({
    queryKey: ["bot-graph"],
    queryFn: () => botService.gerGraph(),
    // Don't refetch on window focus while editing a complex graph
    refetchOnWindowFocus: false,
  });
};

export const useUpdateBotGraph = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => botService.updateGraph(data),
    onSuccess: (data) => {
      // Invalidate the cache so the dashboard/editor stays synced
      queryClient.invalidateQueries(["bot-graph"]);
      console.log("Graph saved successfully:", data.message);
    },
    onError: (error) => {
      // error here will contain your { errors, message, status } object
      console.error("Graph validation failed:", error.message);
    },
  });
};

export const useResetBot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => botService.resetBot(),
    onSuccess: () => {
      queryClient.invalidateQueries(["bot-graph"]);
    },
  });
};

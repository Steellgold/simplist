import type { WebhookMessage, WebhookResponse } from "@/lib/wmd.types";
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const useSendWebhookMessage = (webhookUrl: string): UseMutationResult<WebhookResponse, Error, WebhookMessage> => {
  return useMutation<WebhookResponse, Error, WebhookMessage>({
    mutationFn: async(message: WebhookMessage) => {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        throw new Error(`Error : ${response.statusText}`);
      }

      return {};
    }
  });
};
import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitForm() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      company: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const fullMessage = data.company
        ? `[Company: ${data.company}] ${data.message}`
        : data.message;
      await actor.submitForm(data.name, data.email, fullMessage);
    },
  });
}

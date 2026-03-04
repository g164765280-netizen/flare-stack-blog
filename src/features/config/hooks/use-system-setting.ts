import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateSystemConfigFn } from "@/features/config/config.api";

import { CONFIG_KEYS, systemConfigQuery } from "@/features/config/queries";

export function useSystemSetting() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(systemConfigQuery);

  const saveMutation = useMutation({
    mutationFn: async (input: Parameters<typeof updateSystemConfigFn>[0]) => {
      const result = await updateSystemConfigFn(input);
      if (result.error) {
        const reason = result.error.reason;
        switch (reason) {
          case "UNAUTHENTICATED":
            throw new Error("登录状态已失效，请重新登录");
          case "PERMISSION_DENIED":
            throw new Error("权限不足，仅管理员可操作");
          default: {
            reason satisfies never;
            throw new Error("未知错误");
          }
        }
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONFIG_KEYS.system });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    settings: data,
    isLoading,
    saveSettings: saveMutation.mutateAsync,
  };
}

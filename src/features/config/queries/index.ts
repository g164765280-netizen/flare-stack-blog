import { queryOptions } from "@tanstack/react-query";
import { getSystemConfigFn } from "../config.api";

export const CONFIG_KEYS = {
  all: ["config"] as const,

  // Leaf keys (static arrays - no child queries)
  system: ["config", "system"] as const,
};

export const systemConfigQuery = queryOptions({
  queryKey: CONFIG_KEYS.system,
  queryFn: async () => {
    const result = await getSystemConfigFn();
    if (result.error) {
      const reason = result.error.reason;
      switch (reason) {
        case "UNAUTHENTICATED":
          throw new Error("登录状态已失效，请重新登录");
        case "PERMISSION_DENIED":
          throw new Error("权限不足，仅管理员可查看");
        default: {
          reason satisfies never;
          throw new Error("未知错误");
        }
      }
    }
    return result.data;
  },
});

import { queryOptions } from "@tanstack/react-query";
import { getDashboardStatsFn } from "../dashboard.api";

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  stats: ["dashboard", "stats"] as const,
};

export const dashboardStatsQuery = queryOptions({
  queryKey: DASHBOARD_KEYS.stats,
  queryFn: async () => {
    const result = await getDashboardStatsFn();
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

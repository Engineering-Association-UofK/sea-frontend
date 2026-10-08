import { useQuery } from "@tanstack/react-query";
import { adminService } from "../api/admin.service";

export const useGetAdminAnalysis = () => {
  return useQuery({
    queryKey: ["admin-analysis"],
    queryFn: () => adminService.getAnalysis(),
  });
};

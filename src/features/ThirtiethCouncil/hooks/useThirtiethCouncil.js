import { useQuery } from "@tanstack/react-query";
import { teamService } from "../api/ThirtiethCouncil.service";

export const useTeam = () => {
  return useQuery({
    queryKey: ["team"],
    queryFn: () => teamService.getAll(),
  });
};

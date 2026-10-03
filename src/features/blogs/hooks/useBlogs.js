import { useQuery } from "@tanstack/react-query";
import { blogsService } from "../api/blogs.service";

export const useBlogs = (type, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["cms-blogs", type, page, limit],
    queryFn: () => blogsService.getByType(type, page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

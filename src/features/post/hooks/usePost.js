import { useQuery } from "@tanstack/react-query";
import { postService } from "../api/post.service";

export const usePost = (slug) => {
  return useQuery({
    queryKey: ["cms-blog-post", slug],
    queryFn: () => postService.getBySlug(slug),
    enabled: !!slug, // donot fetch if no slug exists
    staleTime: 5 * 60 * 1000,
  });
};

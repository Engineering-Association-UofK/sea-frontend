import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogsService } from "../api/adminBlogs.service";

const BLOG_KEYS = {
  all: ["blogs"],
  lists: () => [...BLOG_KEYS.all, "list"],
  list: (type, page, limit) => [...BLOG_KEYS.all, { type, page, limit }],
  detail: (id) => [...BLOG_KEYS.all, "detail", id],
};

export const useAdminBlogs = (type, page = 1, limit = 20) => {
  return useQuery({
    queryKey: BLOG_KEYS.list(type, page, limit),
    queryFn: () => blogsService.adminGetAll(type, page, limit),
    staleTime: 0,
    // Keep previous page data visible while the next page loads
    // placeholderData: (prev) => prev,
  });
};

export const useAdminBlog = (id) => {
  return useQuery({
    queryKey: BLOG_KEYS.detail(id),
    queryFn: () => blogsService.adminGetById(id),
    enabled: !!id && id !== "0" && id !== "new",
    staleTime: 0,
  });
};

export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: blogsService.adminCreate,
    onSuccess: () => {
      qc.invalidateQueries(BLOG_KEYS.list());
      qc.invalidateQueries(BLOG_KEYS.lists());
    },
  });
};

export const useUpdatePost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ data }) => blogsService.adminUpdate(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries(BLOG_KEYS.list());
      qc.invalidateQueries(BLOG_KEYS.lists());
      qc.invalidateQueries(BLOG_KEYS.detail(variables.id));
    },
  });
};

export const useDeletePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => blogsService.adminDelete(id),
    onSuccess: () => {
      qc.invalidateQueries(BLOG_KEYS.list());
      qc.invalidateQueries(BLOG_KEYS.lists());
    },
  });
};

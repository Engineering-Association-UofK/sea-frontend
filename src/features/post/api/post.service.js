import cmsApiClient from "../../../api/axiosClient";

const ENDPOINT = "/v1/cms/blogs";

export const postService = {
  getBySlug: (slug) => {
    return cmsApiClient.get(`${ENDPOINT}/${slug}`);
  },
};

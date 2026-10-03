import cmsApiClient from "../../../api/axiosClient";

const ENDPOINT = "/v1/cms/blogs";

export const blogsService = {
  // allowed types are: ['NEWS', 'BLOG', 'ISSUES', 'DONATIONS']
  getByType: (type, page = 1, limit = 10) => {
    return cmsApiClient.get(ENDPOINT, {
      params: { type, page, limit },
    });
  },
};

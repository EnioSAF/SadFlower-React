const normalizeMedia = (media) => {
  if (!media || media.data) {
    return media;
  }

  return { data: { attributes: media.attributes || media } };
};

const normalizeBlog = (blog) => {
  if (!blog || blog.attributes) {
    return blog;
  }

  const { id, ...attributes } = blog;

  return {
    id,
    attributes: {
      ...attributes,
      FeaturedImage: normalizeMedia(attributes.FeaturedImage),
      Thumbnail: normalizeMedia(attributes.Thumbnail),
    },
  };
};

const fetchBlogs = async (params) => {
  const request = await fetch(
    `/api/blogs?${params}`,
  );
  const response = await request.json();

  return {
    ...response,
    data: response.data?.map(normalizeBlog) || [],
  };
};

export default fetchBlogs;

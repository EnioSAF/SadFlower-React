const fetchBlogs = async (params) => {
  const request = await fetch(
    `/api/blogs?${params}`,
  );
  const response = await request.json();

  return response;
};

export default fetchBlogs;

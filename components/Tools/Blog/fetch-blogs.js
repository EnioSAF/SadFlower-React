import config from "@/src/config";

const fetchBlogs = async (params) => {
  const reqOptions = {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_KEY}`,
    },
  };
  const request = await fetch(
    `${config.api}/api/blogs?populate=*&${params}`,
    reqOptions,
  );
  const response = await request.json();

  return response;
};

export default fetchBlogs;

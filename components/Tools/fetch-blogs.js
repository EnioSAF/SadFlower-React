import config from "@/src/config";

const fetchBlogs = async (params) => {
	const reqOptions = {
		headers: {
			Authorization: `Bearer ${process.env.STRAPI_KEY}`
		}
	};

	console.log("URL: ", `${config.api}/api/blogs?populate=*&${params}`);
	console.log("Headers: ", reqOptions.headers);
	console.log("API Key: ", process.env.STRAPI_KEY);

	const request = await fetch(
		`${config.api}/api/blogs?populate=*&${params}`,
		reqOptions
	);
	const response = await request.json();

	return response;
};

export default fetchBlogs;

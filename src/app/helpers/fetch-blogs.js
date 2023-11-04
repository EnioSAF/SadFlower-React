import config from "@/src/config";

const fetchBlogs = async (params) => {
	const reqOptions = {
		headers: {
			Authorization: "Bearer 3448402fe5181f4cb89d4c18900f359bc6faf3f10a3dd827ca59c9b32e4bf29963a5227d55df8148872ddacc7148228de5b4cf1c10ea9f6307e636c6aed9d838367229aed4ae0b01ebc023697e5d74f127c88d144787c6411553eb4ce075b890e63cddc9afca88dfe997d20f327230daa4be1f513d533de46d7fb1c38cf12dde"
		}
	};

	const request = await fetch(
		`${config.api}/api/blogs?populate=*&${params}`,
		reqOptions
	);
	console.log(reqOptions)
	const response = await request.json();

	return response;
};

export default fetchBlogs;

import config from "@/src/config";

const fetchBlogs = async (params) => {
	const reqOptions = {
		headers: {
			Authorization: "Bearer a1bcbc3e3239e46a4fb9438cfe13e25bb190068208385605da52d66f4c52b8ce745cdb2a8a90dab7e3cc908abccf8a62d8d1b5eb4e0e0f38e9684c5a1477d14db83fac63c591dd818432b9f0a02c429801cd214ee1d6fcd886919c8e389dfb8ec35812f34fccb5426ac072d659c56930eb80c07e9b429aaebf65e6a97e918399"
		}
	};

	const request = await fetch(
		`${config.api}/api/blogs?populate=*&${params}`,
		reqOptions
	);
	const response = await request.json();

	return response;
};

export default fetchBlogs;

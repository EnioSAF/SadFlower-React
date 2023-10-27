    import Card from '@/components/card/card';
    import {IconTypes} from '@/components/button/button';
    import config from '../config';

    const fetchBlogs = async (params) => {
        const reqOptions = {
            headers: {
                Authorization: `Bearer ${process.env.API_TOKEN}`
            }
        };

        const request = await fetch(`${config.api}/api/blogs?populate=*&${params}`, reqOptions)
        const response = await request.json();

        return response;
    }

    const Home = async () => {
        const [featuredBlogs, blogs] = await Promise.all([
            await fetchBlogs('filters[IsFeatured][$eq]=true'),
            await fetchBlogs('filters[IsFeatured][$eq]=false')
        ]);

        return (
        <div className="container pb-80">
            {featuredBlogs.data.map(featuredBlog => (
            <Card
                key={featuredBlog.attributes.id}
                label={featuredBlog.attributes.Category}
                title={featuredBlog.attributes.Title}
                summary={featuredBlog.attributes.Summary}
                href={`/${featuredBlog.attributes.slug}`}
                imgSrc={`${config.api}${featuredBlog.attributes.FeaturedImage.data.attributes.url}`}
                imgAlt="Featured Image"
                btnIcon={IconTypes.ARROW_RIGHT}
                className="mb-30"
            />  
            ))}

        <div className="row">
          {blogs.data.map(blog => (
            <div className="col col_4 m-mw-100" key={blog.attributes.id}>
        <Card 
                label={blog.attributes.Category}
                title={blog.attributes.Title}
                summary={blog.attributes.Summary}
                href={`/${blog.attributes.slug}`}
                imgSrc={`${config.api}${blog.attributes.Thumbnail.data.attributes.url}`}
                imgAlt="Featured Image"
                btnIcon={IconTypes.ARROW_RIGHT}
                className="mb-30"
            />
            </div>
          ))}
        </div>
    </div>
            );
    }

    export default Home;
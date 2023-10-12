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

        console.log('featuredBlogs.data', featuredBlogs.data);

        return (
        <div className="container pb-80">
            {featuredBlogs.data.map(featuredBlog => (
            <Card 
                label={featuredBlog.attributes.Category}
                title={featuredBlog.attributes.Title}
                summary={featuredBlog.attributes.Summary}
                href={`/${featuredBlog.attributes.slug}`}
                imgSrc={`${config.api}/uploads/${featuredBlog.attributes.FeaturedImage.data.attributes.url}`}
                imgAlt="Featured Image"
                btnIcon={IconTypes.ARROW_RIGHT}
                className="mb-30"
            />  
            ))}


        <div className="row">
            <div className="col col_4 m-mw-100">
        <Card 
            label="Art"
            title="Enio and the Gang"
            summary="Purus in mollis nunc sed id semper risus in hendrerit. Odio euismod lacinia at quis risus sed vulputate odio. Consectetur adipiscing elit pellentesque habitant."
            href="#"
            btnIcon={IconTypes.ARROW_RIGHT}
            className="mb-30"
        />
            </div>
            <div className="col col_4 m-mw-100">
        <Card 
            label="Music"
            title="Enio and the Gang"
            summary="Purus in mollis nunc sed id semper risus in hendrerit. Odio euismod lacinia at quis risus sed vulputate odio. Consectetur adipiscing elit pellentesque habitant."
            href="#"
            btnIcon={IconTypes.ARROW_RIGHT}
            className="mb-30"
        />
            </div>
            <div className="col col_4 m-mw-100">
        <Card 
            label="Digital"
            title="Enio and the Gang"
            summary="Purus in mollis nunc sed id semper risus in hendrerit. Odio euismod lacinia at quis risus sed vulputate odio. Consectetur adipiscing elit pellentesque habitant."
            href="#"
            btnIcon={IconTypes.ARROW_RIGHT}
            className="mb-30"
        />
            </div>
        </div>
    </div>
            );
    }

    export default Home;
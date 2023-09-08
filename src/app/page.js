import Card from '@/components/card/card';
import {IconTypes} from '@/components/button/button';

const Home = () => (
<div className="container pb-80">
    <Card 
        label="LifeStyle"
        title="Enio and the Gang"
        summary="Purus in mollis nunc sed id semper risus in hendrerit. Odio euismod lacinia at quis risus sed vulputate odio. Consectetur adipiscing elit pellentesque habitant."
        href="#"
        btnIcon={IconTypes.ARROW_RIGHT}
        className="mb-30"
    />
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

export default Home;
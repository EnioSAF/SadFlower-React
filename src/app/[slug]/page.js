import Image from "next/image";
import GetCategoryColor from "../helpers/get-category-color";
import styles from './style.module.sass';

const BlogDetails = () => (
<div className="container pb-80">
    <div className="row mb-50">
        <div className="col col_9">
        <div className={`h6 mb-20 c-${GetCategoryColor('LifeStyle')}`}>{'LifeStyle'}</div>
    <h2>Lorem Ipsum Dolor Blabla Le Latin</h2>
        </div>
    </div>
   
    <Image className={`${styles.stylepourdetails} mb-50`} src="/8.jpg" alt="6" width="1050" height="387" />
   
   <div className="row">
        <div className="col col_9">
        <p>Bacon ipsum dolor amet enim jerky non laborum. Kevin lorem filet mignon tenderloin. Buffalo officia ipsum frankfurter dolor cillum venison jowl. Alcatra tempor aliqua hamburger, excepteur kevin in t-bone occaecat meatloaf ad. Ullamco chicken dolor exercitation pig, buffalo sunt.</p>
        <p>Velit venison deserunt burgdoggen swine chislic nisi irure elit turducken pariatur sed pastrami labore. Ut eiusmod turkey ad picanha consectetur. Velit pig buffalo, sausage pork belly bresaola chicken esse. Nostrud ea kevin ipsum, elit fugiat in eu prosciutto dolore pork chop sunt. Porchetta drumstick elit incididunt shoulder filet mignon hamburger ipsum flank frankfurter ball tip sausage alcatra. Shoulder frankfurter aute ut, sunt quis porchetta boudin swine chuck. Tri-tip aliqua proident, deserunt sirloin tenderloin ball tip short ribs andouille culpa magna salami.</p>
        <p>Sirloin elit tempor, adipisicing chuck tongue dolore mollit commodo. Boudin pastrami shoulder kevin chuck picanha. Leberkas labore nostrud jerky elit. Chicken irure sirloin culpa spare ribs, in cupim. Beef tongue brisket excepteur rump bresaola. In short ribs strip steak venison. Mollit pork belly irure nostrud quis sausage duis consectetur.</p>
        </div>
    </div>
</div>
);
export default BlogDetails;
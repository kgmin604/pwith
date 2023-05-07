import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./main.css";

function SimpleSlider() {
    const settings = {
        dots: true,
        arrow: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000
    };
    return (    
      <div>
        <Slider {...settings}>
          <div className="ad-img3"></div>
          <div className="ad-img2"></div>
          <div className="ad-img1"></div>
        </Slider>
      </div>
    );
  }
export default SimpleSlider
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.css';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { LstCategories } from '../interface/ListCategories';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { convertToSlug } from '../utils/convertToSlug';
interface ArrowProps {
    onClick: () => void;
}
const SlickCarousel = ({ slides }: { slides: LstCategories[] }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleClick2 = (slug: string, title: string, id: string) => {
        if (slug === "clinics") {
            navigate(`co-so-y-te/${convertToSlug(t(title))}`, { state: { slug, id } });
        } else {
            navigate(`dich-vu-y-te/${convertToSlug(t(slug))}/${convertToSlug(t(title))}`, { state: { slug, id } });
        }
    };

    const handleLinkClick = (descriptionHtml: string | undefined, cateCode: string | undefined, title: string | undefined, id: string | undefined) => {
        if (descriptionHtml) {
            if (cateCode === "doctor") {
                navigate(`/bac-si/${convertToSlug(t(title || ''))}`, { state: { id } });
            } else if (cateCode === "service") {
                navigate(`/dich-vu/${convertToSlug(t(title || ''))}`, { state: { id } });
            }
        } else {
            // Nếu descriptionHtml không có dữ liệu, gọi hàm handleClick2 để chuyển trang
            handleClick2(cateCode || '', title || '', id || '');
        }
    };

    const PrevArrow = (props: Partial<ArrowProps>) => {
        const { onClick } = props;
        return (
            <button className="slick-prev" onClick={onClick}>
                <AiOutlineLeft />
            </button>
        );
    };

    const NextArrow = (props: Partial<ArrowProps>) => {
        const { onClick } = props;
        return (
            <button className="slick-next" onClick={onClick}>
                <AiOutlineRight />
            </button>
        );
    };
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />
    };

    return (
        <Slider {...settings}>
            {slides.map((slide, index) => (
                <button onClick={() => handleLinkClick(slide.descriptionHtml, slide.cateCode, slide.name, slide.id)} key={index} className='border-2 border-gray-200 p-5 rounded-2xl w-96 h-96'>
                    <img src={slide.imageUrl} alt={`Image ${index}`} className='rounded-lg object-cover object-top w-80 h-52 blur-0' />
                    <h3 className="font-semibold text-lg text-gray-800 mt-3 line-clamp-2">{slide.name}</h3>
                    <p className='text-center my-2'>{slide.descriptionHtml}</p>
                </button>
            ))}
        </Slider>
    );
};

export default SlickCarousel;

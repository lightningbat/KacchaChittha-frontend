import './style.scss';
import error_page_img from '../../assets/media/404_page-not-found.png';

export default function ErrorPage() {
    return (
        <div className="error-page">
            <img src={error_page_img} alt="404 page not found" className='error-page-img' />
        </div>
    )
}
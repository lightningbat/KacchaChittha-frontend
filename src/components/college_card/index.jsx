import './style.scss';
import PropTypes from 'prop-types';

CollegeCard.propTypes = {
    img: PropTypes.string,
    name: PropTypes.string
}
export default function CollegeCard({ img, name }) {
    return (
        <div className="college-card-global">
            <div className="img-container">
                {img && <img className="college-img" src={img} alt="" />}
            </div>
            <h3 className="college-name">{name ? name : "College Name"}</h3>
        </div>
    )
}
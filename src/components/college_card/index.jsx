import './style.scss';
import PropTypes from 'prop-types';

CollegeCard.propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func
}
export default function CollegeCard({ icon, name, onClick }) {
    return (
        <div className="college-card-global" onClick={onClick}>
            <div className="img-container">
                {icon && <img className="college-img" src={icon} alt="" />}
            </div>
            <h3 className="college-name">{name ? name : "College Name"}</h3>
        </div>
    )
}
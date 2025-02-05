import './style.scss'
import PropTypes from 'prop-types'

Spinner.propTypes = {
    scale: PropTypes.number
}
/**
 * 
 * @param {number} scale size/scale of the spinner
 * @returns {JSX.Element} spinner
 */
export default function Spinner({scale = 1}) {
    const defaultScale = 50 * scale
    return (
        <div className="loading-animation spinner" style={{
            fontSize: `${defaultScale}px`,
        }}/>
    )
}
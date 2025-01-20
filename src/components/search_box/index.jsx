/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import './style.scss'
import { forwardRef } from 'react'

/**
 * @param {Object} props - contains {placeholder, pattern, disabled}
 * @param {string} props.placeholder - placeholder of the input
 * @param {string} props.pattern - pattern for the input
 * @param {boolean} props.disabled - disabled state of the input
 */
const SearchBox = forwardRef((props, ref) => {
    return (
        <div className="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            <input ref={ref} type="text" placeholder={props.placeholder || "Search"} pattern={props.pattern} disabled={props.disabled} />
        </div>
    )
})

export default SearchBox
import './style.scss'
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';
import { SearchBox } from '../../components';
import { college_departments_cache } from '../../utils/cache';
import { useNavigate } from 'react-router-dom';
import { ResizingBars } from '../../custom/loading_animations';

// if user directly goes to this page
// than college name will be cached (since it is done in CollegesListPage)
const colleges_name_cache = {} // Format: { college_id: name }

export default function DepartmentsPage() {
    const { id: college_id } = useParams();
    const navigate = useNavigate();
    const [collegeName, setCollegeName] = useState(null);
    const [departments, setDepartments] = useState(null);
    const search_box_ref = useRef(null);
    const [showSearchBox, setShowSearchBox] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    // fetching data
    useEffect(() => {
        (async () => {
            // checking if departments data is already cached
            if (college_departments_cache.has(college_id)) {
                // getting college name from colleges_name_cache
                const college_name = colleges_name_cache[college_id];
                setCollegeName(college_name);
                setDepartments(college_departments_cache.get(college_id));

                if (college_departments_cache.get(college_id).length > 1) setShowSearchBox(true);
                return;
            }
            setLoadingData(true); // showing loading animation
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-departments/${college_id}`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json(); // Format: [{ name, departments }]
                    let departments = data.departments;
                    // sorting departments by name
                    departments.sort((a, b) => a.name.localeCompare(b.name));
                    setCollegeName(data.name);
                    setDepartments(departments);

                    // adding college name to colleges_name_cache
                    colleges_name_cache[college_id] = data.name;
                    // showing search box if more than 1 department
                    if (data.departments.length > 1) setShowSearchBox(true);
                    // adding new data to cached data
                    if (!college_departments_cache.has(college_id)) {
                        college_departments_cache.set(college_id, data.departments);
                    }
                }
                else {
                    setCollegeName(null);
                    setDepartments([]);
                }
            } catch (error) {
                console.error(error);
                setCollegeName(null);
                setDepartments([]);
            }
            finally {
                setLoadingData(false); // hiding loading animation
            }
        })()
    }, []);

    // search box functions
    useEffect(() => {
        const search_box = search_box_ref.current;

        if (!search_box) return;

        const handleInputChange = () => {
            const user_input = search_box.value.trim();
            const new_departments = college_departments_cache.get(college_id).filter((department) => department.name.toLowerCase().includes(user_input.toLowerCase()));
            setDepartments(new_departments);
        };
        search_box.addEventListener('input', handleInputChange);

        return () => {
            search_box.removeEventListener('input', handleInputChange);
        };

        // since search box is not rendered on initial render (making it null)
        // and since collegeName is updated after fetching data
        // we need to update the search box when collegeName is updated
    }, [collegeName]);


    return (
        <div className="departments-page">
            <h3 className='page-heading'>Departments</h3>
            {!loadingData && <h4 className={`college-name ${!collegeName ? "unknown" : ""}`}>{collegeName || "Unavailable"}</h4>}

            {showSearchBox &&
                <div className='search-box-cont'><SearchBox placeholder="Search Departments" ref={search_box_ref} /></div>
            }

            {!loadingData && <div className="list-container">
                {departments != null && departments.map((department, index) => (
                    <div className="list-item" onClick={() => navigate(`/college/${college_id}/${department.name}/professors`)} key={index}>
                        {department?.icon && <img src={department.icon} alt="" />}
                        {department.name}
                    </div>
                ))}
                {departments != null && departments.length === 0 && (search_box_ref.current?.value == "" || search_box_ref.current == null) &&
                    <div className="empty-list-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="icon" viewBox="0 0 16 16">
                            <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z" />
                        </svg>
                        <p className="label">No Departments Available</p>
                    </div>
                }
            </div>}
            {loadingData && <div className="loading-animation-container"><ResizingBars /></div>}
        </div>
    )
}
import './style.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { college_professors_cache } from '../../utils/cache';
import { ProfessorCard, SearchBox } from '../../components';
import { ResizingBars } from '../../custom/loading_animations';

const college_name_cache = {}; // Format: { college_id: name }

export default function CollegeProfessorsPage() {
    const { id: college_id, department } = useParams();
    const navigate = useNavigate();
    const [collegeName, setCollegeName] = useState("Loading...")
    const [professorsList, setProfessorsList] = useState([]);
    const search_box_ref = useRef(null);
    const [loadingData, setLoadingData] = useState(false);

    // fetching data
    useEffect(() => {
        (async ()=> {
            try {
                if (college_professors_cache.has(`${college_id} + ${department}`)) {
                    setCollegeName(college_name_cache[college_id]);
                    setProfessorsList(college_professors_cache.get(`${college_id} + ${department}`));
                    return;
                }
                setLoadingData(true); // showing loading animation
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-college-prof/${college_id}/${department}`, {
                    method: 'GET',
                });
                if (response.status === 200) {
                    const data = await response.json();

                    // Storing data in cache
                    const all_professors = [];
                    data.professors.forEach((professor) => {
                        all_professors.push({
                            name: `${professor.first_name} ${professor.last_name}`,
                            image: professor.image,
                            rating: professor.rating,
                            prof_id: professor.prof_id
                        })
                    })
                    college_professors_cache.set(`${college_id} + ${department}`, all_professors);

                    college_name_cache[college_id] = data.college_name;
                    
                    // Setting state to show data
                    setCollegeName(data.college_name)
                    setProfessorsList(college_professors_cache.get(`${college_id} + ${department}`));
                }
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoadingData(false);
            }
        })()
    }, [])

    useEffect(() => {
        const search_box = search_box_ref.current;

        const handleInputChange = () => {
            const user_input = search_box.value.trim();
            const new_professors_list = college_professors_cache.get(`${college_id} + ${department}`).filter((professor) => 
                professor.name.toLowerCase().includes(user_input.toLowerCase()));
            setProfessorsList(new_professors_list);
        }

        search_box.addEventListener('input', handleInputChange);

        return () => search_box.removeEventListener('input', handleInputChange);

    }, [])

    return (
        <div className="college-professor-page">
            <h3 className='page-heading'>Professors at {`${collegeName}`}</h3>
            <h4 className='department-name'>{department}</h4>
            <div className="search-box-cont"><SearchBox placeholder="Search professors" ref={search_box_ref} /></div>
            {!loadingData && <div className="list-container">
                {professorsList.map((professor) => (
                    <div onClick={() => navigate(`/professor/${professor.prof_id}`)} className="list-item" key={professor.prof_id}><ProfessorCard {...professor} /></div>
                ))}
            </div>}
            {loadingData && <div className="loading-animation-container"><ResizingBars /></div>}
        </div>
    )
}
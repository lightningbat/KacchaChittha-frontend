import './style.scss'
import { SearchBox, ProfessorCard } from '../../components'
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { professors_list_cache } from '../../utils/cache';
import useCustomDialog from '../../custom/dialogs';

export default function ProfessorsListPage() {
    const customDialogs = useCustomDialog();
    const navigate = useNavigate();
    const [professors, setProfessors] = useState([]);
    const search_box_ref = useRef(null);
    const [searchMsg, setSearchMsg] = useState("");

    async function fetchWrapper(url, options) {
        try {
            const response = await fetch(url, options);
            return response;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    // fetching data
    useEffect(() => {
        (async () => {
            if (professors_list_cache.length) {
                setProfessors(professors_list_cache);
                return;
            }
            const response = await fetchWrapper(`${import.meta.env.VITE_SERVER_URL}/get-professors`, {
                method: 'GET',
            });
            if (response.status === 200) {
                const response_data = await response.json();

                // Storing professors list in cache
                // 1st clearing the cache to avoid duplicates
                professors_list_cache.length = 0;
                // 2nd adding the new professors list
                response_data.forEach((professor) => professors_list_cache.push({
                    prof_id: professor.prof_id,
                    name: `${professor.first_name} ${professor.last_name}`,
                    image: professor.image,
                    rating: professor.rating,
                    college_name: professor.college_name
                }));

                setProfessors(professors_list_cache);
            }
        })()
    }, [])

    useEffect(() => {
        const search_box = search_box_ref.current;

        const handleInputChange = (event) => {
            // removing all non-alphabets and non-spaces
            event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, '');
            // trimming spaces
            const user_input = (event.target.value).trim();
            if (user_input == "") setSearchMsg("");

            const search_result = professors_list_cache.filter((item) => item.name.toLowerCase().includes(user_input.toLowerCase()));
            if (search_result.length && user_input != "") {
                setSearchMsg("Hit Enter to look in the Database");
            }
            setProfessors(search_result);
        }

        const handleInputSearch = async (event) => {
            if (event.key === "Enter") {
                event.target.blur(); // removing focus from search box
                const user_input = event.target.value.trim().toLowerCase();
                event.target.disabled = true; // disabling search box to prevent spamming
                setSearchMsg("Searching...");
                setProfessors([]); // clearing colleges list for a fell of item being searched

                const response = await fetchWrapper(`${import.meta.env.VITE_SERVER_URL}/find-professor`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user_query: user_input })
                })

                event.target.disabled = false; // enabling search box

                if (response.ok) {
                    const response_data = await response.json();
                    const data = response_data.map((item) => {
                        return {
                            prof_id: item.prof_id,
                            name: `${item.first_name} ${item.last_name}`,
                            image: item.image,
                            rating: item.rating,
                            college_name: item.college_name
                        }
                    });

                    setProfessors(data);
                    setSearchMsg(`Found ${data.length} results for "${user_input}"`);

                    // adding new data to cached data (if not present)
                    if (data.length) {
                        data.forEach((item) => {
                            if (!professors_list_cache.find((cached_item) => cached_item.prof_id === item.id)) {
                                professors_list_cache.push(item);
                            }
                        })
                    }
                } else {
                    customDialogs({
                        type: "alert",
                        title: "Error",
                        description: "Failed to get colleges list"
                    })
                }
            }
        }

        search_box.addEventListener('input', handleInputChange);
        search_box.addEventListener('keydown', handleInputSearch);

        return () => {
            search_box.removeEventListener('input', handleInputChange);
            search_box.removeEventListener('keydown', handleInputSearch);
        }
    }, [])

    return (
        <div className="professor-page">
            <h3 className='page-heading'>Know Your Professors</h3>
            <div className='search-box-cont'>
                <SearchBox placeholder="Search Colleges" pattern="^[a-zA-Z ]+$" ref={search_box_ref} />
                <div className="search-msg">{searchMsg}</div>
            </div>
            <div className="list-container">
                {professors.map((professor) => (
                    <div className="list-item" key={professor.prof_id}><ProfessorCard {...professor} /></div>
                ))}
            </div>
        </div>
    )
}
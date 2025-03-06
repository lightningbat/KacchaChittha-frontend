import './style.scss'
import { SearchBox, ProfessorCard } from '../../components'
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { professors_list_cache } from '../../utils/cache';
import useCustomDialog from '../../custom/dialogs';
import { ResizingBars } from '../../custom/loading_animations';

const card_bg_clrs = ["rgb(204, 235, 233)", "rgb(204, 235, 206)", "rgb(204, 223, 235)", "rgb(235, 204, 234)", "rgb(235, 204, 204)"];
// randomly sorting clrs
card_bg_clrs.sort(() => Math.random() - 0.5);

export default function ProfessorsListPage() {
    const customDialogs = useCustomDialog();
    const navigate = useNavigate();
    const [professors, setProfessors] = useState([]);
    const search_box_ref = useRef(null);
    const [searchMsg, setSearchMsg] = useState("");
    const [loadingData, setLoadingData] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

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
            setLoadingData(true); // showing loading animation
            try {
                const response = await fetchWrapper(`${import.meta.env.VITE_SERVER_URL}/get-professors`, {
                    method: 'GET',
                });
                if (response.status === 200) {
                    const response_data = await response.json();

                    // Storing professors list in cache
                    // 1st clearing the cache to avoid duplicates
                    professors_list_cache.length = 0;
                    // 2nd adding the new professors list
                    response_data.forEach((professor) => professors_list_cache.push(professor));

                    setProfessors(professors_list_cache);
                }
                else {
                    customDialogs({
                        type: 'alert',
                        description: "Failed to fetch professors list",
                    })
                }
            } catch (error) {
                console.error(error);
                customDialogs({
                    type: 'alert',
                    description: "An error occurred while fetching professors list",
                })
            } finally {
                setLoadingData(false);
            }
        })()
    }, [])

    // search box event handlers
    useEffect(() => {
        const search_box = search_box_ref.current;

        const handleInputChange = (event) => {
            // removing all non-alphabets and non-spaces
            event.target.value = event.target.value.replace(/[^a-zA-Z. ]/g, '');
            // trimming spaces
            const user_input = (event.target.value).trim();
            if (user_input == "") setSearchMsg("");

            const search_result = professors_list_cache.filter((item) => item.name.toLowerCase().includes(user_input.toLowerCase()));
            if (user_input != "") {
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

                    setProfessors(response_data);
                    setSearchMsg(`Found ${response_data.length} results for "${user_input}"`);

                    // adding new data to cached data (if not present)
                    if (response_data.length) {
                        response_data.forEach((item) => {
                            if (!professors_list_cache.find((cached_item) => cached_item.prof_id === item.prof_id)) {
                                professors_list_cache.push(item);
                            }
                        })
                    }
                } else {
                    customDialogs({
                        type: "alert",
                        title: "Error",
                        description: "Failed to find professor(s)",
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

    async function handleLoadMore() {
        setLoadingMore(true);
        let new_professors_added = 0;
        try {
            const response = await fetchWrapper(`${import.meta.env.VITE_SERVER_URL}/get-professors`, {
                method: 'GET',
            });
            if (response.ok) {
                const response_data = await response.json();
                // Storing professors list in cache
                // adding only the professors not already present
                response_data.forEach((professor) => {
                    if (!professors_list_cache.find((cached_item) => cached_item.prof_id === professor.prof_id)) {
                        professors_list_cache.push(professor);
                        new_professors_added++;
                    }
                })
                setProfessors(professors_list_cache);
            }
            else {
                customDialogs({
                    type: 'alert',
                    description: "Failed to fetch professors list",
                })
            }
        } catch (error) {
            console.error(error);
            customDialogs({
                type: 'alert',
                description: "An error occurred while fetching professors list",
            })
        } finally {
            setLoadingMore(false);
            if (new_professors_added == 0) {
                customDialogs({
                    type: 'alert',
                    description: "No more professors to load",
                })
            }
        }
    }

    return (
        <div className="professor-page">
            <h3 className='page-heading'>Know Your Professors</h3>
            <div className='search-box-cont'>
                <SearchBox placeholder="Search Colleges" pattern="^[a-zA-Z ]+$" ref={search_box_ref} />
                <div className="search-msg">{searchMsg}</div>
            </div>
            {!loadingData && <div className="list-container">
                {professors.map((professor, index) => (
                    <ProfessorCard onClick={() => navigate(`/professor/${professor.prof_id}`)} key={professor.prof_id} random_color={card_bg_clrs[index % card_bg_clrs.length]} {...professor} />
                ))}
            </div>}
            {(!loadingData && professors.length > 0 && search_box_ref.current.value == "") && <>{!loadingMore ?
                <button className="load-more-btn" onClick={handleLoadMore}>Load More</button>
                :
                <div className="loading-animation-container"><ResizingBars /></div>}
            </>}
            {loadingData && <div className="loading-animation-container"><ResizingBars /></div>}
        </div>
    )
}
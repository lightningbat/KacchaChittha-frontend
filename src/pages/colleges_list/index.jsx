import './style.scss'
import { SearchBox, CollegeCard } from '../../components'
import { useEffect, useRef, useState } from 'react'
import useCustomDialog from '../../custom/dialogs';
import { useNavigate } from 'react-router-dom';
import { colleges_list_cache } from '../../utils/cache';
import { ResizingBars } from '../../custom/loading_animations';

export default function CollegesListPage() {
    const navigate = useNavigate();
    const customDialogs = useCustomDialog();
    const [collegesList, setCollegesList] = useState([]);
    const search_box_ref = useRef();
    const [searchMsg, setSearchMsg] = useState("");
    const [loadingData, setLoadingData] = useState(false);

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

    // startup functions
    useEffect(() => {

        // getting colleges list
        (async () => {
            if (colleges_list_cache.length && !collegesList.length) {
                setCollegesList(colleges_list_cache);
                return;
            }
            setLoadingData(true); // showing loading animation
            // getting colleges list from api
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-colleges`, {
                    method: "GET"
                })

                if (response.ok) {
                    const data = await response.json();
                    setCollegesList(data);
                    // emptying cached data
                    colleges_list_cache.length = 0;
                    // sorting data by name
                    data.sort((a, b) => a.name.localeCompare(b.name));
                    // adding new data to cached data
                    colleges_list_cache.push(...data);
                } else {
                    customDialogs({
                        type: "alert",
                        title: "Error",
                        description: "Failed to get colleges list"
                    });
                    const response_format = response.headers.get("Content-Type").includes("application/json") ? "json" : "text";

                    const error = response_format === "json" ? await response.json() : await response.text();
                    console.error(error);
                }
            }
            catch (error) {
                customDialogs({
                    type: "alert",
                    title: "Error",
                    description: "Error while getting colleges list"
                });
                console.error(error);
            }
            finally {
                setLoadingData(false);
            }
        })()

        /********* search box functions ***********/
        const handleInputChange = (event) => {
            // removing all non-alphabets and non-spaces
            event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, '');
            // trimming spaces
            const user_input = (event.target.value).trim();
            
            if (user_input == "") setSearchMsg("");

            const search_result = colleges_list_cache.filter((item) => item.name.toLowerCase().includes(user_input.toLowerCase()));
            if (search_result.length && user_input != "") {
                setSearchMsg("Hit Enter to look in the Database");
            }
            setCollegesList(search_result);
        }

        const handleInputSearch = async (event) => {
            if (event.key === "Enter") {
                event.target.blur(); // removing focus from search box
                const user_input = event.target.value.trim();
                event.target.disabled = true; // disabling search box to prevent spamming
                setSearchMsg("Searching...");
                setCollegesList([]); // clearing colleges list for a fell of item being searched

                const response = await fetchWrapper(`${import.meta.env.VITE_SERVER_URL}/find-college`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user_query: user_input })
                })

                event.target.disabled = false; // enabling search box

                if (response.ok) {
                    const data = await response.json();
                    setCollegesList(data);
                    setSearchMsg(`Found ${data.length} results for "${user_input}"`);

                    // adding new data to cached data (if not present)
                    if (data.length) {
                        data.forEach((item) => {
                            if (!colleges_list_cache.find((cached_item) => cached_item.id === item.id)) {
                                colleges_list_cache.push(item);
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

        const search_box = search_box_ref.current;
        search_box.addEventListener("input", handleInputChange);
        search_box.addEventListener("keydown", handleInputSearch);

        return () => {
            search_box.removeEventListener("input", handleInputChange);
            search_box.removeEventListener("keydown", handleInputSearch);
        }
    }, [])
    
    return (
        <div className="colleges-page">
            <h3 className='page-heading'>Look for your college</h3>
            <div className='search-box-cont'>
                <SearchBox placeholder="Search Colleges" pattern="^[a-zA-Z ]+$" ref={search_box_ref} />
                <div className="search-msg">{searchMsg}</div>
            </div>
            {!loadingData && <div className="list-container">
                {
                    collegesList.map((item) => (
                        <CollegeCard key={item.id} {...item} onClick={() => navigate(`/college/${item.id}/departments`)} />
                    ))
                }
            </div>}
            {loadingData && <div className="loading-animation-container"><ResizingBars /></div>}
        </div>
    )
}
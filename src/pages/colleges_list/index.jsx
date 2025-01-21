import './style.scss'
import { SearchBox, CollegeCard } from '../../components'
import { useEffect, useRef, useState } from 'react'
import useCustomDialog from '../../custom/dialogs';
import { useNavigate } from 'react-router-dom';

let cached_data = [];

export default function CollegesListPage() {
    const navigate = useNavigate();
    const customDialogs = useCustomDialog();
    const [collegesList, setCollegesList] = useState([]);
    const search_box_ref = useRef();
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

    // startup functions
    useEffect(() => {

        // getting colleges list
        (async () => {
            if (cached_data.length && !collegesList.length) {
                setCollegesList(cached_data);
                return;
            }
            // getting colleges list from api
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/get-colleges`, {
                    method: "GET"
                })

                if (response.ok) {
                    const data = await response.json();
                    setCollegesList(data);
                    cached_data = data;
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
        })()

        /********* search box functions ***********/
        const handleInputChange = (event) => {
            // removing all non-alphabets and non-spaces
            event.target.value = event.target.value.replace(/[^a-zA-Z ]/g, '');
            // trimming spaces
            const user_input = (event.target.value).trim();
            
            if (user_input == "") setSearchMsg("");

            const search_result = cached_data.filter((item) => item.name.toLowerCase().includes(user_input.toLowerCase()));
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
                            if (!cached_data.find((cached_item) => cached_item.id === item.id)) {
                                cached_data.push(item);
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
            <div className="list-container">
                {
                    collegesList.map((item) => (
                        <CollegeCard name={item.name} img={item.img} key={item.id} onClick={() => navigate(`/college/${item.id}/departments`)} />
                    ))
                }
            </div>
        </div>
    )
}
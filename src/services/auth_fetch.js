const server_url = import.meta.env.VITE_SERVER_URL;

/**
 * 
 * @param {string} route route name
 * @param {object} payload json payload
 * @param {string} method request method
 * @param {boolean} include_credentials whether to include cookies
 * @returns 
 */
export default async function authFetch({route, payload = null, method = "POST"}) {
    try {
        const response = await fetch(`${server_url}/${route}`, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: payload ? JSON.stringify(payload) : null,
            credentials: "include"
        });

        const response_code = response.status;
        const response_type = (response.headers.get("Content-Type")).includes("application/json") ? "json" : "text";

        let response_data = null;
        if (response_type === "json") {
            response_data = await response.json();
        }
        else {
            response_data = await response.text();
        }

        return {
            code: response_code,
            type: response_type,
            data: response_data
        };
    }
    catch (error) {
        console.error(error);
        return {
            code: 500,
            type: "text",
            data: "Failed to connect to server"
        }
    }
}
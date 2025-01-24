const user_details_cache = new Map(); // Format: { id, name, email } + { college_name, college_id, college_departments }
const colleges_list_cache = []; // Format: [{ id, name, icon }, ...]
const professors_list_cache = [];
const college_departments_cache = new Map(); // Format: { college_id: [department1, department2, ...] }
const college_professors_cache = new Map();
const professors_review_cache = new Map();

export {
    user_details_cache,
    colleges_list_cache,
    professors_list_cache,
    college_departments_cache,
    college_professors_cache,
    professors_review_cache,
}
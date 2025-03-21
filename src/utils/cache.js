const user_details_cache = new Map(); // Format: { id, name, email } + { college_name, college_id, college_departments }
const colleges_list_cache = []; // Format: [{ id, name, icon }, ...]
const professors_list_cache = []; // Format: [{ prof_id, name, image, rating, college_name }, ...]
const college_departments_cache = new Map(); // Format: { college_id: [department1, department2, ...] }
const college_professors_cache = new Map(); // Format: { college_id + department: [professor1, professor2, ...] }
const professors_review_cache = new Map(); /* Format: { 
    prof_id: {
        details: {
            image, name, description, bio_link, designation, department, college_name, college_id
        },
        review: {
            total_ratings, overall_rating, distributed_ratings
        },
        user_review: null || {
            user_id, is_same_college, review: null || { rating, timestamp }
        } 
    }}
*/
const comments_cache = new Map(); // Format: { prof_id: [comment1, comment2, ...] }
const replies_cache = new Map(); // Format: { comment_id: [reply1, reply2, ...] }
const top_lists_cache = new Map(); // Format: { colleges: [college1, college2, ...], professors: [professor1, professor2, ...] }

export {
    user_details_cache,
    colleges_list_cache,
    professors_list_cache,
    college_departments_cache,
    college_professors_cache,
    professors_review_cache,
    comments_cache,
    replies_cache,
    top_lists_cache,
}
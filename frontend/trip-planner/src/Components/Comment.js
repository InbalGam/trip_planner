import { insertActivityComment } from '../Api';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";


function Comment(props) {
    const [comment, setComment] = useState('');
    const { tripId, activityId } = useParams();
    const navigate = useNavigate();
    const [insertFailed, setInsertFailed] = useState(false);
    const [fieldsFilled, setFieldsFilled] = useState(false);
    const [updateFailed, setUpdateFailed] = useState(false);

    function handleTextChange(e) {
        setComment(e.target.value);
    };


    async function addComment(e) {
        e.preventDefault();
        if (!comment) {
            setFieldsFilled(true);
        }
        try {
            const newComment = {
                comment: comment
            };
            const result = await insertActivityComment(tripId, activityId, newComment);
            if (result.status === 401) {
                navigate('/login');
            } else {
                if (result.status === 200) {
                    props.setShowForm(false);
                    props.getActivityComments(tripId, activityId);
                    return result;
                } else {
                    setInsertFailed(true);
                }
            }
        } catch (e) {
            navigate('/error');
        }
    };


    return (
        <form onSubmit={addComment}>
            <label htmlFor='comment'>Enter comment-</label>
            <textarea id='comment' name='comment' value={comment} placeholder={'Enter comment here'} onChange={handleTextChange} rows="5" cols="33"></textarea>
            <button type="submit" value="Submit" className="submitButton">Submit comment</button>
            {fieldsFilled ? 'You must enter a comment to submit' : ''}
            {insertFailed ? 'Problem adding comment' : ''}
        </form>
    );
};

export default Comment;
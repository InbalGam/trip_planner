import { insertActivityComment } from '../Api';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import styles from './Styles/Comment.css';
import SendIcon from '@mui/icons-material/Send';

function CommentAdd(props) {
    const [comment, setComment] = useState('');
    const { tripId, activityId } = useParams();
    const navigate = useNavigate();
    const [insertFailed, setInsertFailed] = useState(false);
    const [fieldsFilled, setFieldsFilled] = useState(false);

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
        <form onSubmit={addComment} className='commentForm'>
            <textarea id='comment' name='comment' value={comment} placeholder={'Enter comment here'} onChange={handleTextChange} rows="5" cols="33" className='commentArea'></textarea>
            <button type="submit" value="Submit" className="commentSubmit"><SendIcon/></button>
            <p>{insertFailed ? 'Problem adding comment' : ''}</p>
            <p>{fieldsFilled ? 'You must enter a comment to submit' : ''}</p>
        </form>
    );
};

export default CommentAdd;
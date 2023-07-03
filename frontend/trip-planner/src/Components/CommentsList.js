import { getComments, updateActivityComment, deleteActivityComment } from '../Api';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import ClipLoader from 'react-spinners/ClipLoader';
import Comment from './Comment';

function CommentsList() {
    const { tripId, activityId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [deleteFailed, setDeleteFailed] = useState(false);

    async function getActivityComments(idTrip, idActivity) {
        try {
            setIsLoading(true);
            const result = await getComments(idTrip, idActivity);
            if (result.status === 401) {
                navigate('/login');
            } else {
                const jsonData = await result.json();
                console.log(jsonData);
                setComments(jsonData);
                setIsLoading(false);
            }
        } catch (e) {
            navigate('/error');
        }
    };


    useEffect(() => {
        getActivityComments(tripId, activityId);
    }, []);

    function addComment(e) {
        setShowForm(!showForm);
    };


    async function onClickDelete(commentId) {
        try {
            const result = await deleteActivityComment(tripId, activityId, commentId);
            if (result.status === 401) {
                navigate('/login');
            } else {
                if (result.status === 200) {
                    setDeleteFailed(false);
                    getActivityComments(tripId, activityId);
                } else {
                    setDeleteFailed(true);
                }
            }
        } catch (e) {
            navigate('/error');
        }
    };


    return (
        <div>
            {isLoading ? <ClipLoader color={'#3c0c21'} size={150} /> :
            <div>
                <button onClick={addComment} >Add comment</button>
                {showForm === false ? '' : <Comment setShowForm={setShowForm} getActivityComments={getActivityComments} />}
                <ul>
                    {comments ? comments.map((el, ind) => 
                        <li key={ind}>
                            <div>
                                <p className='commentBody'>{el.comment}</p>
                                <p className='commentUser'>{el.nickname}</p>
                                <p className='commentTime'>{el.timestamp}</p>
                                {el.isCreatedByMe === 1 ? <button size="small" onClick={(e) => onClickDelete(el.id)}>Delete comment</button> : ''}
                                {deleteFailed === false ? '' : 'Could not delete comment'}
                            </div>
                        </li>) : 'No comments yet'}
                </ul>
            </div>}
        </div>
    );


};

export default CommentsList;
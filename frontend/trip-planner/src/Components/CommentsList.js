import { getComments, updateActivityComment, deleteActivityComment } from '../Api';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import ClipLoader from 'react-spinners/ClipLoader';
import CommentAdd from './CommentAdd';
import AddIcon from '@mui/icons-material/Add';
import styles from './Styles/CommentsList.css';
import DeleteIcon from '@mui/icons-material/Delete';
import dateFormat, { masks } from "dateformat";


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
            setIsLoading(true);
            const result = await deleteActivityComment(tripId, activityId, commentId);
            if (result.status === 401) {
                navigate('/login');
            } else {
                if (result.status === 200) {
                    setDeleteFailed(false);
                    getActivityComments(tripId, activityId);
                    setIsLoading(false);
                } else {
                    setDeleteFailed(true);
                    setIsLoading(false);
                }
            }
        } catch (e) {
            navigate('/error');
        }
    };


    return (
        <div>
            {isLoading ? <ClipLoader color={'#3c0c21'} size={150} /> :
            <div className='CommentsContainer'>
                <button onClick={addComment} className='addComment' ><AddIcon/></button>
                {showForm === false ? '' : <CommentAdd setShowForm={setShowForm} getActivityComments={getActivityComments} setIsLoading={setIsLoading} />}
                <ul>
                    {comments ? comments.map((el, ind) => 
                        <li key={ind}>
                            <div className='comment'>
                                <p className='commentBody'>{el.comment}</p>
                                <div className='commentInfo'>
                                    <p className='commentUser'>{el.nickname}</p>
                                    <p className='commentTime'>{dateFormat(new Date(el.timestamp), "mmmm dS, yyyy")}</p> 
                                    {el.isCreatedByMe === 1 ? <button size="small" onClick={(e) => onClickDelete(el.id)} className='commentDelete'><DeleteIcon/></button> : ''}
                                    {deleteFailed === false ? '' : 'Could not delete comment'}
                                </div>
                            </div>
                        </li>) : 'No comments yet'}
                </ul>
            </div>}
        </div>
    );


};

export default CommentsList;
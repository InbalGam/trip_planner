import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import TripAddUpdate from './TripAddUpdate';
import dateFormat, { masks } from "dateformat";
import {deleteSpecificTrip} from '../Api';
import styles from './Styles/TripCard.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TripCard(props) {
  const [showForm, setShowForm] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);
  const navigate = useNavigate();

  function onClickEdit() {
    setShowForm(!showForm);
  };

  async function onClickDelete(trip) {
    try {
      const result = await deleteSpecificTrip(trip.id);
      if (result.status === 401) {
        navigate('/login');
      } else {
        if (result.status === 200) {
          setDeleteFailed(false);
        } else {
          setDeleteFailed(true);
        }
      }
    } catch (e) {
      navigate('/error');
    }
  };

  return (
    <>
      <Link to={`/trips/${props.trip.id}`} className='tripCardLink'>
        <Card sx={{ minWidth: 375 }} className='tripCard'>
          <CardContent>
            <Typography sx={{ fontSize: 24 }} gutterBottom className='countryName'>
              {props.trip.country}
            </Typography>
            <Typography variant="h5" component="div" className='cityName'>
              {props.trip.city}
            </Typography>
            <Typography sx={{ mb: 1.5 }} className='dates'>
              {dateFormat(new Date(props.trip.start_date), "mmmm dS, yyyy")} - {dateFormat(new Date(props.trip.end_date), "mmmm dS, yyyy")}
            </Typography>
          </CardContent>
          <CardActions>
            {props.trip.isCreatedByMe === 1 ? <Button size="small" onClick={onClickEdit} className='tripCardActionButtons'><EditIcon/></Button> : ''}
            {props.trip.isCreatedByMe === 1 ? <Button size="small" onClick={() => onClickDelete(props.trip)} className='tripCardActionButtons'><DeleteIcon/></Button> : ''}
          </CardActions>
        </Card>
      </Link>
      {showForm === false ? '' : <TripAddUpdate getUserTrips={props.getUserTrips} setShowForm={setShowForm} trip={props.trip} isTripAdd={false} />}
      {deleteFailed === false ? '' : 'Could not delete trip'}
    </>
  );
};


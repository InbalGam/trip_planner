import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useState } from "react";
import TripAddUpdate from './TripAddUpdate';
import dateFormat, { masks } from "dateformat";
import {deleteSpecificTrip} from '../Api';


export default function TripCard(props) {
  const [showForm, setShowForm] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);

  function onClickEdit() {
    setShowForm(!showForm);
  };

  async function onClickDelete(trip) {
    const result = await deleteSpecificTrip(trip.id);
    if (result.status === 200) {
      setDeleteFailed(false);
    } else {
      setDeleteFailed(true);
    }
  };
  
  return (
    <>

      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Link to={`/trips/${props.trip.id}`} >
            <Typography sx={{ fontSize: 24 }} color="text.secondary" gutterBottom>
              {props.trip.country}
            </Typography>
            <Typography variant="h5" component="div">
              {props.trip.city}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Start at- {dateFormat(new Date(props.trip.start_date), "dddd, mmmm dS, yyyy")}
              <br />
              End at- {dateFormat(new Date(props.trip.end_date), "dddd, mmmm dS, yyyy")}
            </Typography>
          </Link>
        </CardContent>
        <CardActions>
          {props.trip.isCreatedByMe === 1 ? <Button size="small" onClick={onClickEdit}>Edit trip</Button> : ''}
          {props.trip.isCreatedByMe === 1 ? <Button size="small" onClick={() => onClickDelete(props.trip)}>Delete trip</Button> : ''}
        </CardActions>
      </Card>
      {showForm === false ? '' : <TripAddUpdate getUserTrips={props.getUserTrips} setShowForm={setShowForm} trip={props.trip} isTripAdd={false} />}
      {deleteFailed === false ? '' : 'Could not delete trip'}
    </>
  );
};

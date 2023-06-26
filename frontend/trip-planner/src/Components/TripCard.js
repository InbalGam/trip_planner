import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useState } from "react";
import TripUpdate from './TripUpdate';
import dateFormat, { masks } from "dateformat";


export default function TripCard(props) {
  const [showForm, setShowForm] = useState(false);

  function onClickEdit() {
    setShowForm(!showForm);
  };

  function onClickDelete(trip) {
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
          <Button size="small" onClick={onClickEdit}>Edit trip</Button>
          <Button size="small" onClick={() => onClickDelete(props.trip)}>Delete trip</Button>
        </CardActions>
      </Card>
      {showForm === false ? '' : <TripUpdate getUserTrips={props.getUserTrips} setShowForm={props.setShowForm} trip={props.trip} />}
    </>
  );
};


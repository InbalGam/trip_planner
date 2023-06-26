import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';


export default function TripCard(props) {
  function onClickDelete(trip) {
    console.log(trip);
    props.setTrips((prev) => prev.filter(el => el.country.label !== trip.country.label));
  };

  return (
    <Link to={`/trips/${props.trip.country.label}`} >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            {props.trip.country.label}
          </Typography>
          <Typography variant="h5" component="div">
            {props.trip.city}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Start at- {props.trip.start_date.toDateString()}
            <br />
            End at- {props.trip.end_date.toDateString()}
          </Typography>
          <Typography variant="body2">
            {props.trip.emails ? props.trip.emails : ''}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => onClickDelete(props.trip)}>Delete trip</Button>
        </CardActions>
      </Card>
    </Link>
  );
};


import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';


export default function TripCard(props) {
  
  function onClickDelete(trip) {
  };

  return (
    <Link to={`/trips/${props.trip.id}`} >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 24 }} color="text.secondary" gutterBottom>
            {props.trip.country}
          </Typography>
          <Typography variant="h5" component="div">
            {props.trip.city}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Start at- {props.trip.start_date}
            <br />
            End at- {props.trip.end_date}
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


import * as React from 'react';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import TripAddUpdate from './TripAddUpdate';
import dateFormat, { masks } from "dateformat";
import {deleteSpecificTrip, updateTrip} from '../Api';
//import styles from './Styles/TripCard.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import tw from "twin.macro";
import { css } from "styled-components/macro";

import * as tcst from './Styles/TripCardStyles.js';


export default function TripCard(props) {
  const [showForm, setShowForm] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);
  const navigate = useNavigate();
  const [updateFailed, setUpdateFailed] = useState(false);

  function onClickEdit(e) {
    e.preventDefault();
    setShowForm(!showForm);
  };

  async function onClickDelete(event) {
    event.preventDefault();
    try {
      props.setIsLoading(true);
      const result = await deleteSpecificTrip(props.trip.id);
      if (result.status === 401) {
        navigate('/login');
      } else {
        if (result.status === 200) {
          setDeleteFailed(false);
          await props.getUserTrips();
          props.setIsLoading(false);
        } else {
          setDeleteFailed(true);
          props.setIsLoading(false);
        }
      }
    } catch (e) {
      navigate('/error');
    }
  };

  async function onTripSubmit(trip) {
    try {
      props.setIsLoading(true);
      setShowForm(false);
      const result = await updateTrip(trip, props.trip.id);
      if (result.status === 401) {
        navigate('/login');
      } else {
        if (result.status === 200) {
          await props.getUserTrips();
          props.setIsLoading(false);
          return result;
        } else {
          setUpdateFailed(true);
          props.setIsLoading(false);
        }
      };
    } catch (e) {
      navigate('/error');
    }
  };

  return (
    <>
    <tcst.Post className="group" as="a" href={`/trips/${props.trip.id}`}>
      <tcst.Image imageSrc={props.trip.photo} />
      <tcst.Info>
        <tcst.Title>{props.trip.country}</tcst.Title>
        <tcst.CreationDate>{dateFormat(new Date(props.trip.start_date), "mmmm d, yyyy")} - {dateFormat(new Date(props.trip.end_date), "mmmm d, yyyy")}</tcst.CreationDate>
        <tcst.Country>{props.trip.city}</tcst.Country>
        <div tw="flex justify-end">
          {props.trip.isCreatedByMe === 1 ? <Button size="small" onClick={onClickEdit} ><EditIcon /></Button> : ''}
          {props.trip.isCreatedByMe === 1 ? <Button size="small" onClick={(event) => onClickDelete(event)} ><DeleteIcon /></Button> : ''}
        </div>
      </tcst.Info>
    </tcst.Post>
    {showForm === false ? '' : <TripAddUpdate trip={props.trip} onTripSubmit={onTripSubmit} />}
    {updateFailed ? <Alert severity="warning">Problem updating trip</Alert> : ''}
    {deleteFailed === false ? '' : <Alert severity="warning">Could not delete trip</Alert>}
    </>
  );
};


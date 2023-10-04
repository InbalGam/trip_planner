import { useState, useEffect } from "react";
import TripAddUpdate from './TripAddUpdate';
import TripCard from './TripCard';
import {getTrips, insertTrip} from '../Api';
import { useNavigate } from 'react-router-dom';
//import styles from './Styles/TripsList.css';
import AddIcon from '@mui/icons-material/Add';
import ClipLoader from 'react-spinners/ClipLoader';
import Alert from '@mui/material/Alert';

import { Container, ContentWithPaddingXl } from "./helpers/Misc";
import tw from "twin.macro";
import { css } from "styled-components/macro";
import * as tpst from './Styles/TripsListStyles.js';


function TripsList() {
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const [insertFailed, setInsertFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    const [visible, setVisible] = useState(7);
    const onLoadMoreClick = () => {
        setVisible(v => v + 6);
    };


    async function getUserTrips() {
        try {
            setIsLoading(true);
            const result = await getTrips();
            if (result.status === 401) {
                navigate('/login');
            } else {
                const jsonData = await result.json();
                setTrips(jsonData);
                setIsLoading(false);
            }
        } catch (e) {
            navigate('/error');
        }
    };


    useEffect(() => {
        getUserTrips();
    }, []);


    function showTrip() {
        setShowForm(!showForm);
    };


    async function onTripSubmit(trip) {
        try {
            setIsLoading(true);
            setShowForm(false);
            const result = await insertTrip(trip);
            if (result.status === 401) {
                navigate('/login');
            } else {
                if (result.status === 200) {
                    await getUserTrips();
                    setIsLoading(false);
                    return result;
                } else {
                    setInsertFailed(true);
                }
            };
        } catch (e) {
            navigate('/error');
        }
    };

    return (
        <Container>
            <ContentWithPaddingXl>
                <tpst.ButtonContainer>
                    <tpst.LoadMoreButton onClick={showTrip}><AddIcon data-testid="addIcon" /></tpst.LoadMoreButton>
                </tpst.ButtonContainer>
                <div tw="flex justify-center mt-4">
                    {showForm === false ? '' : <TripAddUpdate onTripSubmit={onTripSubmit} />}
                    {insertFailed ? <Alert severity="warning">Problem adding trip</Alert> : ''}
                </div>
                <tpst.HeadingRow>
                    <tpst.Heading>{'Your Trips'}</tpst.Heading>
                </tpst.HeadingRow>
                {isLoading ? <ClipLoader color={'#3c0c21'} size={150} className="loader" data-testid="loader" /> :
                    <tpst.Posts>
                        {trips.slice(0, visible).map((trip, index) => (
                            <tpst.PostContainer key={index} featured={false}>
                                <TripCard trip={trip} getUserTrips={getUserTrips} setShowForm={setShowForm} setIsLoading={setIsLoading} />
                            </tpst.PostContainer>
                        ))}
                    </tpst.Posts>}
                {visible < trips.length && (
                    <tpst.ButtonContainer>
                        <tpst.LoadMoreButton onClick={onLoadMoreClick}>Load More</tpst.LoadMoreButton>
                    </tpst.ButtonContainer>
                )}
            </ContentWithPaddingXl>
        </Container>
    );
};

export default TripsList;
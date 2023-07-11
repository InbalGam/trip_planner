jest.mock('../Api');
import { create, act } from "react-test-renderer";
import React, {useEffect} from "react";
import {getSpecificTripActivity} from '../Api';
import Activity from "../Components/Activity";
import {screen, render, waitFor } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import dateFormat from "dateformat";


describe('Activity componenet', () => {
    test('it should present the activity name', async () => {
        //const today = new Date();
        const mockGetSpecificTripActivity = (tripId, activityId) => {
            return {
                status: 200,
                json: function () {
                    return {
                        activity_name: 'Activity name check',
                        date: new Date(),
                        start_time: '10:20',
                        end_time: '11:20',
                        address: 'address check',
                        url: 'www.check.com',
                        user_notes: 'just checking',
                        address_lat: 20.23,
                        address_lng: 40.23
                    };
                }
            }
        };
        
        getSpecificTripActivity.mockImplementation(mockGetSpecificTripActivity);

        render(<BrowserRouter><Routes><Route path='trips/:tripId/activities/:activityId' element={<Activity />} /></Routes></BrowserRouter>);
        await waitFor(() => { 
            expect(screen.getByTestId('ActivityInfo')).toBeInTheDocument();
        });
        
        expect(await screen.findByText('Activity name check')).toBeInTheDocument();
        // expect(await screen.findByText(today)).toBeInTheDocument();
        // expect(await screen.findByText('10:20')).toBeInTheDocument();
        // expect(await screen.findByText('just checking')).toBeInTheDocument();
    });
});


import * as React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within, waitFor, act
} from '@testing-library/react';
import Activity from "../Components/Activity";
import TripScheduler from '../Components/TripScheduler';
import { MemoryRouter, Routes, Route, json } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {jest} from '@jest/globals';
import {baseURL} from '../apiKey';

// Learn more: https://kentcdodds.com/blog/stop-mocking-fetch
import {server, waitForRequest} from '../test/server'


beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())


test('get trip activities', async () => {

    render(<MemoryRouter initialEntries={['/trips/32/activities/8']}>
        <Routes>
            <Route path='trips/:tripId/activities/:activityId' element={<Activity />} />
        </Routes>
    </MemoryRouter>);

  await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

  const resultsActivityName = screen.getByTestId('activityName').textContent;
  const resultsAddress = screen.getByTestId('address').textContent;

  expect(resultsActivityName).toEqual('blubli');
  expect(resultsAddress).toEqual('ddsds');
});


test('post new trip activity', async () => {

  render(<MemoryRouter initialEntries={['/trips/32']}>
        <Routes>
            <Route path='trips/:tripId' element={<TripScheduler />} />
        </Routes>
    </MemoryRouter>);

  await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

  act(() => {
    userEvent.click(screen.getByTestId('addIcon'));
  });

  await waitFor(() => {
  expect(screen.getByTestId('activityForm')).toBeInTheDocument();
});
});

test('post new trip activity', async () => {

  render(<MemoryRouter initialEntries={['/trips/32']}>
        <Routes>
            <Route path='trips/:tripId' element={<TripScheduler />} />
        </Routes>
    </MemoryRouter>);

  await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

  act(() => {
    userEvent.click(screen.getByTestId('addIcon'));
  });
  
  await waitFor(() => {
    expect(screen.getByTestId('activityForm')).toBeInTheDocument();
  });

  act(() => {
    userEvent.type(screen.getByTestId('activityName'), 'activity test');
  });


  act(() => {
    userEvent.type(screen.getByTestId('activityAddress'), 'Berlin, Germany');
  });


  act(() => {
    userEvent.type(screen.getByTestId('activityURL'), 'www.urlcheck.com');
  });


  const pendingRequest = waitForRequest('POST', `${baseURL}/trips/32/activities`);
  act(() => {
    userEvent.click(screen.getByTestId('submit'));
  });


  const request = await pendingRequest;
  const jsonData = await request.json();
  
  expect(jsonData).toMatchObject({
    "activity_name": 'activity test',
    "address": "Berlin, Germany",
    "activityURL": 'www.urlcheck.com'
});

});

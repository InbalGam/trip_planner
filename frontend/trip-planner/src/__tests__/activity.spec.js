import * as React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import Activity from "../Components/Activity";
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Learn more: https://kentcdodds.com/blog/stop-mocking-fetch
import {server} from '../test/server'


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

import * as React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within, waitFor, act
} from '@testing-library/react';
import TripsList from "../Components/TripsList";
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import {jest} from '@jest/globals';;
import {baseURL} from '../apiKey';

// Learn more: https://kentcdodds.com/blog/stop-mocking-fetch
import {server, waitForRequest} from '../test/server'


beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())


test('get trips', async () => {

  render(<MemoryRouter initialEntries={['/trips']}><TripsList /> </MemoryRouter>);

  await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

  const resultsCountryName = screen.getAllByRole('listitem').map((listItem) => {
    return within(listItem).getByTestId('countryName').textContent
  });

  const resultsCity = screen.getAllByRole('listitem').map((listItem) => {
    return within(listItem).getByTestId('cityName').textContent
  });
  expect(resultsCountryName).toEqual(['ItalyDummy', 'Algeria', 'Italy']);
  expect(resultsCity).toEqual(['rome', 'Naples, Metropolitan City of Naples, Italy', 'Napoli']);
});


test('click to open trip form', async () => {

  render(<MemoryRouter initialEntries={['/trips']}><TripsList /> </MemoryRouter>);

  await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

  act(() => { //everything that changes state should be in act
    userEvent.click(screen.getByTestId('addIcon'));
  });
  
  await waitFor(() => {
    expect(screen.getByTestId('tripForm')).toBeInTheDocument();
  })
});


test('post trip', async () => {

  render(<MemoryRouter initialEntries={['/trips']}><TripsList /> </MemoryRouter>);

  await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

  act(() => {
    userEvent.click(screen.getByTestId('addIcon'));
  });
  
  await waitFor(() => {
    expect(screen.getByTestId('tripForm')).toBeInTheDocument();
  });

  await selectEvent.select(screen.getByLabelText('Select Country'), 'Germany');

  act(() => {
    userEvent.type(screen.getByTestId('city'), 'Berlin');
  });


  const pendingRequest = waitForRequest('POST', `${baseURL}/trips`);
  act(() => {
    userEvent.click(screen.getByTestId('submit'));
  });


  const request = await pendingRequest;
  const jsonData = await request.json();
  expect(jsonData).toMatchObject({
    "country": 'Germany',
    "city": 'Berlin',
    "photo": '',
    "emails": []
});

});

import * as React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import TripsList from "../Components/TripsList";
import { MemoryRouter } from 'react-router-dom';

// Learn more: https://kentcdodds.com/blog/stop-mocking-fetch
import {server} from '../test/server'


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

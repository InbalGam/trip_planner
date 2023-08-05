// server-handlers.js
// this is put into here so I can share these same handlers between my tests
// as well as my development in the browser. Pretty sweet!
import {rest} from 'msw' // msw supports graphql too!
import {baseURL} from '../apiKey';

const handlers = [
  rest.get(`${baseURL}/trips`, async (req, res, ctx) => {
    return res(ctx.json([
        {
            "id": 32,
            "country": "ItalyDummy",
            "city": "rome",
            "start_date": "2023-05-15T21:00:00.000Z",
            "end_date": "2023-05-21T21:00:00.000Z",
            "created_by": 17,
            "photo": null,
            "isCreatedByMe": 1
        },
        {
            "id": 62,
            "country": "Algeria",
            "city": "Naples, Metropolitan City of Naples, Italy",
            "start_date": "2023-07-14T21:00:00.000Z",
            "end_date": "2023-07-25T21:00:00.000Z",
            "created_by": 17,
            "photo": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAaw_FcKCJIM0IDU3k2WCOrEtmnODR-VfTKUBbat6S2vkZR3LlLyCpgAZdP1KYR_AJfm4W1h23REHGLHE9PdsfIcWWM9YHIjkY5HQJrn_bHmsU8ATz3GBIAnoPhUlqiQ9U4Ev8zpd1EVDQ7pe7iZu8ba5sGHYPMvfb1mVv3EQuMROxyIsX9ir&3u720&5m1&2e1&callback=none&key=AIzaSyCHCHNhjtJ64EuJ23r9UbBwmsNai3NNSeM&token=16775",
            "isCreatedByMe": 1
        },
        {
            "id": 52,
            "country": "Italy",
            "city": "Napoli",
            "start_date": "2023-09-03T21:00:00.000Z",
            "end_date": "2023-09-06T21:00:00.000Z",
            "created_by": 17,
            "photo": null,
            "isCreatedByMe": 1
        }
    ]))
  }),
]

export {handlers}
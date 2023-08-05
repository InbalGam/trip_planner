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
            "photo": null,
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
  rest.post('/trips', async (req, res, ctx) => {
    const trip = await req.json();
    // do whatever other things you need to do with this shopping cart
    return res(ctx.json({
      "id": 108,
      "country": trip.country,
      "city": trip.city,
      "start_date": trip.startDate,
      "end_date": trip.endDate,
      "created_by": 17,
      "photo": null,
      "isCreatedByMe": 1,
      "emails": []
  }))}),
  rest.get(`${baseURL}/trips/32/activities/8`, async (req, res, ctx) => {
    return res(ctx.json(
      {
          "id": 8,
          "date": "2023-04-30T21:00:00.000Z",
          "trip_id": 32,
          "activity_name": "blubli",
          "address": "ddsds",
          "url": "www.ggg.com",
          "start_time": "08:00:00",
          "end_time": "13:00:00",
          "user_id": 17,
          "user_notes": "No notes",
          "type": null,
          "address_lat": null,
          "address_lng": null
      }))
  }),
  rest.get(`${baseURL}/trips/32/activities/8/comments`, async (req, res, ctx) => {
    return res(ctx.json([]))})
]

export {handlers}
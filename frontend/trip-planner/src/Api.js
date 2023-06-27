import fetch from 'cross-fetch';


const baseURL = 'http://localhost:4001';

// Auth
async function login(username, password) {
    const url = `${baseURL}/login`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });

    return response.status === 200;
};


// Trips
async function getTrips() {
    const url = `${baseURL}/trips`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};


async function getSpecificTrip(tripId) {
    const url = `${baseURL}/trips/${tripId}`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};


async function insertTrip(trip) {
    const {country, city, start_date, end_date, emails} = trip;
    const url = `${baseURL}/trips`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({country, city, start_date, end_date, emails})
    });

    return response;
};


async function updateTrip(trip, tripId) {
    const {country, city, start_date, end_date, emails} = trip;
    const url = `${baseURL}/trips/${tripId}`;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({country, city, start_date, end_date, emails})
    });

    return response;
};


async function deleteSpecificTrip(tripId) {
    const url = `${baseURL}/trips/${tripId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });

    return response;
};


// Activities
async function getActivities(tripId) {
    const url = `${baseURL}/trips/${tripId}/activities`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};


export {login, getTrips, insertTrip, getSpecificTrip, updateTrip, deleteSpecificTrip, getActivities};
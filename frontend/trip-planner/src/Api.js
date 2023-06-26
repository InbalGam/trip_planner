import fetch from 'cross-fetch';


const baseURL = 'http://localhost:4001';


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


async function getTrips() {
    const url = `${baseURL}/trips`;
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

export {login, getTrips, insertTrip};
import fetch from 'cross-fetch';


const baseURL = 'http://localhost:4001';

// Auth
async function register(username, password, nickname) {
    const url = `${baseURL}/register`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password, nickname})
    });

    return response.status === 200;
};

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


async function logout() {
    const url = `${baseURL}/logout`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
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


async function insertTripActivity(tripId, activity) {
    const {date, activity_name, address, activityURL, start_time, end_time, user_notes} = activity;
    const url = `${baseURL}/trips/${tripId}/activities`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({date, activity_name, address, activityURL, start_time, end_time, user_notes})
    });

    return response;
};


async function updateTripActivity(tripId, activity, activityId) {
    const {date, activity_name, address, activityURL, start_time, end_time, user_notes} = activity;
    const url = `${baseURL}/trips/${tripId}/activities/${activityId}`;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({date, activity_name, address, activityURL, start_time, end_time, user_notes})
    });

    return response;
};



async function deleteSpecificTripActivity(tripId, activityId) {
    const url = `${baseURL}/trips/${tripId}/activities/${activityId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });

    return response;
};


async function getSpecificTripActivity(tripId, activityId) {
    const url = `${baseURL}/trips/${tripId}/activities/${activityId}`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};



// Comments

async function getComments(tripId, activityId) {
    const url = `${baseURL}/trips/${tripId}/activities/${activityId}/comments`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });

    return response;
};


async function insertActivityComment(tripId, activityId, userComment) {
    const { comment } = userComment;
    const url = `${baseURL}/trips/${tripId}/activities/${activityId}/comments`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment})
    });

    return response;
};


async function updateActivityComment(tripId, activityId, userComment, commentId) {
    const { comment } = userComment;
    const url = `${baseURL}/trips/${tripId}/activities/${activityId}/comments/${commentId}`;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment})
    });

    return response;
};


async function deleteActivityComment(tripId, activityId, commentId) {
    const url = `${baseURL}/trips/${tripId}/activities/${activityId}/comments/${commentId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });

    return response;
};


export {register, login, logout, getTrips, insertTrip, getSpecificTrip, updateTrip, deleteSpecificTrip, 
    getActivities, insertTripActivity, updateTripActivity, deleteSpecificTripActivity, getSpecificTripActivity, 
    getComments, insertActivityComment, updateActivityComment, deleteActivityComment};
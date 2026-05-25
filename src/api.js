const API = (import.meta.env.VITE_API_URL || '') + '/api';

export async function signup(firstName, lastName, email, password) {
    const res = await fetch(`${API}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });
    return res.json();
}

export async function login(email, password) {
    const res = await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

export async function createEvent(eventData) {
    const res = await fetch(`${API}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
    });
    return res.json();
}

export async function getEvent(code) {
    const res = await fetch(`${API}/events/${code}`);
    return res.json();
}

export async function getAllEvents() {
    const res = await fetch(`${API}/events/`);
    return res.json();
}

export async function getMyEvents(userId) {
    const res = await fetch(`${API}/events/my/${userId}`);
    return res.json();
}

export async function updateEvent(code, eventData) {
    const res = await fetch(`${API}/events/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
    });
    return res.json();
}

export async function deleteEvent(code) {
    const res = await fetch(`${API}/events/${code}`, {
        method: 'DELETE',
    });
    return res.json();
}

export async function getMyTickets(userId) {
    const res = await fetch(`${API}/tickets/my/${userId}`);
    return res.json();
}

export async function purchaseTicket(userId, eventId) {
    const res = await fetch(`${API}/tickets/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventId }),
    });
    return res.json();
}

export async function validateTicket(token, eventId) {
    const res = await fetch(`${API}/tickets/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, eventId }),
    });
    return res.json();
}

export async function getEventResales(eventId) {
    const res = await fetch(`${API}/resales/event/${eventId}`);
    return res.json();
}
// get all the resales for a specific event

export async function purchaseResale(resaleId, buyerId) {
    const res = await fetch(`${API}/resales/${resaleId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId }),
    });
    return res.json();
}
// purchase a resale ticket

export async function listForResale(ticketId, sellerId, eventId, price) {
    const res = await fetch(`${API}/resales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, sellerId, eventId, price }),
    });
    return res.json();
}
// list a ticket for resale

export async function getEventAttendees(eventId) {
    const res = await fetch(`${API}/tickets/event/${eventId}`);
    return res.json();
}

export async function updateProfile(userId, data) {
    const res = await fetch(`${API}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function uploadEventImage(eventCode, file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API}/uploads/event/${eventCode}`, {
        method: 'POST',
        body: formData,
    });
    return res.json();
}

export async function uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API}/uploads/avatar/${userId}`, {
        method: 'POST',
        body: formData,
    });
    return res.json();
}
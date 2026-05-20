const API = '/api';

export async function signup(name, email, password) {
    const res = await fetch(`${API}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
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

export async function getMyEvents(userId) {
    const res = await fetch(`${API}/events/my/${userId}`);
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
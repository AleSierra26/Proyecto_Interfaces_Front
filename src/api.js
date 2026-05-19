const API = '/api';

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
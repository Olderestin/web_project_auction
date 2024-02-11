const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

async function register(body) {
    const apiUrl = AUTH_BASE_URL + '/register/';
    try {
        const response = await fetch(apiUrl, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('An unexpected error occurred during registration.');
    }
}

async function login(body) {
    const apiUrl = AUTH_BASE_URL + '/login/';
    try {
        const response = await fetch(apiUrl, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('An unexpected error occurred during login.');
    }
}

async function logout(refresh, access) {
    const apiUrl = AUTH_BASE_URL + '/logout';
    const requestBody = {refresh};
    try {
        const response = await fetch(apiUrl, {method: 'POST', headers: {'Content-Type': 'application/json', 
        'Authorization': `Bearer ${access}`}, body: JSON.stringify(requestBody)});
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function refresh_token(access, refresh) {
    const apiUrl = AUTH_BASE_URL + '/token/refresh/';
    const requestBody = {refresh: refresh};
    try {
        const response = await fetch(apiUrl, {method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${access}`}, body: JSON.stringify(requestBody)});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export { register, login, logout, refresh_token };
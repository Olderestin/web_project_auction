import { refresh_token } from "./authApi";

const AUCTION_BASE_URL = import.meta.env.VITE_AUCTION_BASE_URL;

function objectToFormData(obj) {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
}

async function refreshTokenAndRetry(userData, setUserData, retryFunction, ...args) {
    let access = userData.tokens.access;
    let refresh = userData.tokens.refresh;
    const response = await refresh_token(access, refresh);
    const copied = {...userData};
    copied.tokens.access = response.access;
    const userDataString = JSON.stringify(copied);
    sessionStorage.setItem('userData', userDataString);
    setUserData(copied);
    return retryFunction(userData, setUserData, ...args);
}

async function profile(userData, setUserData, username) {
    let access = userData.tokens.access;
    const apiUrl = AUCTION_BASE_URL + `/profile/${username}/`;
    try {
        const response = await fetch(apiUrl, {method: 'GET', headers: { 'Authorization': `Bearer ${access}`}});
        const data = await response.json();
        if (data.code === 'token_not_valid') {
            return refreshTokenAndRetry(userData, setUserData, profile, username);
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function create_auction(userData, setUserData, body) {
    let access = userData.tokens.access;
    const apiUrl = AUCTION_BASE_URL + '/auctions/';
    const requestBody = body;
    try {
        const response = await fetch(apiUrl, {method: 'POST', headers: { 'Authorization': `Bearer ${access}`,}, body: objectToFormData(requestBody)});
        const data = await response.json();
        if (data.code === 'token_not_valid') {
            return refreshTokenAndRetry(userData, setUserData, create_auction, body);
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function read_auction(auction_id) {
    const apiUrl = AUCTION_BASE_URL + `/auctions/${auction_id}/`;
    try {
        const response = await fetch(apiUrl, {method: 'GET'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function delete_auction(userData, setUserData, auction_id) {
    let access = userData.tokens.access;
    const apiUrl = AUCTION_BASE_URL + `/auctions/${auction_id}/`;
    try {
        const response = await fetch(apiUrl, {method: 'DELETE', headers: { 'Authorization': `Bearer ${access}`,}});
        if (response.status === 401) {
            return refreshTokenAndRetry(userData, setUserData, delete_auction, auction_id);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function update_auction(userData, setUserData, auctionDataObj, auction_id) {
    let access = userData.tokens.access;
    const apiUrl = AUCTION_BASE_URL + `/auctions/${auction_id}/`;
    const formData = objectToFormData(auctionDataObj);
    formData.append('id', auction_id);
    try {
        const response = await fetch(apiUrl, {method: 'PUT', headers: { 'Authorization': `Bearer ${access}`,}, body: formData});
        const data = await response.json();
        if (data.code === 'token_not_valid') {
            return refreshTokenAndRetry(userData, setUserData, update_auction, auctionDataObj, auction_id);
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function list_auctions() {
    const apiUrl = AUCTION_BASE_URL + `/auctions/`;
    try {
        const response = await fetch(apiUrl, {method: 'GET'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function upload_image(userData, setUserData, image, auction_id) {
    let access = userData.tokens.access;
    const apiUrl = AUCTION_BASE_URL + '/auction-images/';
    const formData = new FormData();
    formData.append('image', image);
    formData.append('auction', auction_id);
    try {
        const response = await fetch(apiUrl, {method: 'POST', headers: { 'Authorization': `Bearer ${access}`,}, body: formData});
        const data = await response.json();
        if (data.code === 'token_not_valid') {
            return refreshTokenAndRetry(userData, setUserData, upload_image, image, auction_id);
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function delete_image(userData, setUserData, image_id) {
    let access = userData.tokens.access;
    const apiUrl = AUCTION_BASE_URL + `/auction-images/${image_id}/`;
    try {
        const response = await fetch(apiUrl, {method: 'DELETE', headers: { 'Authorization': `Bearer ${access}`,}});
        if (response.status === 401) {
            return refreshTokenAndRetry(userData, setUserData, delete_image, image_id);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function make_bid(userData, setUserData, username, bid, auction_id) {
    let access = userData.tokens.access;
    const apiUrl = AUCTION_BASE_URL + '/bid/';
    const requestBody = {user: {username}, bid: Number(bid), auction: Number(auction_id)}
    try {
        const response = await fetch(apiUrl, {method: 'POST', headers: { 'Authorization': `Bearer ${access}`, 'content-type': 'application/json'}, body: JSON.stringify(requestBody)});
        const data = await response.json();
        if (data.code === 'token_not_valid') {
            return refreshTokenAndRetry(userData, setUserData, make_bid, username, bid, auction_id);
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export { profile, create_auction, read_auction, delete_auction, update_auction, list_auctions, upload_image, delete_image, make_bid};
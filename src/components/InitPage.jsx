import { useState, useEffect } from 'react'
import { list_auctions } from '../api/auctionApi'
import { refresh_token } from '../api/authApi'

import '../styles/InitPage.scss'

function InitPage({ setOnPage, userData }) {
    const [allAuctionsList, setAllAuctionsList] = useState(null);
    const [auctionsLoaded, setAuctionsLoaded] = useState(false);

    useEffect(() => {
        list_auctions()
            .then((list) => {
                setAllAuctionsList(list);
                setAuctionsLoaded(true);
            })
            .catch((error) => {
                console.error('Error fetching auctions:', error);
                setAuctionsLoaded(true);
            });
    }, []);

    return (
        <>
        <div className="main-block">
            <nav className='main-nav'>
                <div className="nav-btns">
                    <button className='nav-btn' type='button' onClick={() => {
                        sessionStorage.setItem('onPage', 'init');
                        setOnPage('init');
                        }}>About auction</button>
                    <button className='nav-btn' type='button' onClick={() => {
                        sessionStorage.setItem('onPage', 'allAuctions');
                        setOnPage('allAuctions');
                        }}>All lots</button>
                </div>
                <div className="profile-btns">
                {userData ? (
                    <p className="profile-btn" onClick={() => {
                        sessionStorage.setItem('onPage', 'profile');
                        setOnPage('profile');
                    }}>{userData.username}</p>
                ) : (
                    <>
                    <button className='profile-btn' type='button' onClick={() => {
                        sessionStorage.setItem('onPage', 'signUp');
                        setOnPage('signUp');
                    }}>Register</button> / 
                    <button className='profile-btn' type='button' onClick={() => {
                        sessionStorage.setItem('onPage', 'signIn');
                        setOnPage('signIn');
                    }}>Login</button>
                    </>
                )}
                </div>
            </nav>
            <div className="main-hero">
                <h1 className="hero-header">Charity Auction</h1>
                <p className="hero-text">We are convinced that everyone can make the world a better place, and every small step in this direction is of great importance. Join us at our online charity auction, and together we will do more for those who need our help!</p>
                <div className="hero-buttons">
                    <button className='hero-btn' type="button" onClick={() => {
                        sessionStorage.setItem('onPage', 'allAuctions');
                        setOnPage('allAuctions');
                    }}>Place a bet</button>
                    <button className='hero-btn' type="button" onClick={() => {
                        if (userData) {
                            sessionStorage.setItem('onPage', 'profile');
                            setOnPage('profile');
                        }
                        else {
                            sessionStorage.setItem('onPage', 'signIn');
                            setOnPage('signIn');
                        }
                    }}>Offer a lot</button>
                </div>
            </div>
        </div>
        <div className="main-about">
            <div className="about-header">About the auction</div>
            <div className="main-content">
                <div className="content-img-container">
                    <img className='content-img' src="https://www.ukrainianlessons.com/wp-content/uploads/2023/03/800px-%D0%A8%D0%B5%D0%B2%D1%87%D0%B5%D0%BD%D0%BA%D0%BE_%D0%A2._%D0%93._%D0%9A%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0._1842.jpg" alt="" />
                </div>
                <div className="content-desc">
                    <div className='content-desc-header'>Welcome to our online charity auction!</div>
                    <div className="content-desc-text">We are pleased to present you with the opportunity to participate in an event that not only makes the world a better place, but also gives you the opportunity to get interesting items and services while you help those who need our support.</div>
                    <div className="content-desc-text">Our auction is not just an opportunity to get unique items and experiences, it is also an opportunity to do a good deed. Participation in our event will allow you not only to win incredible items, but also to contribute to the implementation of charitable projects aimed at improving the lives of those in difficult situations.</div>
                </div>
            </div>
        </div>
        <div className="active-lots-block">
            <div className="active-lots-header-block">
                <div className="active-lots-header">Active lots</div>
            </div>
            <div className="lots-container">
            {auctionsLoaded ? (
                        allAuctionsList.map((auction, index) => {
                            if (index < 3) {
                                return (
                                    <div key={index} className="lot">
                                        <div className="lot-image-small">
                                            <img
                                                src={
                                                    auction.images.length > 0
                                                        ? auction.images[0].image
                                                        : 'https://media.istockphoto.com/id/1452662817/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=170667a&w=0&k=20&c=KaRW6O_DcZXEFbMPS-3DrDP5z28TIdBoBzcCliubxyY='
                                                }
                                                alt="image"
                                                className="lot-image"
                                            ></img>
                                        </div>
                                        <div className="lot-text">
                                            <div className="lot-header">{auction.title}</div>
                                            <div className="lot-highest-bid-container">
                                                <div className="highest-bid-text-small">Start bid:</div>
                                                <div className="highest-bid-value">${auction.start_bid}</div>
                                            </div>
                                            <div className="lot-owner-container">
                                                <div className="lot-owner-text-small">Owner:</div>
                                                <div className="lot-owner-value">{auction.owner.username}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })
                    ) : (
                        <div className="loading-text">Loading...</div>
                    )}
            </div>
        </div>
        </>
    )
}

export default InitPage;
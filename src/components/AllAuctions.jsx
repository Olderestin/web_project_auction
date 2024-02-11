import { useState, useEffect } from 'react'
import { list_auctions } from '../api/auctionApi'
import '../styles/AllAuctions.scss'

function AllAuctions({ setOnPage, setCurrentAuction, setCalledFrom, userData }) {
    const [allAuctionsList, setAllAuctionsList] = useState(null);

    useEffect(() => {
        list_auctions().then((list) => setAllAuctionsList(list));
    }, []);

    return (
        <>
        <div className="all-main-block">

            <nav className='all-main-nav'>
                <div className="all-nav-btns">
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
        <div className="all-auctions-box">
            {allAuctionsList ? (
                 <div className='auctions-container'>
                 {allAuctionsList.map((auction) => {
                     return (
                         <div className='auction-card' key={auction.id}>
                             {auction.images.length > 0 ? (
                                <img className='auction-img' src={auction.images[0].image} alt="img" />
                             ): (
                                // <p>No image provided</p>
                                <img className='auction-img' src='https://media.istockphoto.com/id/1452662817/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=170667a&w=0&k=20&c=KaRW6O_DcZXEFbMPS-3DrDP5z28TIdBoBzcCliubxyY=' alt="img" />
                             )}
                             <div className="all-auction-text">
                                 <p className='auction-title'>{auction.title}</p>
                                 {/* <p className='auction-desc'>{auction.description}</p> */}
                                 <p className='auction-start-bid'>Start bid: ${auction.start_bid}</p>
                                 <p className='auction-bid-step'>Bid step: ${auction.bid_step}</p>
                                 <p className='auction-owner'>Owner: {auction.owner.username}</p>
                                 <button className='bet-btn' type='button' onClick={() => {
                                    sessionStorage.setItem('currentAuction', auction.id);
                                    setCurrentAuction(auction.id);
                                    setCalledFrom('allAuctions');
                                    sessionStorage.setItem('onPage', 'auctionInfo');
                                    setOnPage('auctionInfo');
                                }}>Place a bet</button>
                             </div>
                         </div>
                     )
                 })}
                </div>
            ): (
                <p>Loading</p>
            )}
        </div>
       </div>
        </>
    )
}

export default AllAuctions;
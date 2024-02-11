import { read_auction, make_bid } from "../api/auctionApi"
import { useState, useEffect } from "react"
import ControlledInput from "./ControlledInput"
import '../styles/AuctionInfo.scss'

function AuctionInfo({ setOnPage, auction_id, called_from, userData, setUserData }) {
    const [auctionInfo, setAuctionInfo] = useState(null);
    const [currForm, setCurrForm] = useState({});
    const [bitMade, setBitMade] = useState(false);
    const [highestBid, setHighestBid] = useState(0);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        read_auction(auction_id).then((info) => {
            setAuctionInfo(info);
            const bids_nums = info.bids.map(elem => elem.bid);
            setHighestBid(Math.max(...bids_nums, 0));
            let bids_usernames = info.bids.map(elem => elem.user.username);
            bids_usernames = new Set(bids_usernames);
            bids_usernames = Array.from(bids_usernames);
            setParticipants(bids_usernames);
        });
        setBitMade(false);

    }, [auction_id, bitMade]);

    async function bid(access, username, bid, auction_id) {
        if (username == auctionInfo.owner.username) {
            alert("You can't bid in your own auction!");
            return;
        }
        let response = await make_bid(userData, setUserData, username, bid, auction_id);
        if (typeof response[0] === 'string') alert(response);
        else {
            alert('Bid successfull');
            setBitMade(true);
        }
    }

    return (
        <>
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
            <div className="info-block">
                {auctionInfo ? (
                    <>
                        <div className="auction-info">
                            <div className="auction-info-text">
                                <p className="auction-info-title">{auctionInfo.title}</p>
                                <p className="auction-description">{auctionInfo.description}</p>
                                <p className="auction-start-bid">Start bid: ${auctionInfo.start_bid}</p>
                                <p className="auction-bid-step">Bid step: ${auctionInfo.bid_step}</p>
                                <p className="auction-info-owner">Owner: {auctionInfo.owner.username}</p>
                            </div>
                            <div className="auction-images">
                                {auctionInfo.images.map((elem) => {
                                    return <img key={elem.id} src={elem.image} alt="auction-image" />
                                })}
                            </div>
                            <p className="highest-bid-text">Highest bid now is: ${highestBid}</p>
                            <br />
                            <p className="aution-participants-text">Auction participants</p>
                            <div className="participants">
                                {participants.map((elem, index) => {
                                    return <p key={elem}>{index + 1}. {elem}</p>
                                })}
                            </div>
                            <br />
                            <p className="bids-history-text">Bidding history</p>
                            <div className="bids-history">
                                {auctionInfo.bids.map((bid, index) => (
                                    <p key={bid.id}>{index + 1}. {bid.user.username}: ${bid.bid} </p>
                                ))}
                            </div>
                            <p className="bids-history-text">Make your bid</p>
                            <div className="bid-container">
                                <ControlledInput placeholder="Enter your bid here" maxLength={10} name='bid' currForm={currForm} setCurrForm={setCurrForm} type='text' />
                                <div className="bid-btns">
                                    <button className="bid-btn" type='button' onClick={() => {
                                        if (typeof userData.tokens === 'undefined') {
                                            alert('You need to sign in to make bids');
                                            return;
                                        }
                                        const integerRegex =/^[1-9]\d*$/;
                                        if (!integerRegex.test(currForm.bid)) {
                                            alert('You need to enter only integer values here');
                                            return;
                                        }
                                        bid(userData.tokens.access, userData.username, currForm.bid, auction_id);
                                    }}>Make bid</button>
                                    <button className="bid-btn" type="button" onClick={() => {
                                        sessionStorage.setItem('onPage', called_from);
                                        setOnPage(called_from)}}>Back</button>
                                </div>

                            </div>
                        </div>
                    </>
                ) : (
                    <p>Loading auction information...</p>
                    )}
            </div>
        </>
    );
}

export default AuctionInfo;

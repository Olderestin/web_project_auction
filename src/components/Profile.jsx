import { logout } from "../api/authApi"
import { profile } from "../api/auctionApi"
import { useEffect, useState } from "react"
import '../styles/Profile.scss'
import { delete_auction } from "../api/auctionApi"

function Profile({ userData, setUserData, setOnPage, setCurrentAuction, setCalledFrom, setCurrentEditedAuction }) {
    const [userProfile, setUserProfile] = useState({});
    const [deleted, setDeleted] = useState(false);

    function logout_btn() {
        logout(userData.tokens.refresh, userData.tokens.access).then((data) => console.log(data));
        sessionStorage.removeItem('userData');
        setUserData(null);
        sessionStorage.setItem('onPage', 'init');
        setOnPage('init');
    }

    useEffect(() => {
        profile(userData, setUserData, userData.username).then((data) => {
            setUserProfile(data);
        });
        setDeleted(false);
    }, [userData.username, deleted, userData, setUserData])

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
                {/* <button className='profile-btn' type='button' onClick={() => {setOnPage('signUp')}}>Register</button> / <button className='profile-btn' type='button' onClick={() => {setOnPage('signIn')}}>Login</button> */}
                <button className="logout-btn" type="button" onClick={() => {
                    setUserData({});
                    logout_btn();
                    sessionStorage.setItem('onPage', 'init');
                    setOnPage('init');
                }}>
                <p className="logout-text">Logout</p>
                </button>
                </div>
            </nav>
        <div className="profile-block">
            <div className="profile-header">{userProfile.username}</div>
            <div className="profile-info">
                <div className="profile-first-name">First name: {userProfile.first_name}</div>
                <div className="profile-last-name">Last name: {userProfile.last_name}</div>
            </div>
        </div>
        <div className="my-auctions-block">
            <p className="my-auctions-header">My lots</p>
            <div className="my-lots">
                {userProfile.auction_set && userProfile.auction_set.length > 0 ? (
                    userProfile.auction_set.map(auction => (
                        <div className="my-lot" key={auction.id}>
                            <p onClick={() => {
                                setCurrentAuction(auction.id);
                                sessionStorage.setItem('onPage', 'auctionInfo');
                                setOnPage('auctionInfo');
                                setCalledFrom('profile');
                            }}>{auction.title}</p>
                            <div className="lot-btns">
                                <button className="lot-btn" type="button" onClick={() => {
                                    setCurrentEditedAuction(auction.id);
                                    sessionStorage.setItem('onPage', 'editAuction');
                                    setOnPage('editAuction');
                                }}>Edit</button>
                                <button className="lot-btn" type="button" onClick={() => {
                                    delete_auction(userData.tokens.access, auction.id);
                                    setDeleted(true);
                                }}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-lots">You haven't created any lots.</p>
                )}
            </div>
            <button className="create-lot-btn" type='button' onClick={() => {
                sessionStorage.setItem('onPage', 'createAuction');
                setOnPage('createAuction');
                }}>Create lot</button>
        </div>
        <div className="my-participated-block">
            <p className="my-participated-header">Participated lots</p>
            <div className="my-participateds">
                {userProfile.participating_auctions && userProfile.participating_auctions.length > 0 ? (
                    userProfile.participating_auctions.map(auction => (
                        <div className="my-participated" key={auction.id}>
                        <p onClick={() => {
                            setCurrentAuction(auction.id);
                            sessionStorage.setItem('onPage', 'auctionInfo');
                            setOnPage('auctionInfo');
                            setCalledFrom('profile');
                        }}>{auction.title}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-lots">You haven't participated in any lots</p>
                )}
            </div>
            <button className="create-lot-btn" type='button' onClick={() => {
                sessionStorage.setItem('onPage', 'allAuctions');
                setOnPage('allAuctions');
                }}>All lots</button>
        </div>
        </>
    )
}

export default Profile;
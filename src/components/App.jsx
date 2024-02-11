import { useEffect, useState } from 'react'
import InitPage from './InitPage'
import SignUp from './SignUp'
import SignIn from './SignIn'
import Profile from './Profile'
import CreateAuction from './CreateAuction'
import AuctionInfo from './AuctionInfo'
import AllAuctions from './AllAuctions'
import EditAuction from './EditAuction'
import '../styles/App.scss'

function App() {
  const [onPage, setOnPage] = useState('init');
  const [userData, setUserData] = useState(null);
  const [currentAuction, setCurrentAuction] = useState(null);
  const [calledFrom, setCalledFrom] = useState(null);
  const [currentEditedAuction, setCurrentEditedAuction] = useState(null);

  useEffect(() => {
    const storedOnPage = sessionStorage.getItem('onPage');
    if (storedOnPage) {
      setOnPage(storedOnPage);
    }

    const storedCurrentAuction = sessionStorage.getItem('currentAuction');
    if (storedCurrentAuction) {
      setCurrentAuction(storedCurrentAuction);
    }

    const storedUserDataString = sessionStorage.getItem('userData');
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString);
      setUserData(storedUserData);
    }
  }, [])
  

  return (
    <div className={`app-container-${onPage}`}>
    {onPage === 'init' && <InitPage setOnPage={setOnPage} userData={userData}/>}
    {onPage === 'signUp' && <SignUp setOnPage={setOnPage} setUserData={setUserData}/>}
    {onPage === 'signIn' && <SignIn setOnPage={setOnPage} setUserData={setUserData}/>}
    {onPage === 'profile' && <Profile userData={userData} setUserData={setUserData} setOnPage={setOnPage} setCurrentAuction={setCurrentAuction} setCalledFrom={setCalledFrom} 
    setCurrentEditedAuction={setCurrentEditedAuction}/>}
    {onPage === 'createAuction' && <CreateAuction setOnPage={setOnPage} userData={userData} setUserData={setUserData}/>}
    {onPage === 'auctionInfo' && <AuctionInfo setOnPage={setOnPage} auction_id={currentAuction} called_from={calledFrom} userData={userData} setUserData={setUserData}/>}
    {onPage === 'allAuctions' && <AllAuctions setOnPage={setOnPage} setCurrentAuction={setCurrentAuction} setCalledFrom={setCalledFrom} userData={userData}/>}
    {onPage === 'editAuction' && <EditAuction setOnPage={setOnPage} auction_id={currentEditedAuction} userData={userData} setUserData={setUserData}/>}
    </div>
  )
}

export default App;

import React, { useEffect, useState } from 'react';
import { ethers , utils} from "ethers";
// json NFT
import myEpicNft from "./utils/myEpicNFT.json"
// css 
import './styles/App.css';
import './styles/css.scss';
// images
import circles from "./img/cir.png"
import twitterLogo from './assets/twitter-logo.svg';
import cwbImg from "./img/cwb.png"
import drake_face_connected from "./img/drake_face_connected.png"
import drake_loading_face from "./img/drake_loading.png"
import close from "./img/close.png"
// HANDLE
const CLB_HANDLE = 'https://open.spotify.com/album/3SpBlxme9WbeQdI9kx7KAV?si=uUjyWI0mR2qQfVcUvE_ohg';
const GITHUB_HANDLE = 'mohamedsadiq';
const TWITTER_HANDLE = 'sadiq_moo';
// LINKS
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CLB_LINK = `${CLB_HANDLE}`;
const GITHUB_LINK = `https://twitter.com/${GITHUB_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/certified-web3-boy-ztzixwwkjb';
const TOTAL_MINT_COUNT = 21;

const CONTRACT_ADDRESS = "0xA41eDB02AAe7A9830F41F5E408002CCC8CC879a6";

const App = () => {
  
   const [currentAccount, setCurrentAccount] = useState("");
   const [rinkebyAlertMode, setRinkebyAlertMode] = useState(1);
   const [buttonsMode, setButtonsMode] = useState("mint");
   const [bottomHideAnimation, setBottomHideAnimation] = useState("20px");
   const [showEtherscanLink, setShowEtherscanLink] = useState(false);
   const [mintedNum, setMintedNum] = useState("0");
   const [ethLinkValue , setEthLinkValue] = useState("");
   const [celebrating , setCelebrating] = useState("none");
   
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
    
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
     
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }
  // Connect Wallet Function
  const connectWalletFun = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }
  // Setup our listener.
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
       
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });
        console.log("Setup event listener!")
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  // Mint cwb main function
  const mintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
        // loading
        console.log("Going to pop wallet now to pay gas...")
        setButtonsMode("loading")
        let nftTxn = await connectedContract.mintcwb(1, { value: utils.parseEther('0.00000001') });
        // mining
        setButtonsMode("mining")
        console.log("Mining...please wait.") 
        await nftTxn.wait();
        console.log(nftTxn);
        // congrats
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        let linkHash = nftTxn.hash;
        console.log("nftTxn : " + nftTxn.hash);
        // setShowEtherscanLink(true);
        setEthLinkValue(linkHash)
        // console.log(linkHash);
        setButtonsMode("congrats");
        setCelebrating("block");
        alreadyMintedFun()
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      
      console.log(error);
       // back to mint button
      setButtonsMode("mint")
    }
  }
   // Already Minted Function
   const alreadyMintedFun = async () =>{
     try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
        // how Cwb Lifted
        let ids = await connectedContract.howCwbLifted();
        setMintedNum(ids.toString())
        console.log("How cwb Lifted : " + mintedNum);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
   }

  
  // Render Methods
  // wallet Not Connected mode
  const walletNotConnected = () => {
    return (
      <button className="notConnectedButton" onClick={() => connectWalletFun()}>
        <span className="mode_text">not connected</span>
        <span className="mode_color">
          <div className="circle circle_notConnected"></div>
        </span>
      </button>
    )
  }
  // wallet Connected mode
  const walletConnected = () => {
    return (
      <button className="connectedButton">
        <span className="drake_face_connected">
          <img src={drake_face_connected}/>
        </span>
        <span className="mode_text">connected</span>
        <span className="mode_color">
          <div className="circle circle_Connected"></div>
        </span>
      </button>
    )
  }
  // connect To Wallet button
  const connectToWallet = () => {
    return (
      <button className="mintingButtons connectedToWallet" onClick={() => connectWalletFun()}>
        connect to wallet
      </button>
    )
  }
  // connect To Wallet button
  const mintCWB = () => {
 
    return (
      <button className="mintingButtons mintingButton" onClick={() => mintNft()}>
        mint your cwb
      </button>
    )
  }

  // Loading Button
  const loadingButton = () => {
    return (
      <button className="mintingButtons loadingButton">
        <span className="">loading to pay gas...</span>
      </button>
    )
  }
  // We're mining boy button
  const miningButtonProgress = () => {
    return (
      <button className="mintingButtons loadingButton loadingButton_progress">
        <span className="mode_text_minting">we're mining boy..</span>
        <span className="img_mode">
          <img src={drake_loading_face} />
        </span>
      </button>
    )
  }
  const ethLinkFun = () =>{
    return <p id="link_track"> 
    you can see your unique cwb on etherscan on this <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${ethLinkValue}`}>link 
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8L13 1" stroke="black" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M13 5.5V1.3C13 1.13431 12.8657 1 12.7 1H8.5" stroke="black" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M6.5 3.5H1.1C1.04477 3.5 1 3.54477 1 3.6V12.4C1 12.4552 1.04477 12.5 1.1 12.5H9.9C9.95523 12.5 10 12.4552 10 12.4V7" stroke="black" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
    </a>
    </p>
  }
   
  // Congrats Button
  const congratsButton = () => {
    return (
      <div>
      <button className="mintingButtons congratsButton">
        <span className="mode_text_congrats">congrats you minted cwb  🎉</span>
      
      </button>
      {ethLinkFun()}
      </div>
      
    )
  }

  // Already Minted Button 
    const alreadyMinted = () =>{
      if(mintedNum === "21"){
        return <span>all the cwb minted</span>
      }
      return <span><strong>{`${mintedNum}/21`}</strong> minted</span>
    }

 
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
   const rinkebyAlert = () => (
    <div className="rinkebyAlert" style={{
      opacity:rinkebyAlertMode,
      bottom:bottomHideAnimation
    }}>
      <div className="rinkebyAlert_p">
          please make sure you are connected to the rinkeby network on metamask!
      </div>
      <div className="rinkebyAlert_hide">
      <span onClick={() => hideRinkebyAlert()}>hide <img src={close}/></span>
      </div>
    </div>
  );
  const hideRinkebyAlert = () =>{
      setRinkebyAlertMode(0);
      setBottomHideAnimation("-30px")
  }

  const buttonsModFun = () => {
    if (buttonsMode === "mint"){
      return mintCWB()
    }else if (buttonsMode === "loading"){
      return  loadingButton()
    }else if (buttonsMode === "mining"){
      return miningButtonProgress()
    }  
    else if (buttonsMode === "congrats"){
     
      return congratsButton();
    }
  }
  const etherscanLink = () =>{
    
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    alreadyMintedFun();
  }, [mintedNum])
  alreadyMintedFun()
  return (
    <div className="App">
    <div style={{
      display:celebrating
    }}class="celebrating">
    <div class="confetti">
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>
      <div class="confetti-piece"></div>

</div>
    </div>
    <div id="circles">
    <img src={circles}/> 
    </div>
      <div className="container">
        <header>
          
          <div className="media_links">
            <div className="desktop_links">
              <a target="_blank" className="media_link" href={OPENSEA_LINK} >opensea</a>
              <a target="_blank" className="media_link" href={TWITTER_LINK}>twitter</a>
              <a target="_blank" className="media_link" href={CLB_LINK} >listen to clb</a>
             
            </div>
            <div className="mobile_number_minted">
              {alreadyMinted()}
            </div>
          </div>
          <div id="connectedOrNot">
          {currentAccount === "" ? walletNotConnected() : walletConnected()}
         
          </div>
        </header>
        <div id="content">
          <h1>Certified Web3 Boy</h1>
          <p>Each unique. Each beautiful. Mint your CWB NFT today! Only 21 available</p>
          <div className="cwbImg">
            <img src={cwbImg} />
          </div>
          <div>
           
            {currentAccount === "" ? connectToWallet() : buttonsModFun()}
          
          </div>
         
        </div>
        <footer>
        {rinkebyAlert()}
          <div className="container_footer">
          
            <div className="desktop_fotter">
              <div id="numberOfMinting">{alreadyMinted()}</div>
              <div id="github">
                <a target="_blank" href={GITHUB_LINK} >github</a>
              </div>
            </div>
        
             <div className="mobile_fotter">
               <a target="_blank" className="twitter_link" href={TWITTER_LINK}>twitter</a>
               <a target="_blank" className="clb_link" href={CLB_LINK} >listen to clb</a>
               <a target="_blank" className="github_link" href={GITHUB_LINK} >github</a>
             </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
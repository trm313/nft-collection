import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

import myEpicNft from './utils/MyEpicNFT.json';

import twitterLogo from './assets/twitter.png';

// Tailwind setup guide: https://replit.com/talk/learn/How-to-install-Tailwind-CSS/144218
import './styles/tailwind.css';
import './styles/misc.css';

// Components
import Banner from './components/Banner';
import MintButton from './components/MintButton';
import Cover from './components/Cover';
import NftGallery from './components/NftGallery';
import MintConfirmation from './components/MintConfirmation';

// Constants
import { CONTRACT_ADDRESS } from './constants';
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;
const RARIBLE_API = 'https://ethereum-api-staging.rarible.org/v0.1';

// const CONTRACT_ADDRESS = '0xf6e3a19Ec46CddcBda6d7a41A230Ec2032cE35fE';

//
// Rarible API: `${RARIBLE_API}/nft/items/${CONTRACT_ADDRESS}:${tokenId}/meta`

function App() {
	const [currentAccount, setCurrentAccount] = useState(null);
	const [mintedNFTs, setMintedNFTs] = useState([])
	const [userNFTCollection, setUserNFTCollection] = useState([]);
	const [isMintingInProgress, setIsMintingInProgress] = useState(false);

	// API Calls
	const getNftMetadata = async (tokenId) => {
		try {
			let res = await axios.get(`${RARIBLE_API}/nft/items/${CONTRACT_ADDRESS}:${tokenId}/meta`);
			return res.data;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	const getNftsByOwner = async (address) => {
		try {
			let res = await axios.get(`${RARIBLE_API}/nft/items/byOwner?owner=${currentAccount}&size=100`);
			console.log(res.data);
			setUserNFTCollection(res.data.items);
		} catch (error) {
			console.log(error);
		}
	}

	// Wallet Connection Functions
	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;
		if (!ethereum) {
			console.log("Must install MetaMask!");
			return;
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' });
		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log("Found an authorized account:", account);
			setCurrentAccount(account);
			// Add event listner for already connected accounts:
			setupNFTEventListener();
		} else {
			console.log("No authorized accounts found");
		}
	}

	const connectWallet = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				alert("MetaMask required");
				return;
			}

			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
			setCurrentAccount(accounts[0]);
			// Add event listener for newly connected accounts:
			setupNFTEventListener();
		} catch (error) {
			console.log(error);
		}
	}

	// Contract Interaction Functions
	const setupNFTEventListener = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

				connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
					console.log(from, tokenId.toNumber());
					setMintedNFTs(prevState => [
						...prevState,
						{
							address: from,
							tokenId: tokenId,
						}
					]);
					
				})
				console.log("Listening for events: NewEpicNFTMinted")
			}
		} catch (error) {
			console.log(error);
		}
	}

	const askContractToMintNft = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

				// Check user is on Rinkeby chain
				let chainId = await ethereum.request({ method: 'eth_chainId' });
				console.log("Connected to chain " + chainId);
				const rinkebyChainId = "0x4";
				if (chainId !== rinkebyChainId) {
					alert("Not connected to the Rinkeby Test Net");
					return;
				}

				// Execute NFT minting
				setIsMintingInProgress(true);
				console.log("Open wallet to pay for gas");
				let nftTxn = await connectedContract.makeAnEpicNFT();

				console.log("Mining...please wait.");
				await nftTxn.wait();

				console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
				setIsMintingInProgress(false);
			}
		} catch (error) {
			console.log(error);
		}
	}

	// Render Methods
	const renderNotConnectedContainer = () => (
		<button
			onClick={connectWallet} 
			className="btn-primary">
			Connect to Wallet
		</button>
	)

	const renderMintUI = () => (
		<MintButton 
			onClick={askContractToMintNft}
			disabled={isMintingInProgress}
			isLoading={isMintingInProgress}
			text="Mint New NFT"
			loadingText="Minting NFT..."
		/>
	)

	// Effects
	useEffect(() => {
		checkIfWalletIsConnected();
	}, [])

	useEffect(() => {
		if (currentAccount) {
			getNftsByOwner();
		}
	}, [currentAccount, mintedNFTs])

  return (
    <div className="w-100 min-h-screen flex flex-col items-center text-stone-800">
				<Banner />
				<div className="max-w-7xl flex flex-col px-8 items-center">
					<Cover />

					<div className="flex items-center justify-center">
						{!currentAccount ? 
							renderNotConnectedContainer() : 
							renderMintUI()
						}		
						<a 
							className="btn my-1 ml-4"
							target="__blank" 
							href={`https://rinkeby.rarible.com/collection/${CONTRACT_ADDRESS}/items`}
						>
							View Collection
						</a>
					</div>
					

					<div className="flex flex-col my-4">
						{ mintedNFTs.map(data => (
							<MintConfirmation 
								data={data} 
								viewUrl={`https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${data.tokenId.toNumber()}`}
							/>
						))}
					</div>
					
					<NftGallery 
						account={currentAccount} 
						nfts={userNFTCollection} 
					/>
				</div>
    </div>
  );
}

export default App;

import React from 'react';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

import NftItem from './NftItem';

const NftGallery = ({ account, nfts = [] }) => {
	return (
		<div className="flex flex-col mt-12 px-8">
			<div className="flex items-center justify-between">
				<h2 className="text-4xl">My NFT Collection</h2>
				<a 
					className="btn my-1"
					target="__blank" 
					href={`https://rinkeby.rarible.com/user/${account}`}
				>
					View All
				</a>
			</div>
			
			{ nfts.length > 0 ? (
				<div className="flex flex-wrap">
					{ nfts.map(nft => (
						<NftItem key={`nft-${nft.id}`} nft={nft} />
					))}
				</div>
			) : (
				<div className="flex justify-center items-center">
					<p>No NFTs found for user</p>
				</div>
			)}
			
		</div>
	)
}

export default NftGallery;
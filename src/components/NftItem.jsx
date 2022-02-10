import React from 'react';

const NftItem = ({ nft }) => {
	return (
		<div className="w-64 flex flex-col my-2 mx-2 p-4 bg-white text-stone-800 rounded-xl">
			<div className="flex flex-col mb-2">
				<p className="text-lg font-bold text-stone-600">{nft.meta.name}</p>
				<p className="text-xs">{nft.meta.description}</p>
			</div>
			<div className="flex justify-between my-2">
				<p className="text-xs">{nft.mintedAt}</p>
				<p className="text-md font-bold bg-stone-300 py-1 px-2 rounded-lg">#{nft.tokenId}</p>
			</div>
			<div className="flex">
				<img src={nft.meta.image.url.ORIGINAL} />
			</div>
		</div>
	)
}

export default NftItem;
import React from 'react';

const MintConfirmation = ({ data, viewUrl }) => {
	return (
		<div className="flex flex-col bg-stone-200 rounded-lg text-stone-800 p-8">
			<p className="text-lg">Your NFT has minted!</p>
			<p><strong>Address:</strong> {data.address}</p>
			<p><strong>Token ID:</strong> {data.tokenId.toNumber()}</p>
			<a className="btn" target="__blank" href={viewUrl}>View on Rarible</a>
		</div>
	)
}

export default MintConfirmation;
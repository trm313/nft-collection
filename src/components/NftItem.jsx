import React from 'react';
import { format, formatDistance, formatRelative, subDays, differenceInMinutes } from 'date-fns'


const NftItem = ({ nft }) => {
	return (
		<div className="relative w-64 flex flex-col my-2 mx-2 p-6 bg-white text-stone-800 rounded-xl border-2 border-stone-100">
			
			<div className="flex flex-col mb-2">
				<p className="text-lg font-bold text-stone-600">{nft.meta.name}</p>
				<p className="text-xs">{nft.meta.description}</p>
			</div>
			<div className="flex justify-between my-2">
				<div className="flex items-center">
					<p className="text-xs">{formatDistance(new Date(nft.mintedAt), new Date(), { addSuffix: true })}</p>
					{ differenceInMinutes(new Date(), new Date(nft.mintedAt)) < 5 && (
						<span className="bg-green-300 text-xs uppercase py-1 px-2 ml-2 rounded-lg">NEW</span>
					) }
				</div>
				<p className="text-md font-bold bg-stone-200 py-1 px-2 rounded-lg">#{nft.tokenId}</p>
			</div>
			<div className="flex">
				<img src={nft.meta.image.url.ORIGINAL} />
			</div>
		</div>
	)
}

export default NftItem;
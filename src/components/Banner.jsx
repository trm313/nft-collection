import React from 'react';

const Banner = () => {
	return (
		<div className="flex justify-center items-center w-full bg-stone-200 text-stone-800">
			<span>Contract Network:</span>
			<span className="bg-orange-400 rounded-full">Rinkeby</span>
		</div>
	)
}

export default Banner;
import React from 'react';

const Banner = () => {
	return (
		<div className="flex justify-center items-center w-full bg-purple-500 py-2 text-white">
			<span>Contract Network:</span>
			<span className="ml-4 bg-purple-400 rounded-full text-sm uppercase py-1 px-3">Rinkeby</span>
		</div>
	)
}

export default Banner;
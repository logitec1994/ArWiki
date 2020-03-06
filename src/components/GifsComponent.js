import React from 'react'

import GifComponent from './GifComponent'

export default class GifsComponent extends React.Component {
	render() {
		if(this.props.data.length === 0) {
			// animation here
			return <h6>Loading...</h6>
		} else {
			let id = 1;
			const AllGifsComponents = this.props.data.map(gif => <GifComponent data = {gif} key = {id++} />)
			return (
				<div>
					{AllGifsComponents}
				</div>
			)
		}
	}
}

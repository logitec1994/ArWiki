import React from 'react'

export default class GifComponent extends React.Component {
	render() {
		return (
				<div data-id = {this.props.data.id} class = 'gifPost'>
					<span>Author: ${this.props.data.from}</span>
					<img align = 'middle' src = {this.props.data.txData.gif}></img>
					<div class = 'tags'>#{this.props.data.txData.tag}</div>
				</div>
		)
	}
}
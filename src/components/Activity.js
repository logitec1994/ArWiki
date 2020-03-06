
import React from 'react';

import Article from './Article'

// function that get 10 latest articles and update state every 1 min to view all new articles
import { getAllArticles, getAllLikes } from '../utils/arweave.js'

export default class Activity extends React.Component {
	constructor() {
		super()
		this.state = {
			latestArticles: [],
			allArticleLikes: []
		}
	}

	async componentDidMount() {
		const allArticles = await getAllArticles();

    
		try {
			var allArticleLikes = await getAllLikes(allArticles)
		} catch(e) {
			console.log(e)
		}
		this.setState({
			allArticleLikes: allArticleLikes,
			latestArticles: allArticles
		})
	}

	render() {
		return (
			<div>
				<div className = "pageHeader">
					<div className = 'container'>
						<div className = "h1Header">
							<h1>Recent Activity</h1>
						</div>
					</div>
				</div>
				<div className ='container'>
					{/* show loading screen */}
					{this.state.latestArticles.length > 0 ? this.state.latestArticles.map((article,index) => {
						const likesData = this.state.allArticleLikes.find(tx => tx.article === article.url)
						{/*console.log(article.url)*/}
						return(<Article key = {index} data = {article} likesData={likesData}/>)}) 
						: "loading..."
					}
				</div>
			</div>
		)
	}
}
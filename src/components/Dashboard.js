import React from 'react'
import { Link } from 'react-router-dom'

import { arweave, getDataByAddress, getAllLikes } from '../utils/arweave.js'
import Article from './Article'

// getting all info about wallet
export default class Dashboard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			userArticles: [],
			userComments: [],
			userLikes: [],
			allArticleLikes: [],
			address: "",
		}
	}

	async componentDidMount() {
		// get user artcles
		// get user likes
		// get user comments
		let userData = sessionStorage.getItem('walletData');
		userData = JSON.parse(userData)
		const address = await arweave.wallets.jwkToAddress(userData)
		try {
			var allUserData = await getDataByAddress(address)
		} catch(e) {
			console.log(e)
		}
		if(allUserData.articles.length > 0) {
			try {
				var allArticleLikes = await getAllLikes(allUserData.articles)
			} catch(e) {
				console.log(e)
			}
		}
		if(allUserData) {
			this.setState({
				address,
				userArticles: allUserData.articles || [],
				userComments: allUserData.comments || [],
				userLikes: allUserData.likes || [],
				allArticleLikes: allArticleLikes || [],
			})
		}

	}

	render() {
		const { userArticles, userLikes, userComments } = this.state;
		console.log(userLikes)
		return (

				<div className = "dashboard">
					<div className = "pageHeader">
						<div className = 'container'>
							<div className = "h1Header">
								<h1>{this.state.address}</h1>
							</div>
						</div>
					</div>
					<div className ="container">
						<div className = "dashboardBlock">
							
							<div className = "dashboardArticles">
								<p className="dashHeader">Articles</p>
								{userArticles.length > 0 ? userArticles.map((article,index) => {
									const likesData = this.state.allArticleLikes.find(tx => tx.article === article.url)
									{/*console.log(article.url)*/}
									return(<Article key = {index} data = {article} likesData={likesData}/>)}) 
									: "loading..."
								}
							</div>
							<div className = "dashboardActions">
								<div className="dashboardLikes">
									<p className="dashHeader">Likes</p>
									{userLikes.length > 0 ? userLikes.map((like, index) => <DashboardLikes key={index} {...like}/>) : "No Likes"}
								</div>
								<div className="dashboardComments">
									<p className="dashHeader">Comments</p>
									{userComments.length > 0 ? userComments.map((comment, index) => <DashboardComments key={index} {...comment}/>) : "No Comments"}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
	}
}


class DashboardLikes extends React.Component {
	render() {
		return (
			<div className="likeBlock">
				<Link to = {`/article/${this.props.articleUrl}`} >
					<div>
						<span>{this.props.articleUrl} </span>
						<span> {this.props.data.like ?<img alt = "dislike" src = '../icons/like.png' /> : <img alt = "dislike" src = '../icons/dislike.png' />}</span> 
					</div>
				</Link>
			</div>
			)
	}
}

class DashboardComments extends React.Component {
	render() {
		return (
			<div className="commentBlock">
				<Link to = {`/article/${this.props.articleUrl}`} >
					<div>
						<span>{this.props.articleUrl}</span>
						<p><span style = {{color: "#7a7a7a"}}>Text:</span> <span style = {{fontSize: "16px"}}>{this.props.data.commentText}</span></p> 
					</div>
				</Link>
			</div>
			)
	}
}
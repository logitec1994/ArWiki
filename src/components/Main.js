import React from 'react'
import { Link } from 'react-router-dom'

export default class Main extends React.Component {
	constructor() {
		super()
		this.state = {
		}
	}

	async componentDidMount() {
		// download latest 3 article
	}

	render() {
		
		return (
			<div style= {{backgroundColor: "#f3f3f3", minHeight: "1000px"}}>
				<div className = "pageHeader">
					<div className = 'container'>
						<div className = "h1Header">
							<h1>Ar-Wiki</h1>
						</div>
					</div>
				</div>
				<div style= {{width: "100%", height: "100%"}} className="container">
					<div className="mainPage">
						<h2>
							<span style = {{fontSize: "35px"}}>The Ar-Wiki for Everything, Everyone, Everywhere.</span>
						</h2>
						<h4>
							<div>
							Ar-Wiki offers a space for you to dive into anything you find interesting, connect with people who share your interests, and contribute your own perspective.
							</div>
						</h4>
						<div>
							<Link to = {"/create-article"}>
								<button className="startContributing">
									Start Contibuting
								</button>
							</Link>
							<Link to = {"/activity"}>
								<button className ="activity">
									See Activity
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}


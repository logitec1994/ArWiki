
import React from 'react'
import { Link } from 'react-router-dom'

export default class Article extends React.Component {
	render(){
		const { from, url } = this.props.data;
		const { likesData } = this.props;
		const { title, img, mainText } = this.props.data.txData;
		// console.log(mainText)
		let tempDiv = document.createElement("div");
		tempDiv.innerHTML = mainText;
		const basicText = tempDiv.innerText
		return (
				<div>

					<div className = "article">
						<div className = "articleBlock">
							<Link to={`/article/${url}`} >
								<div className = "articleImg">
									<img alt = "articleImg" src={img || '../icons/imgblank.png'} />
								</div>
							</Link>
							<div className = "articleText">
								<Link to={`/article/${url}`} >
									<div className = "articleTitle">
										<span>{title}</span>
									</div>
									<div className = "articleDesc">
										<span>{basicText.length > 180 ? basicText.substring(0, 150)+"..." : basicText}</span>
									</div>
								</Link>
								<div className = "articleDetails">

									<div className = "editor">
										 Posted by: <span>{from}</span>
									</div>
									{/*<div className = "time">|
										a few seconds ago
									</div>*/}
									<div className = "numberOfWords">| 
										{" " +mainText.split(" ").length} words 
									</div>
								</div>

							</div>
						</div>
						
						
						
						<div className = "articleActions"> 
							<div className = "like">
								<div><img alt = "like" src= '../icons/like.png' /></div>
								<div><p>{likesData && likesData.likes || 0}</p></div>
							</div>
							<div className = "dislike">
								<div><img alt = "dislike" src = '../icons/dislike.png' /></div>
								<div><p>{likesData && likesData.dislikes || 0}</p></div>
							</div>
						</div>

					</div>				

				</div>
			)
	}
}


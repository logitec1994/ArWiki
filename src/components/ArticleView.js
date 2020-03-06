import React from 'react'

import { Modal, Button, Input } from 'antd';
import { getTxData, getArticleComments, getArticleLikes, postComment, createTx, postTx } from '../utils/arweave.js'
import ArticleComment from './ArticleComment';
const TextArea = Input;
export default class ArticleView extends React.Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		this.state = {
			url: match.params.address,
			title: "",
			mainText: "",
			commentText: "",
			modalVisible: false,
			modalTitle: "",
			modalText: "",
			confirmVisible: false,
			likeVisible: false,
			dislikeVisible: false,
			transaction: {},
			articleComments: [],
			articleLikes: {}
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleModal = this.handleModal.bind(this);
		this.handleSubmitComment = this.handleSubmitComment.bind(this);
		this.handleModalConfirm = this.handleModalConfirm.bind(this)
		this.makeComment = this.makeComment.bind(this)
		// like/dislike stuff
		this.handleDislikeModal = this.handleDislikeModal.bind(this) 
		this.handleLikeModal = this.handleLikeModal.bind(this)
		this.makeLike = this.makeLike.bind(this)
		this.makeDislike = this.makeDislike.bind(this)

	}

	
	async componentDidMount() {
		const { url } = this.state;
		// download article info by tx id
		try {
			var articleData = await getTxData(url)
		} catch(e) {
			alert("Cannot get article info")
			console.error(e)
			return
		}
		
		const {title, img, mainText} = articleData.txData;
		try {
			var articleComments = await getArticleComments(url);
		} catch(e) {
			console.log(e)
		}
		try {
			var articleLikes = await getArticleLikes(url)
		} catch(e) {
			console.log(e)
		}
		
		this.setState({
			title,
			mainText,
			img,
			articleLikes: articleLikes || {},
			articleComments: articleComments || []
		})
	}

	// combine this 2 functions in 1
	handleDislikeModal(e) {
		this.setState({
			dislikeVisible: !this.state.dislikeVisible
		})
	}


	handleLikeModal(e) {
		this.setState({
			likeVisible: !this.state.likeVisible
		})
	}
	async makeLike () {
		const { url } = this.state;
		let userData = sessionStorage.getItem('walletData');
		userData = JSON.parse(userData)
		const data = JSON.stringify({ 
			like: 1
		})
		const txFee = await createTx(userData, data, 'likeOrDislike', url)
		if(!txFee) return alert("Error during tx creationg");
		const isSuccess = await postTx(userData, txFee);
		if(isSuccess) {
			this.setState({
				likeVisible: false,
				modalVisible: true,
				modalTitle: "Success",
				modalText: "Transaction send, wait the confirmations to view your like on the Ar-wiki."
			})
		}
	}
	async makeDislike() {
		const { url } = this.state;
		let userData = sessionStorage.getItem('walletData');
		userData = JSON.parse(userData)
		const data = JSON.stringify({ 
			dislike: 1
		})
		const txFee = await createTx(userData, data, 'likeOrDislike', url)
		if(!txFee) return alert("Error during tx creationg");
		const isSuccess = await postTx(userData, txFee);
		if(isSuccess) {
			this.setState({
				dislikeVisible: false,
				modalVisible: true,
				modalTitle: "Success",
				modalText: "Transaction send, wait the confirmations to view your dislike on the Ar-wiki."
			})
		}
	}

	handleModalConfirm(e) {
		this.setState({
			confirmVisible: !this.state.confirmVisible
		})
	}

	handleChange(e){
		const {value, name} = e.target;
		this.setState({
			[name]: value
		})
	}

	handleModal() {
		this.setState({
			modalVisible: !this.state.modalVisible,
		})
	}

	async handleSubmitComment() {
		if(!this.state.commentText) {
			this.setState({
				modalVisible: true,
				modalText: "Please provide comment text before post.",
				modalTitle: "Error"
			})
		} else {
			const txFee = await this.getTxFee()
			if(txFee >= this.props.balance) {
				this.setState({
					modalVisible: true,
					modalText: `Insufficient balance. Transaction Fee (${txFee} AR) is more than your current balance.`,
					modalTitle: "Error"
				})
			} else {
				this.setState({
					confirmVisible: true,
					txFee,
				})
			}
		}
	}

	async getTxFee() {
		let userData = sessionStorage.getItem('walletData');
		const url = this.state.url;
		userData = JSON.parse(userData)
		const data = JSON.stringify({ 
			commentText: this.state.commentText,
		})
		const txFee = await createTx(userData, data, 'comment', url)
		this.setState({
			transaction: txFee
		})
		if(txFee.success) {
			return txFee.data.fee
		} else {
			// show modal error?
		}
	}

	async makeComment() {
		let userData = sessionStorage.getItem('walletData');
		userData = JSON.parse(userData)
		const tx = this.state.transaction; // maybe change something here, tx.data or antoher
		const isSuccess = await postTx(userData, tx);
		if(isSuccess) {
			this.setState({
				commentText: '',
				confirmVisible: false,
				modalVisible: true,
				modalTitle: "Success",
				modalText: "Transaction send, wait the confirmations to view your article on the Ar-wiki."
			})
		} else {
			this.setState({
				confirmVisible: false,
				modalVisible: true,
				modalTitle: 'Error',
				modalText: "Transaction Failed, please try again"
			})
		}
	}

	render() {
		if(!this.state.title) {
			return (
					<div className = "container">
						<div>Loading...</div>
					</div>
				)
		}
		return (
			<div className = "createNewArticle">
				<div className = "pageHeader">
					<div className = 'container'>
						<div className = "h1Header">
							<h1>{this.state.title}</h1>
						</div>
					</div>
				</div>
				<div className = 'container'>
					<div className ="titleContainer">
						<input 
							readOnly
							id = "title"
							name = "title"
							value = {this.state.title}
							placeholder = "Input Title"
						/>
						<div className = "articleActions"> 
							<div onClick = {this.handleLikeModal} className = "like">
								<div><img alt = "like" src= '../icons/like.png' /></div>
								<div><p>{this.state.articleLikes.likes || 0}</p></div>
							</div>
							<div onClick = {this.handleDislikeModal} name = "dislike" className = "dislike">
								<div><img alt = "dislike" src = '../icons/dislike.png' /></div>
								<div><p>{this.state.articleLikes.dislikes || 0}</p></div>
							</div>
						</div>
					{/* combine in one modal ?*/}
						<Modal centered
		          title = "Confirm Like"
		          visible = {this.state.likeVisible}
		      		onCancel = {this.handleLikeModal}
		      		onOk = {this.makeLike}
		      		okText = "Like"
			       >	
		        <p style = {{fontSize: '16px'}}>This is your tx cost for like: <span className="arBalance">0.000008700746</span> AR.</p>
						</Modal>
						<Modal centered
		          title = "Confirm Dislike"
		          visible = {this.state.dislikeVisible}
		      		onCancel = {this.handleDislikeModal}
		      		onOk = {this.makeDislike}
		      		okText = "Dislike"
			       >
		        <p style = {{fontSize: '16px'}}>This is your tx cost for dislike: <span className="arBalance">0.000008708851</span> AR.</p>
						</Modal>

					</div>
					<div className = "articleContainer">
						<div className="markdownText" dangerouslySetInnerHTML={{__html: this.state.mainText}}></div>
						<div className = "articleInfo">
							<img 
								alt = 'imageArticle'
								className = "imageBlank"
								src= {this.state.img || '../icons/imgblank.png'} 
							/>
						
							<div className = "urlSlug">
								<div style = {{width: "30%", color: "rgb(45, 45, 45)" }}>URL Slug</div>
									<input
										style = {{width: "70%"}} 
										id = "url"
										name = "shortUrl"
										value = {this.state.shortUrl}
										placeholder = "url"
									/>
							</div>
						</div>
					</div>
					{/* separeted from create article blocks */}
					{(this.state.articleComments.length > 0) ? this.state.articleComments.map((comment,index) => <ArticleComment key = {index} comment={comment} />) : "No comments"}
					<div className ="commentContainer">
						<textarea
							className = "commentTextarea"
							onChange = {this.handleChange}
							value = {this.state.commentText}
							placeholder = "Put your comment here"
							name = "commentText"
							rows = "4"
						/>
						<Button 
							onClick = {this.handleSubmitComment}
							type="primary">POST
						</Button>
						<Modal centered
		          title = "Confirm Transaction"
		          visible = {this.state.confirmVisible}
		      		onCancel = {this.handleModalConfirm}
		      		onOk = {this.makeComment}
		      		okText = "Confirm"
			       >
		        <p style = {{fontSize: '16px'}}>This is your tx cost for comment: <span className="arBalance">{this.state.txFee}</span> AR.</p>
						</Modal>

						<Modal centered
							footer = {null}
		          title = {this.state.modalTitle}
		          visible = {this.state.modalVisible}
		      		onCancel = {this.handleModal}
			       >
		        <p style = {{fontSize: '16px'}}>{this.state.modalText}</p>
						</Modal>
					</div>				
				
				</div>
			</div>
			)
	}
}


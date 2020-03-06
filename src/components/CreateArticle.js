
import React from 'react'

import { Modal, Button } from 'antd'

import  LoadImage  from '../utils/LoadImage.js'
import { createTx, postTx } from '../utils/arweave.js'
import 'react-quill/dist/quill.snow.css';
import 'antd/dist/antd.css';

export default class CreateArticle extends React.Component {

	constructor(){
		super()
		this.state = {
			modalAddPhotoVisible: false,
			modalVisible: false,
			modalTitle: "",
			confirmVisible: false,

			transaction: {},
			txFee: 0,
			img: "", // will add later
			title: "",
			modalText: "",
			imgUrl: "",


		}
		this.handleChange = this.handleChange.bind(this)
		this.showModalImage = this.showModalImage.bind(this)
		this.handleImgImport = this.handleImgImport.bind(this)
		this.handleSubmitArticle = this.handleSubmitArticle.bind(this)
		this.handleModal = this.handleModal.bind(this)
		this.handleModalConfirm = this.handleModalConfirm.bind(this)
		this.sendTx = this.sendTx.bind(this);
	}

	handleChange(e){
		const {value, name} = e.target;
		this.setState({
			[name]: value
		})
	}

	showModalImage(e) {
		this.setState({
			modalAddPhotoVisible: !this.state.modalAddPhotoVisible
		})
	}
	//  combine this
	handleModal(e) {
		this.setState({
			modalVisible: !this.state.modalVisible
		})
	}
	handleModalConfirm(e) {
		this.setState({
			confirmVisible: !this.state.confirmVisible
		})
	}

	async handleImgImport(e) {
		try {
			const imgUrl = await LoadImage(e.target.files[0])
			if(imgUrl) {
				this.setState({
					imgUrl,
					modalAddPhotoVisible: !this.state.modalAddPhotoVisible
				})
			} else {
				this.setState({
					modalAddPhotoVisible: !this.state.modalAddPhotoVisible,
					modalVisible: true,
					modalText: "Choose another image to download.",
					modalTitle: "Error"
				})
			}
		} catch(e) {
			console.log(e)
		}
	}
	// 
	async handleSubmitArticle() {
		const mainText = document.getElementsByClassName("note-editable")[0].innerHTML;
		if(!this.state.title || mainText == "<p>&nbsp;</p>" || mainText == "<p><br></p>") {
			this.setState({
				modalVisible: true,
				modalText: "Please provide title and text before submit.",
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

	async sendTx() {
		// send tx here
		let userData = sessionStorage.getItem('walletData');
		userData = JSON.parse(userData)

		const tx = this.state.transaction; // maybe change something here, tx.data or antoher
		console.log(tx)
		const isSuccess = await postTx(userData, tx);
		if(isSuccess) {
			this.setState({
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

	async getTxFee() {
		const userData = JSON.parse(this.props.userData);
		const mainText = document.getElementsByClassName("note-editable")[0].innerHTML;
		const data = JSON.stringify({ 
			title: this.state.title,
			img: this.state.imgUrl,
			mainText
		})
		const txFee = await createTx(userData, data, 'article','')
		this.setState({
			transaction: txFee
		})
		if(txFee.success) {
			return txFee.data.fee
		} else {
			// show modal error?
		}
	}

	componentDidMount() {

	}

	render() {

		return (
			<div className = "createNewArticle">
				<div className = "pageHeader">
					<div className = 'container'>
						<div className = "h1Header">
							<h1>Edit Article</h1>
						</div>
					</div>
				</div>
				<div className = 'container'>
					<div className ="titleContainer">
						<input 
							id = "title"
							name = "title"
							value = {this.state.title}
							onChange = {this.handleChange}
							placeholder = "Input Title"
						/>
					</div>
					<div className = "articleContainer">
						<div id="summernote"></div>
{/*						<input 
							id = "mainText"
							name = "mainText"
							value = {this.state.mainText}
							onChange = {this.handleChange}
							placeholder = "Input Text"
						/>*/}
						<div className = "articleInfo">
							<img 
								alt = "imageBlank"
								onClick = {this.showModalImage}
								className = "imageBlank"
								src= {this.state.imgUrl || '../icons/imgblank.png'} 
							/>
							<Modal    
								footer = {null}
			          title = "Add Main Photo"
			          visible = {this.state.modalAddPhotoVisible}
			          onCancel = {this.showModalImage}

			        >
			        	<p style = {{marginBottom: "0px"}}>Choose a new image</p>
			        	<p style = {{fontSize: "12px"}}>(Image must be less than 3mb)</p>

    						<div className="row">
			            <div className="col s12">
			              <div className="file-input">
			              	<img
			                	alt = "imageBlank"
			                	onClick = {this.triggerInput}
												src = '../icons/imageblank.png' 
											/>
			                <input type="file"  accept="image/*" id="keyfile" onChange = {this.handleImgImport}/>

			              </div>
			            </div>
			          </div>
								
							</Modal>
							<div className = "urlSlug">
								<div style = {{width: "30%", color: "rgb(45, 45, 45)" }}>URL Slug</div>
									<input
										style = {{width: "70%"}} 
										id = "url"
										name = "shortUrl"
										value = {this.state.shortUrl}
										onChange = {this.handleChange}
										placeholder = "url"
									/>
							</div>
						</div>
					</div>
					<div className = "buttonSubmit">
						<Button 
							id = "postArticle"
							className = "ant-btn ant-btn-primary"
							onClick = {this.handleSubmitArticle}>
							Submit
						</Button>

						<Modal centered
							footer = {null}
		          title = {this.state.modalTitle}
		          visible = {this.state.modalVisible}
		      		onCancel = {this.handleModal}
			       >
		        <p style = {{fontSize: '16px'}}>{this.state.modalText}</p>
						</Modal>
						<Modal centered
		          title = "Confirm Transaction"
		          visible = {this.state.confirmVisible}
		      		onCancel = {this.handleModalConfirm}
		      		onOk = {this.sendTx}
		      		okText = "Confirm"
			       >
		        <p style = {{fontSize: '16px'}}>This is your tx cost: <span className="arBalance">{this.state.txFee}</span> AR.</p>
						</Modal>

					</div>
					
				</div>
			</div>
			)
	}
}


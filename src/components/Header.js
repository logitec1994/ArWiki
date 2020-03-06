
import React from 'react'
import { Modal, Button } from 'antd';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {

	state = { 
		visible: false,
		loginVisible: false
	}

	// Combine somehow??

	showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showLoginModal = () => {
    this.setState({
      loginVisible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleLoginCancel = e => {
  	this.setState({
  		loginVisible: false,
  		visible: false
  	})
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

	formatAddress(address) {
		const len = address.length;
		const shortAddress = address.substring(0, 6) + "..." + address.substring(len - 6, len);
		return shortAddress
	}

	render() {
		return (
			<div className = 'header'>
				<div className = 'container'>
					<div className= "navbarCustom">
						<div className="leftForm">
								<span className='title'><Link to={'/'}>Ar-Wiki</Link></span>
				      <input className="customInput" type="search" placeholder="Search..." />
				      <img alt="search" style = {{width: "17px", height: "17px"}}src = '../icons/search.png' />
				    </div>
						{this.props.isLogin ? 
							<div className="rightNav">
								{/* Main menu*/}
								<Link to={'/activity'}>Activity</Link>
								<Link to={'/create-article'}>Create Article</Link>
								
									<Link to={'/dashboard'}>{this.formatAddress(this.props.address)}
										<span className="arBalance">{Number(this.props.balance).toFixed(2)} AR</span>
									</Link>
								</div> 
								: <div className="rightNav">
										<a onClick = {this.showModal}>Create Article</a>
										<a onClick = {this.showLoginModal}>Login</a>
										<Link to = {"/about"}>About</Link>
										<Modal centered
											footer = {null}
											title = "Start Contributing on ArWiki"
											visible = {this.state.visible}
											onOk = {this.handleOk}
											onCancel = {this.handleCancel}
											
										>
											<p>To make an edit or create an article, you need an Arweave account. 
											You can sign up for a trial account using a arweave keys or create a new one _link</p>
											<Button type='primary' onClick = {this.showLoginModal}>Login</Button>
										</Modal>
										 <Modal centered
						          footer = {null}
						          title = "Login To ArWiki"
						          visible = {this.state.loginVisible}
						          onCancel = {this.handleLoginCancel}
						          onOk = {this.handleOk}
											
						        >
						          <div className="row">
						            <div className="col s12">
						              <div className="file-input">
						                <input type="file" id="keyfile" onChange = {this.props.handleChangeInput}/>
						                <div id="filedescription">Drop a keyfile to login</div>
						              </div>
						            </div>
						          </div>
						        </Modal>
									</div>
								}
					</div>
				</div>	
			</div>
		)
	}
}


					// <div className = 'app-title'>
					// 	<div>
					// 		<Link className = 'blue-button' to={`/`}><p>Ar-Wiki</p></Link>
					// 	</div>
					// 	<div className = 'login'>
					// 		<div className = 'accountData'>
								
					// 		</div>
					// 	</div>
					// </div>
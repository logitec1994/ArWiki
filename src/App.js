import React from 'react';
import './App.css';
import Header from './components/Header'
import Main from './components/Main'
// routes // maybe put it in separete folder
import Activity from './components/Activity';
import Dashboard from './components/Dashboard'
import CreateArticle from './components/CreateArticle';
import ArticleView from './components/ArticleView'

import LoadWallet from './utils/LoadWallet.js'
import { arweave, getBalance } from './utils/arweave.js'
import { HashRouter as Router, Route } from "react-router-dom";

import 'antd/dist/antd.css';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      isLogin: false,
      address: "",
      walletData: "",
      balance: null
    }
    this.handleChangeInput = this.handleChangeInput.bind(this)
  }

  async handleChangeInput(e) {
    try {
      const wallet = await LoadWallet(e.target.files[0])
      const walletData = JSON.parse(wallet)
      const address = await arweave.wallets.jwkToAddress(walletData)
      const balance = await getBalance(address)

      this.setState({
        isLogin: true,
        walletData,
        address,
        balance,
      })
      // set session data
      sessionStorage.setItem('isLogin', true);
      sessionStorage.setItem('address', address)
      sessionStorage.setItem('balance', balance)
      sessionStorage.setItem('walletData', JSON.stringify(walletData))
    } catch(e) {
      console.log(e)
    }
  }

  componentDidMount() {
    if(sessionStorage.getItem('isLogin')) {
      this.setState({
        isLogin: true,
        walletData: sessionStorage.getItem('walletData'),
        address: sessionStorage.getItem('address'),
        balance: sessionStorage.getItem('balance')
      })
    }
  }

  render() {
    return (

     <Router>
      <div className = 'wrapper'>
        <Header 
          isLogin= {this.state.isLogin} 
          balance = {this.state.balance}
          address = {this.state.address}
          handleChangeInput = {this.handleChangeInput}
        />
        <div className ='main'>
          <Route exact path="/" render={() => (<Main {...this.state}/>)} />
          <Route path="/activity" component={Activity} />
          <Route path="/dashboard" render = {() => (<Dashboard {...this.state}/>)} />

          <Route path="/article/:address" component = {ArticleView} />

          <Route path="/create-article" render = {() => (
            <CreateArticle 
              balance = {this.state.balance}
              address = {this.state.address} 
              userData = {this.state.walletData}
            />)} 
          />
          {/*// private routes, just like middleware*/}
         {/* {this.state.isLogin ? 
            <Route path="/create-article" component={CreateArticle} /> : "<div>user not logined</div>"
          }*/}
        </div>
        
      </div>
    </Router>
    )
  }
}

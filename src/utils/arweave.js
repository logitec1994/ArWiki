import Arweave from 'arweave/web'


const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,           
    protocol: 'https',  
    timeout: 20000,     
    logging: false,     
})

async function getBalance(wallet) {
	const balance = await arweave.wallets.getBalance(wallet);
	return arweave.ar.winstonToAr(balance)
}

async function getAddress(jwk) {
  const address = await arweave.wallets.jwkToAddress(jwk);
  return address;
}


async function getDataByAddress(address) {
  // get comments, get likes, get articles
  let userData = {
    articles: [],
    comments: [],
    likes: []
  }
  let txIds = []
  try {
    let userTxIds = await getTxs(address, 'dashboard');
    userTxIds.map(tx => txIds.push(getTxData(tx)))
    const res = await Promise.all(txIds)
    res.map(txType => {
      if(txType.txData.title) {
        // tag each article
        userData.articles.push(
          txType
        )
      } else if(txType.txData.commentText) {
        userData.comments.push({
          articleUrl: txType.tags.value,
          data: txType.txData
        })
      } else {
        userData.likes.push({
          articleUrl: txType.tags.value,
          data: txType.txData
        })
      }
    })
    return userData
  } catch(e) {
    console.log(e)
  }
}


async function createTx(jsonFile, data, type, txId) {
  if(jsonFile && data) {
    let transaction = {};

    try {
      transaction = await arweave.createTransaction({
        data: data
      }, jsonFile)
      switch(type) {
        case 'article':
          transaction.addTag('App-Name', 'ar-wiki');
          transaction.addTag('Type','article')
          break
        case 'comment': 
          transaction.addTag('App-Name', 'ar-wiki');
          transaction.addTag('Type','comment')
          transaction.addTag('Article', txId) // txId
          break
        case 'likeOrDislike':
          transaction.addTag('App-Name', 'ar-wiki')
          transaction.addTag('Type', 'likeOrDislike')
          transaction.addTag('Article', txId)
          break
      }
      const fee = await arweave.ar.winstonToAr(transaction.reward)
      
      return { 
        success: true, 
        data: {
          fee, 
          transaction
        }
      }
    } catch(e) {
      console.log(e)
      console.log("Error during tx creation")
      return { success: false, reason: e }
    }
  } else {
    return {success: false, reason: "No data"}
  }
}


async function getAllArticles() {
  let articlesList = [];
  try {
    var articleData = await getTxs('','articles')
    articleData.map(tx => articlesList.push(getTxData(tx)))
    const res = await Promise.all(articlesList)
    return res
  } catch (e) {
    console.log(e)
  }
}


async function postTx(jsonFile, tx) {
  if(jsonFile || tx) {
    try {     
      await arweave.transactions.sign(tx.data.transaction, jsonFile);
      await arweave.transactions.post(tx.data.transaction);
      return true
    } catch(e) {
      console.error(e)
      return false
    }
  }
}


// New code
async function getTxs(address, type) {
  let query = {};
  switch (type) {
    case 'articles':
      query = {
        op:'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'ar-wiki'
        },
        expr2: {  
          op: 'equals',
          expr1: 'Type',
          expr2: 'article'
        }
      }
      break
    case 'comment':
      query = {
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'ar-wiki'
        },
        expr2: {
          op:'and',
          expr1: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'comment'
          },
          expr2: {
            op: 'equals',
            expr1: 'Article',
            expr2: address
          }
        },
      }
      break
    case 'likeOrDislike': 
      query = {
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'ar-wiki'
        },
        expr2: {
          op:'and',
          expr1: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'likeOrDislike'
          },
          expr2: {
            op: 'equals',
            expr1: 'Article',
            expr2: address
          }
        },
      }
      break
    case 'dashboard':
      query = {
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'ar-wiki'
        },
        expr2: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        }
      }
      break
  }
  try{
    const getTxIds = await arweave.arql(query);
    return getTxIds
  } catch(err){
    console.log(err)
  }  
}

async function getTxData(url) {
  return new Promise(async (resolve,reject) => {
    try {
      const tx = await arweave.transactions.get(url)
      const tags = {};
      const txData = JSON.parse(tx.get('data', {decode: true, string: true}))
      
      tx.get('tags').forEach(tag => {
        
        tags.key = tag.get('name', {decode: true, string: true});
        tags.value  =tag.get('value', {decode: true, string: true});
      });
      const from = await arweave.wallets.ownerToAddress(tx.owner)
      resolve({
        url,
        from,
        txData,
        tags
      })
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

async function getArticleComments(address) {
  return new Promise(async (resolve, reject) => {
    let commentsList = [];
    try {
      const commentData = await getTxs(address, 'comment')
      commentData.map(tx => commentsList.push(getTxData(tx)))
      const res = await Promise.all(commentsList)
      resolve(res)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

async function getAllLikes(txIds) {
  return new Promise(async (resolve,reject) => {
    let articleLikes = [];
    try {
      txIds.map(txId => articleLikes.push(getArticleLikes(txId.url)))
      const res = await Promise.all(articleLikes);
      console.log(res)
      resolve(res)
    } catch(e) {
      console.log(e)
      reject(e)
    }
  })
}


async function getArticleLikes(address) {
  return new Promise(async (resolve, reject) => {
    let likesList = [];
    let result = {
      article: "",
      likes: 0,
      dislikes: 0
    };
    try {
      const likesData = await getTxs(address, 'likeOrDislike')
      likesData.map(tx => likesList.push(getTxData(tx)))
      const res = await Promise.all(likesList)
      res.map(likeOrDislike => {
        result.article = address
        if(likeOrDislike.txData.dislike) {
          result.dislikes++
        } else {
          result.likes++
        }
      })
      resolve(result)
    } catch (e) {
      console.log(e)
      reject(e)
    }
   
  })
}

// old code
async function getArticle(txId) {
  return new Promise( async (res,rej) => {
    try {
      const tx = await arweave.transactions.get(txId)
      const txData = JSON.parse(tx.get('data', {decode: true, string: true}))
      const from = await arweave.wallets.ownerToAddress(tx.owner)
      res({
        txId,
        from,
        txData
      })
    } catch (e) {
      console.log(e)
    }
  })
}


export { 
  getArticleComments,
  getArticleLikes,
  getTxData,
  getAllArticles,
  getAllLikes,
  createTx,
  postTx,
  arweave,
  getBalance, 
  getAddress,
  getDataByAddress,
}


import React from 'react';

export default class ArticleComment extends React.Component {
	render() {
		const { comment } = this.props;
		return (
			<div className ='comment'>
				<img alt ="avatar icon" className ='commentAvatar' src ='../icons/avatar.png'/>
				<div className='comText'>
					<p style = {{fontWeight:'bold',fontSize: '14px'}}>{comment.from}</p>
					<p style = {{marginTop: '8px',fontSize: '15px'}}>{comment.txData.commentText}</p> 
				</div>
			</div>
			)
	}
}
import React from 'react'

export default class LoginModal extends React.Component {
	render() {
		return (
			<div id = 'confirmModal' class = 'modal' tabindex="-1" roke ='dialog' aria-labelledby='confirmModal' aria-hidden='true'>
		  	<div class = 'modal-content'>
		  		<div class="modal-header">
		  			<h4 class = 'modal-title'>New Gif Post</h4>
		    		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		  		</div>
		  		<div class="modal-body">
		  			<div class = 'transactionFeeBlock'>
			  			<h6>Transaction Fee:</h6>
			  			<div id='transactionFee'></div>
		  			</div>
		  			<div class = 'transactionTagBlock'>
			  			<h6>Tag:</h6>
			  			<div id ='transactionTag'></div>
		  			</div>
		  			<div>
			  			<div id = 'transactionGif'></div>
			  		</div>
		  		</div>
		  		<div class='modal-footer'>
		  			<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
		  			<button type="button" id = 'confirmUpload' class="btn btn-primary">Confirm</button>
		  		</div>
		  	</div>
		  </div>
		)
	}
}
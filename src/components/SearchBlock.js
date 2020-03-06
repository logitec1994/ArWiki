import React from 'react'

export default class SearchBlock extends React.Component {
	render() {
		return (
			<div class = 'searchBlock'>
				<div class = 'container'>
					<div class = 'search-bar-wrapper'>
						<form class = 'navbar-form'>
							<div class ='input-group'>
								<input class = 'form-control' id ='search' type='text' placeholder="Search for GIFs" autocomplete="off" />
								<span class = 'input-group-btn'>
									<button class = 'btn btn-go' type='submit'>
										<img src='../icons/search.png' />
									</button>
								</span>
							</div>	
						</form>
					</div>
				</div>
			</div>
		)
	}
}
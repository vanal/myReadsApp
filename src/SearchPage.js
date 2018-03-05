import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import sortBy from 'sort-by';
import BookShelf from './Books/BookShelf';
import * as BooksAPI from './BooksAPI'

class SearchPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			query: '',
			books: []
		};
	}

	componentWillReceiveProps() {
		this.updateQuery(this.state.query);
	}

	updateQuery = (query) => {
		if (query !== '' && query.length > 0) {
			let result = [];
			//Make a request to the search api, remove white spaces from query
			BooksAPI.search(query.trim())
				.then((searchResults) => {
					result = searchResults && searchResults.length > 0
						&& searchResults.map(book => {
							//default set category to none
							book.shelf = 'none';
							//loop over books from main route
							this.props.books.forEach(passedInBooks => {
								if (passedInBooks.id === book.id) {
									book.shelf = passedInBooks.shelf;
								}
							});

							return book;
						});

					this.setState({
						books: result,
						query: query
					});

				}).catch((error) => {
				console.error(error);
			});
		} else {
			this.setState({query: '', books: []});
		}
	};

	render() {
		const {query, books} = this.state;
		const {currentCategory} = this.props;
		let showBooks = [], updatedShelfs = [];

		if (query) {
			if (books && books.length > 0) {
				showBooks = books;
				sortBy(showBooks, 'title');
				updatedShelfs = currentCategory.concat('none');
			} else {
				showBooks = [];
			}
		}

		return (
			<div className="search-books">
				<div className="search-books-bar">
					<Link to={{
						pathname: '/',
						state: {showSearchPage: false}
					}} className='close-search'>Close</Link>
					<div className="search-books-input-wrapper">
						<input type="text" placeholder="Search by title or author" value={this.state.query}
						       onChange={(event) => this.updateQuery(event.target.value)}/>
					</div>
				</div>
				<div className="search-books-results">
					<BookShelf books={showBooks} currentCategory={updatedShelfs}
					           onUpdateBookCategory={this.props.onUpdateBookCategory}/>
				</div>
			</div>
		)
	}
}

export default SearchPage
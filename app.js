// 1. Book Class: Represents a Book

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// 2. UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    //  For Each Loop used to loop through array to display book list using addBookToList method
    books.forEach((book) => UI.addBookToList(book));
  }
  // creates row to insert into tbody
  static addBookToList(book) {

    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');

    // backticks ` allow for variables inside string to fill up columns with book data
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    // appends row to book list 
    list.appendChild(row);
  }

  // creates a div, before the form, with a class of "alert alert-success" to flash if validation fails
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    //Vanish in 2 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = '';
    document.querySelector("#author").value = '';
    document.querySelector("#isbn").value = '';
  }

  // we want to remove the parent element(TR) of the parent element(TD) of the X button
  static deleteBook(element) {
    if(element.classList.contains('delete')) {
      element.parentElement.parentElement.remove();
    }
  }

}


// 5.  Store Class Methods: Handles Local Storage 
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}


// 3. Event: Display Books

// calls displaybooks once Dom is loaded
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=> {

  // Prevent actual submit
  e.preventDefault();

  //Get Form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Validations
  if(title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all felds', 'danger');
  } else {

      // Instatiate book
    const book = new Book(title, author, isbn);

    console.log(book)

    // Add Book to UI
    UI.addBookToList(book);

    // Add Book to store
    Store.addBook(book);

    // Show Success Message
    UI.showAlert('Book was successfully added', 'success');

    // Clear fields
    UI.clearFields();
  }
});

// 4. Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e)=>
{
  // Remove book from UI
  UI.deleteBook(e.target);

  // Remove book from storage
  // traverses through the dom to delete the ISBN which deletes the book entirely) 
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Delete Message
  UI.showAlert('Book was succesfully removed', 'success');
});
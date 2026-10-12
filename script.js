// Fetch stored books from localStorage and display them
window.onload = function () {
    displayUserBooks();
};

// Function to display the books the user has written
function displayUserBooks() {
    const publicBooksList = document.getElementById("publicBooksList");
    const privateBooksList = document.getElementById("privateBooksList");
    const storedBooks = JSON.parse(localStorage.getItem('userNovels')) || [];

    publicBooksList.innerHTML = ''; // Clear the public books list
    privateBooksList.innerHTML = ''; // Clear the private books list

    storedBooks.forEach((novel, index) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        bookElement.innerHTML = `
            <h3>${novel.title}</h3>
            <p><strong>Author:</strong> ${novel.author}</p>
            <p><strong>Privacy:</strong> ${novel.isPrivate ? "Private" : "Public"}</p>
            <button onclick="viewBook(${index})">View</button>
            <button onclick="openPasswordPrompt('edit', ${index})">Edit</button>
            <button onclick="openPasswordPrompt('delete', ${index})">Delete</button>
        `;

        if (novel.isPrivate) {
            privateBooksList.appendChild(bookElement);
        } else {
            publicBooksList.appendChild(bookElement);
        }
    });
}

// Function to view the book content (no password required)
function viewBook(index) {
    const storedBooks = JSON.parse(localStorage.getItem('userNovels')) || [];
    const novel = storedBooks[index];

    // Save the book data to localStorage so it can be accessed on the next page
    localStorage.setItem("currentBook", JSON.stringify(novel));

    // Redirect to the book view page (view-only page)
    window.location.href = "book-view.html?bookIndex=" + index;
}

// Event listener for the novel submission form
document.getElementById("novelForm").addEventListener("submit", function (event) {
    event.preventDefault();  // Prevent the default form submission to avoid page refresh

    // Get form inputs
    const title = document.getElementById("novelTitle").value;
    const author = document.getElementById("novelAuthor").value;
    const content = document.getElementById("novelContent").value;
    const savePrivately = document.getElementById("savePrivately").checked;
    const password = document.getElementById("novelPassword").value;

    // Create a novel object
    const novel = {
        title: title,
        author: author,
        content: content,
        isPrivate: savePrivately,
        password: password // Store the password securely
    };

    // Save novel to local storage
    const userNovels = JSON.parse(localStorage.getItem('userNovels')) || [];
    userNovels.push(novel);
    localStorage.setItem('userNovels', JSON.stringify(userNovels));

    // Display the updated list of books
    displayUserBooks();

    // Clear the form
    document.getElementById("novelForm").reset();
    alert("Your novel has been submitted!");
});

// Function to open the password prompt for editing or deleting the book
function openPasswordPrompt(action, bookIndex) {
    const enteredPassword = prompt("Please enter the password for this book:");

    const storedBooks = JSON.parse(localStorage.getItem('userNovels')) || [];
    const novel = storedBooks[bookIndex];

    if (enteredPassword === novel.password) {
        if (action === 'edit') {
            // Redirect to edit page (you can create an edit page if needed)
            window.location.href = "book-detail.html?bookIndex=" + bookIndex;
        } else if (action === 'delete') {
            const confirmation = confirm("Are you sure you want to delete this book?");
            if (confirmation) {
                storedBooks.splice(bookIndex, 1); // Remove the book from the array
                localStorage.setItem('userNovels', JSON.stringify(storedBooks));
                displayUserBooks(); // Re-render the books list
                alert("Book deleted!");
            }
        }
    } else {
        alert("Incorrect password. You cannot edit or delete this book.");
    }
}

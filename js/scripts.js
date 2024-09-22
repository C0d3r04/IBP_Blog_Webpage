document.addEventListener('DOMContentLoaded', () => {
    const blogForm = document.getElementById('blog-form');
    const blogContainer = document.getElementById('blog-container');
    let editingBlogId = null; // Keep track of the blog being edited

    // Fetch and display existing blogs on page load
    fetch('/blogs')
        .then(response => response.json())
        .then(data => {
            data.forEach(blog => addBlogToDOM(blog));
        });

    // Handle form submission for adding or updating a blog
    blogForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        const newBlog = { title, content };

        if (editingBlogId) {
            // If editing, update the existing blog
            fetch(`/updateBlog/${editingBlogId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBlog),
            })
            .then(response => response.json())
            .then(data => {
                updateBlogInDOM(data);
                blogForm.reset();
                editingBlogId = null; // Reset after editing
            });
        } else {
            // If not editing, add a new blog
            fetch('/addBlog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBlog),
            })
            .then(response => response.json())
            .then(data => {
                addBlogToDOM(data);
                blogForm.reset();
            });
        }
    });

    // Function to display a blog post in the DOM
    function addBlogToDOM(blog) {
        const div = document.createElement('div');
        div.classList.add('blog-post');
        div.setAttribute('data-id', blog.id);

        div.innerHTML = `
            <h3>${blog.title}</h3>
            <p>${blog.content}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        // Edit button event listener
        div.querySelector('.edit-btn').addEventListener('click', () => {
            const blogId = blog.id;
            editingBlogId = blogId;
            document.getElementById('title').value = blog.title;
            document.getElementById('content').value = blog.content;
        });

        // Delete button event listener
        div.querySelector('.delete-btn').addEventListener('click', () => {
            const blogId = blog.id;
            fetch(`/deleteBlog/${blogId}`, {
                method: 'DELETE',
            })
            .then(() => div.remove());
        });

        blogContainer.appendChild(div);
    }

    // Function to update the blog post in the DOM after editing
    function updateBlogInDOM(blog) {
        const blogDiv = document.querySelector(`.blog-post[data-id='${blog.id}']`);
        blogDiv.querySelector('h3').textContent = blog.title;
        blogDiv.querySelector('p').textContent = blog.content;
    }
});

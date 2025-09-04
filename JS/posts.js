addEventListener("DOMContentLoaded", async () => {
    const postsContainer = document.getElementById("postsContainer");
    const searchInput = document.getElementById("searchPosts");
    const addPostBtn = document.getElementById("addPostBtn");

    let posts = [];
    let filteredPosts = [];
    let users = await fetchUsers();

    const userMap = {};
    users.forEach(u => {
        userMap[u.id] = u.name;
    });

    async function loadPosts() {
        posts = await fetchPosts();
        filteredPosts = [...posts];
        renderPosts(filteredPosts);
        notify("success", "Posts loaded successfully!");
    }

    function renderPosts(postsToRender) {       // post rendering logic
        postsContainer.innerHTML = "";

        if (postsToRender.length === 0) {
            postsContainer.innerHTML = "<p>No posts found.</p>";
            return;
        }

        postsToRender.forEach(post => {
            const postCard = document.createElement("div");
            postCard.classList.add("post-card");

            postCard.innerHTML = `
        <div class="post-title">${post.title}</div>
        <div class="post-author">By: ${userMap[post.userId] || "Unknown User"}</div>
        <br>
        <div class="post-body">${post.body}</div>
        <br>
        <div class="post-actions">
          <button class="btn-view-comments" data-id="${post.id}">Comments</button>
          <button class="btn-edit-post" data-id="${post.id}">Edit</button>
          <button class="btn-delete-post" data-id="${post.id}">Delete</button>
        </div>
      `;

            postsContainer.appendChild(postCard);
        });
    }

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        filteredPosts = posts.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.body.toLowerCase().includes(query)
        );
        renderPosts(filteredPosts);
    });

    // 🔹 Populate users in Add Post form
    const userSelect = document.getElementById("newPostUser");
    users.forEach(u => {
        const option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.name;
        userSelect.appendChild(option);
    });

    // 🔹 Open Add Post Modal
    document.getElementById("addPostBtn").addEventListener("click", () => {
        document.getElementById("addPostModal").style.display = "flex";
    });

    // 🔹 Cancel Add Post
    document.getElementById("cancelAddPost").addEventListener("click", () => {
        document.getElementById("addPostModal").style.display = "none";
    });

    // 🔹 Submit Add Post
    document.getElementById("addPostForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("newPostTitle").value;
        const body = document.getElementById("newPostBody").value;
        const userId = parseInt(document.getElementById("newPostUser").value);

        const newPost = {
            id: Date.now(), // fake unique ID
            title,
            body,
            userId
        };

        // Add new post to the start
        filteredPosts.unshift(newPost);
        renderPosts(filteredPosts, users);

        notify("success", "New post added!");
        document.getElementById("addPostModal").style.display = "none";
        e.target.reset();
    });

    loadPosts();

});

postsContainer.addEventListener("click", async (e) => {
    const postId = e.target.dataset.id;

    // View Comments
    if (e.target.classList.contains("btn-view-comments")) {
        const comments = await fetchComments(postId); // from api.js
        toggleComments(postId, comments);
    }

    // Edit Post
    if (e.target.classList.contains("btn-edit-post")) {
        editPost(postId);
    }

    // Delete Post
    if (e.target.classList.contains("btn-delete-post")) {
        deletePost(postId);
    }
});

function toggleComments(postId, comments) {
    let postCard = document.querySelector(`.post-card .btn-view-comments[data-id="${postId}"]`).closest(".post-card");
    let existingComments = postCard.querySelector(".comments");

    if (existingComments) {
        existingComments.remove(); // toggle off
        return;
    }

    const commentsDiv = document.createElement("div");
    commentsDiv.classList.add("comments");

    commentsDiv.innerHTML = comments.map(c => `
    <div class="comment">
      <strong>${c.name}</strong> (${c.email})
      <p>${c.body}</p>
    </div>
  `).join("");

    postCard.appendChild(commentsDiv);
}

function editPost(postId) {
    const postCard = document.querySelector(`.btn-edit-post[data-id="${postId}"]`).closest(".post-card");
    const titleEl = postCard.querySelector(".post-title");
    const bodyEl = postCard.querySelector(".post-body");

    const newTitle = prompt("Edit Title:", titleEl.textContent);
    const newBody = prompt("Edit Body:", bodyEl.textContent);

    if (newTitle && newBody) {
        titleEl.textContent = newTitle;
        bodyEl.textContent = newBody;
        notify("success", "Post updated successfully!");
    }
}

function deletePost(postId) {
    const postCard = document.querySelector(`.btn-delete-post[data-id="${postId}"]`).closest(".post-card");
    postCard.remove();
    notify("warning", `Post ${postId} deleted!`);
}

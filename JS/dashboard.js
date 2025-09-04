document.addEventListener("DOMContentLoaded", async () => {
  try {
    const users = await fetchUsers();
    document.getElementById("userCount").textContent = users.length;

    const posts = await fetchPosts();
    document.getElementById("postCount").textContent = posts.length;

    // All comments (from all posts)
    showLoader();
    const res = await fetch("https://jsonplaceholder.typicode.com/comments");
    const comments = await res.json();
    hideLoader();
    document.getElementById("commentCount").textContent = comments.length;

    notify("success", "Dashboard loaded!");
  } catch (err) {
    notify("error", "Failed to load dashboard!");
  }
});
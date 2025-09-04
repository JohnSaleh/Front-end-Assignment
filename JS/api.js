const API_BASE = "https://jsonplaceholder.typicode.com";
const API_USERS = API_BASE + "/users";
const API_POSTS = API_BASE + "/posts";
const API_COMMENTS = API_BASE + "/comments?postId=";


async function fetchUsers() {
  try {
    const response = await fetch(API_USERS);

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data; // array of users

  } catch (error) {
    notify("error", "Failed to fetch users");
    console.error(error);
    return [];
  } finally {
    hideLoader(); // hide spinner
  }
}

async function fetchPosts() {
  try {
    const response = await fetch(API_POSTS);

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data;

  } catch (error) {
    notify("error", "Failed to fetch posts");
    console.error(error);
    return [];
  } finally {
    hideLoader();
  }
}

async function fetchComments(postId) {
  try {
    const response = await fetch(API_COMMENTS + postId);

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data;

  } catch (error) {
    notify("error", "Failed to fetch comments");
    console.error(error);
    return [];
  } finally {
    hideLoader();
  }
}



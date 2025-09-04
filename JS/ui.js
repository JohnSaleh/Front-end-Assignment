// Show and hide loader
function showLoader() {
    document.getElementById("loader").style.display = "flex";
}
function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

// Theme toggle (Light/Dark)
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
});

// Toast wrapper
function notify(type, message) {
    toastr.options = {
        positionClass: "toast-top-right",
        timeOut: 2000
    };
    if (type === "success") toastr.success(message);
    if (type === "error") toastr.error(message);
    if (type === "info") toastr.info(message);
    if (type === "warning") toastr.warning(message);
}

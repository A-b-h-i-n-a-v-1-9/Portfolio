 // JavaScript for Loader and Redirect
 document.addEventListener("DOMContentLoaded", function () {
    const loaderContainer = document.querySelector(".loader-container");
    const mainContent = document.querySelector(".main-content");

    setTimeout(() => {
        if (loaderContainer) {
            loaderContainer.style.opacity = "0"; // Fade out the loader
            setTimeout(() => {
                loaderContainer.style.display = "none"; // Remove loader from view
                mainContent.style.display = "block"; // Show main content
                mainContent.style.opacity = "1"; // Fade in main content
                document.body.style.overflow = "auto"; // Allow scrolling
            }, 500); // Wait for the fade-out effect to complete
        }
    }, 2000); // Simulated 2-second delay
});

// Toggle menu for mobile view [NavBar]
function toggleMenu() {
    const menu = document.querySelector('.navbar-menu');
    menu.classList.toggle('active');
}

document.addEventListener("DOMContentLoaded", () => {
    const cookie = document.getElementById("cookie");

    if (cookie) {
        cookie.addEventListener("click", () => {
            // Add the bounce and glow animation classes
            cookie.classList.add("bounce", "glow");

            // Remove the animation classes after they finish
            setTimeout(() => {
                cookie.classList.remove("bounce", "glow");
            }, 500); // Match this duration with the CSS animation duration

            // Create glitter effect
            createGlitterEffect(cookie);
        });
    } else {
        console.error("Cookie element not found!");
    }
});

function createGlitterEffect(cookie) {
    const glitterContainer = document.createElement("div");
    glitterContainer.classList.add("glitter-container");
    document.body.appendChild(glitterContainer);

    const glitterCount = 20; // Number of glitter particles
    const cookieRect = cookie.getBoundingClientRect();

    for (let i = 0; i < glitterCount; i++) {
        const glitter = document.createElement("div");
        glitter.classList.add("glitter");

        // Randomize glitter position and animation
        glitter.style.left = `${cookieRect.left + cookieRect.width / 2}px`;
        glitter.style.top = `${cookieRect.top + cookieRect.height / 2}px`;
        glitter.style.transform = `translate(${Math.random() * 200 - 100}px, ${
            Math.random() * 200 - 100
        }px) scale(${Math.random() * 0.5 + 0.5})`;

        glitterContainer.appendChild(glitter);
    }
}
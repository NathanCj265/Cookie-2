document.addEventListener("DOMContentLoaded", () => {
    const cookie = document.getElementById("cookie");

    if (cookie) {
        cookie.addEventListener("click", () => {
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

    const glitterCount = 20; 
    const cookieRect = cookie.getBoundingClientRect();

    for (let i = 0; i < glitterCount; i++) {
        const glitter = document.createElement("div");
        glitter.classList.add("glitter");

        
        glitter.style.left = `${cookieRect.left + cookieRect.width / 2}px`;
        glitter.style.top = `${cookieRect.top + cookieRect.height / 2}px`;

        
        glitter.style.transform = `translate(${Math.random() * 200 - 100}px, ${
            Math.random() * 200 - 100
        }px) scale(${Math.random() * 0.5 + 0.5})`;

      
        glitter.style.animation = "glitter-fade 1s ease-out forwards";

        glitterContainer.appendChild(glitter);

        
        glitter.addEventListener("animationend", () => {
            glitter.remove();
        });
    }

    
    setTimeout(() => {
        glitterContainer.remove();
    }, 1000);
}
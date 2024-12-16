const imageUrls = Array.from({ length: 64 }, (_, i) => `imgs/collage${i + 1}.png`);

// Function to create and place images randomly
function placeRandomImages() {
    // Select 20 random images from the array
    const selectedImages = imageUrls.sort(() => Math.random() - 0.5).slice(0, 35);

    // Get screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Remove existing images
    document.querySelectorAll('.random-image').forEach(img => img.remove());

    // Add the images to the body
    selectedImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('random-image'); // Add a class for potential styling

        // Random position within screen bounds
        const randomX = Math.random() * (screenWidth - 200); // Subtract image width (100px assumed)
        const randomY = Math.random() * (screenHeight - 200); // Subtract image height (100px assumed)

        img.style.position = 'absolute';
        img.style.left = `${randomX}px`;
        img.style.top = `${randomY}px`;
        img.style.width = `250px`; // Adjust as needed
         // Adjust as needed

        document.body.appendChild(img);
    });
}

// Event listener for the space key
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent default spacebar behavior (e.g., page scrolling)
        placeRandomImages();
    }
});

document.addEventListener('DOMContentLoaded', placeRandomImages);
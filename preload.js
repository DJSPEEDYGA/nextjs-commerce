// Preload script - runs in renderer process context before page loads
// Keeps Node.js APIs isolated from the web content for security
window.addEventListener('DOMContentLoaded', () => {
  console.log('E-Commerce Store desktop app loaded.');
});
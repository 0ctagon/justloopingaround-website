
// Toggle the dropdown menu display
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// Scroll to a specific section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setTimeout(closeMenu, 200);
}

// Close the menu function
function closeMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = 'none';
}

// Close the menu when clicking outside of it
document.addEventListener('click', function(event) {
    const menu = document.getElementById('dropdownMenu');
    const menuIcon = document.querySelector('.menu-icon');

    // Check if the click is outside the menu and menu icon
    if (menu.style.display === 'flex' && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
        closeMenu();
    }
});
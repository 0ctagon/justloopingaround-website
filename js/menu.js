
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

const menuIcon = document.querySelector('.menu-icon');
const anchor   = document.getElementById('menuAnchor');

function setRight() {
  const W  = 1113;
  const windowWidth = window.innerWidth;
  const side = windowWidth < W ? 0 : (windowWidth - W) / 2;
  menuIcon.style.setProperty('--right', `${side + 20}px`);
}
setRight();
window.addEventListener('resize', setRight);

const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        menuIcon.classList.remove('sticky');      // anchor still visible
    } else {
        menuIcon.classList.add('sticky');         // anchor scrolled past
    }
});
io.observe(anchor);
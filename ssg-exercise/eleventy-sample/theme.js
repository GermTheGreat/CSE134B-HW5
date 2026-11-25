const toggleButton = document.querySelector('#theme-toggle');
const root = document.documentElement;
toggleButton.hidden = false;
setTheme(getSavedTheme() === 'dark' ? 'dark' : 'light');

function getSavedTheme() {
  try {
    return localStorage.getItem('theme');
  } catch (error) {
    console.warn('Could not read theme from localStorage:', error);
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.warn('Could not save theme to localStorage:', error);
  }
}

function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggleButton.textContent = theme === 'dark' ? 'Switch to light' : 'Switch to dark';
}

toggleButton.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  const canAnimate = document.startViewTransition &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canAnimate) {
    document.startViewTransition(() => setTheme(next));
  } else {
    setTheme(next);
  }

  saveTheme(next);
});
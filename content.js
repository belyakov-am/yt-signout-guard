// Function to create and show the confirmation modal
function showConfirmationModal(originalHref) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
  `;
  modal.innerHTML = `
    <p>Are you sure you want to sign out?</p>
    <button id="confirmYes">Yes</button>
    <button id="confirmNo">No</button>
  `;
  document.body.appendChild(modal);

  document.getElementById('confirmYes').addEventListener('click', () => {
    modal.remove();
    // Redirect to the original logout URL
    window.location.href = originalHref;
  });

  document.getElementById('confirmNo').addEventListener('click', () => {
    modal.remove();
  });
}

// Function to intercept the sign out button click
function interceptSignOut() {
  const signOutLink = document.querySelector('a#endpoint[href="/logout"]');
  if (signOutLink) {
    signOutLink.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showConfirmationModal(signOutLink.href);
    });
  }
}

// Check for the sign out button periodically
const checkInterval = setInterval(() => {
  if (document.querySelector('a#endpoint[href="/logout"]')) {
    interceptSignOut();
    clearInterval(checkInterval);
  }
}, 1000);

// Also check when the account menu might be opened
document.addEventListener('yt-action', function(event) {
  if (event.detail && event.detail.actionName === 'yt-open-popup-action') {
    setTimeout(interceptSignOut, 100); // Small delay to ensure the menu has loaded
  }
});

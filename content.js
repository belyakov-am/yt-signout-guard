// Function to create and show the confirmation modal
function showConfirmationModal(originalHref) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    width: 400px;
    max-width: 90vw;
    animation: modalFadeIn 0.3s ease-out;
  `;

  const modalContent = `
    <div style="text-align: center;">
      <h2 style="
        margin: 0 0 16px 0;
        font-size: 24px;
        color: #202124;
        font-weight: 500;
      ">Sign Out Confirmation</h2>
      
      <p style="
        margin: 0 0 24px 0;
        font-size: 16px;
        color: #5f6368;
        line-height: 1.5;
      ">Are you sure you want to sign out of your YouTube account?</p>
      
      <div style="
        display: flex;
        gap: 12px;
        justify-content: center;
      ">
        <button id="confirmNo" style="
          padding: 10px 24px;
          border: 1px solid #dadce0;
          border-radius: 4px;
          background: white;
          color: #3c4043;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        ">Cancel</button>
        
        <button id="confirmYes" style="
          padding: 10px 24px;
          border: none;
          border-radius: 4px;
          background: #1a73e8;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        ">Sign Out</button>
      </div>
    </div>
  `;

  // Add hover effects
  const style = document.createElement('style');
  style.textContent = `
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translate(-50%, -48%); }
      to { opacity: 1; transform: translate(-50%, -50%); }
    }
    
    #confirmNo:hover {
      background-color: #f8f9fa;
    }
    
    #confirmYes:hover {
      background-color: #1557b0;
    }
  `;
  document.head.appendChild(style);

  modal.innerHTML = modalContent;
  document.body.appendChild(modal);

  // Add backdrop
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    animation: backdropFadeIn 0.3s ease-out;
  `;
  document.body.appendChild(backdrop);

  document.getElementById('confirmYes').addEventListener('click', () => {
    modal.remove();
    backdrop.remove();
    window.location.href = originalHref;
  });

  document.getElementById('confirmNo').addEventListener('click', () => {
    modal.remove();
    backdrop.remove();
  });

  // Close on backdrop click
  backdrop.addEventListener('click', () => {
    modal.remove();
    backdrop.remove();
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

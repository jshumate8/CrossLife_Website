// Load navigation component
(function() {
    fetch('/components/nav.html')
        .then(response => response.text())
        .then(html => {
            const navContainer = document.getElementById('nav-container');
            if (navContainer) {
                navContainer.innerHTML = html;
                
                // Initialize auth buttons after nav is loaded
                const loginBtn = document.getElementById('loginBtn');
                const logoutBtn = document.getElementById('logoutBtn');
                
                if (loginBtn) {
                    loginBtn.onclick = function() {
                        netlifyIdentity.open();
                    };
                }
                
                if (logoutBtn) {
                    logoutBtn.onclick = function() {
                        netlifyIdentity.logout();
                    };
                }
                
                // Set initial auth state
                if (typeof netlifyIdentity !== 'undefined') {
                    netlifyIdentity.on('init', function(user) {
                        updateAuthUI(user);
                    });
                    
                    netlifyIdentity.on('login', function(user) {
                        netlifyIdentity.close();
                        updateAuthUI(user);
                    });
                    
                    netlifyIdentity.on('logout', function() {
                        updateAuthUI(null);
                    });
                }
            }
        });
})();

function updateAuthUI(user) {
    if (user) {
        document.documentElement.classList.remove('logged-out');
        document.documentElement.classList.add('logged-in');
    } else {
        document.documentElement.classList.remove('logged-in');
        document.documentElement.classList.add('logged-out');
    }
}

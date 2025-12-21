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
                        crosslifeAuth.open();
                    };
                }
                
                if (logoutBtn) {
                    logoutBtn.onclick = function() {
                        crosslifeAuth.logout();
                    };
                }
                
                // Set initial auth state
                if (typeof crosslifeAuth !== 'undefined') {
                    crosslifeAuth.on('init', function(user) {
                        updateAuthUI(user);
                    });
                    
                    crosslifeAuth.on('login', function(user) {
                        crosslifeAuth.close();
                        updateAuthUI(user);
                    });
                    
                    crosslifeAuth.on('logout', function() {
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


// Supabase Auth Integration for CrossLife
// Replace Netlify Identity with Supabase

class CrossLifeAuth {
    constructor() {
        this.user = null;
        this.supabaseUrl = null;
        this.supabaseKey = null;
        this.supabase = null;
        this.initialized = false;
    }

    // Initialize Supabase client
    async init(supabaseUrl, supabaseAnonKey) {
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseAnonKey;
        
        // Wait for Supabase library to be available
        let attempts = 0;
        while (typeof window.supabase === 'undefined' && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase library failed to load');
            return;
        }
        
        this.supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
        
        // Check for existing session
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            this.user = session.user;
            this.updateAuthState('logged-in');
        } else {
            this.updateAuthState('logged-out');
        }
        
        // Listen for auth changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                this.user = session.user;
                this.updateAuthState('logged-in');
                this.triggerCallback('login', session.user);
            } else {
                this.user = null;
                this.updateAuthState('logged-out');
                this.triggerCallback('logout');
            }
        });
        
        this.initialized = true;
        this.triggerCallback('init', this.user);
    }

    async loadSupabaseLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/umd/supabase.min.js';
            script.onload = () => {
                // Make createClient available globally
                window.createClient = window.supabase.createClient;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    updateAuthState(state) {
        localStorage.setItem('crosslife-auth-state', state);
        document.documentElement.className = state;
    }

    // Event callbacks system
    callbacks = {
        init: [],
        login: [],
        logout: [],
        error: []
    };

    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    triggerCallback(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(cb => cb(data));
        }
    }

    // Open login modal (using a simple modal)
    open(mode = 'login') {
        this.showAuthModal(mode);
    }

    // Show authentication modal
    showAuthModal(mode = 'login') {
        const modalHTML = `
            <div id="authModal" class="auth-modal">
                <div class="auth-modal-content">
                    <span class="auth-modal-close">&times;</span>
                    <div class="auth-tabs">
                        <button class="auth-tab ${mode === 'login' ? 'active' : ''}" data-mode="login">Login</button>
                        <button class="auth-tab ${mode === 'signup' ? 'active' : ''}" data-mode="signup">Sign Up</button>
                    </div>
                    <div id="authFormContainer"></div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('authModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        this.renderAuthForm(mode);
        this.attachModalHandlers();
    }

    renderAuthForm(mode) {
        const container = document.getElementById('authFormContainer');
        if (!container) return;
        
        if (mode === 'login') {
            container.innerHTML = `
                <form id="loginForm" class="auth-form">
                    <h2>Welcome Back</h2>
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                    <p class="auth-message" id="authMessage"></p>
                    <p class="auth-link">Forgot password? <a href="#" id="forgotPasswordLink">Reset it</a></p>
                </form>
            `;
            
            document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
            document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
                e.preventDefault();
                this.renderResetPasswordForm();
            });
        } else {
            container.innerHTML = `
                <form id="signupForm" class="auth-form">
                    <h2>Create Account</h2>
                    <div class="form-group">
                        <label for="signupEmail">Email</label>
                        <input type="email" id="signupEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="signupPassword">Password</label>
                        <input type="password" id="signupPassword" required minlength="6">
                    </div>
                    <button type="submit" class="btn btn-primary">Sign Up</button>
                    <p class="auth-message" id="authMessage"></p>
                </form>
            `;
            
            document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));
        }
    }

    renderResetPasswordForm() {
        const container = document.getElementById('authFormContainer');
        container.innerHTML = `
            <form id="resetPasswordForm" class="auth-form">
                <h2>Reset Password</h2>
                <p>Enter your email and we'll send you a reset link.</p>
                <div class="form-group">
                    <label for="resetEmail">Email</label>
                    <input type="email" id="resetEmail" required>
                </div>
                <button type="submit" class="btn btn-primary">Send Reset Link</button>
                <p class="auth-message" id="authMessage"></p>
                <p class="auth-link"><a href="#" id="backToLoginLink">Back to login</a></p>
            </form>
        `;
        
        document.getElementById('resetPasswordForm').addEventListener('submit', (e) => this.handlePasswordReset(e));
        document.getElementById('backToLoginLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.renderAuthForm('login');
        });
    }

    attachModalHandlers() {
        const modal = document.getElementById('authModal');
        const closeBtn = modal.querySelector('.auth-modal-close');
        const tabs = modal.querySelectorAll('.auth-tab');
        
        closeBtn.addEventListener('click', () => this.close());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderAuthForm(tab.dataset.mode);
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const messageEl = document.getElementById('authMessage');
        
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            messageEl.style.color = 'green';
            messageEl.textContent = 'Login successful!';
            setTimeout(() => this.close(), 1000);
        } catch (error) {
            messageEl.style.color = 'red';
            messageEl.textContent = error.message;
            this.triggerCallback('error', error);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const messageEl = document.getElementById('authMessage');
        
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password
            });
            
            if (error) throw error;
            
            messageEl.style.color = 'green';
            messageEl.textContent = 'Account created! Check your email to confirm.';
        } catch (error) {
            messageEl.style.color = 'red';
            messageEl.textContent = error.message;
            this.triggerCallback('error', error);
        }
    }

    async handlePasswordReset(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        const messageEl = document.getElementById('authMessage');
        
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email);
            
            if (error) throw error;
            
            messageEl.style.color = 'green';
            messageEl.textContent = 'Password reset email sent! Check your inbox.';
        } catch (error) {
            messageEl.style.color = 'red';
            messageEl.textContent = error.message;
        }
    }

    close() {
        const modal = document.getElementById('authModal');
        if (modal) modal.remove();
    }

    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Logout error:', error);
            this.triggerCallback('error', error);
        }
    }

    currentUser() {
        return this.user;
    }
}

// Create global instance (compatible with netlifyIdentity API)
window.crosslifeAuth = new CrossLifeAuth();

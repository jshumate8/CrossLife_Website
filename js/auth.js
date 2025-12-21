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
                    <button type="button" id="googleSignIn" class="btn btn-google" style="background: white; color: #444; border: 1px solid #ddd; margin-bottom: 1rem;">
                        <svg style="width: 18px; height: 18px; margin-right: 8px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Continue with Google
                    </button>
                    <div style="text-align: center; margin: 1rem 0; color: #666;">or</div>
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
            
            document.getElementById('googleSignIn').addEventListener('click', () => this.signInWithGoogle());
            document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
            document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
                e.preventDefault();
                this.renderResetPasswordForm();
            });
        } else {
            container.innerHTML = `
                <form id="signupForm" class="auth-form">
                    <h2>Create Account</h2>
                    <button type="button" id="googleSignUp" class="btn btn-google" style="background: white; color: #444; border: 1px solid #ddd; margin-bottom: 1rem;">
                        <svg style="width: 18px; height: 18px; margin-right: 8px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Continue with Google
                    </button>
                    <div style="text-align: center; margin: 1rem 0; color: #666;">or</div>
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
            
            document.getElementById('googleSignUp').addEventListener('click', () => this.signInWithGoogle());
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

    async signInWithGoogle() {
        try {
            const { error } = await this.supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            
            if (error) throw error;
        } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Error signing in with Google: ' + error.message);
        }
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

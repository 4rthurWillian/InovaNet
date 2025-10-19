// --- GLOBAL STATE ---
let currentView = 'home';
let isLoggedIn = false;
let authMode = 'login'; // 'login' or 'register'
let profileTab = 'profile-posts';

const views = {
    'home': document.getElementById('home-view'),
    'auth': document.getElementById('auth-view'),
    'login': document.getElementById('auth-view'), // Maps to the same container
    'register': document.getElementById('auth-view'), // Maps to the same container
    'feed': document.getElementById('feed-view'),
    'profile': document.getElementById('profile-view'),
    'post-create': document.getElementById('post-create-view'),
    'messages': document.getElementById('messages-view'),
    'notifications': document.getElementById('notifications-view'),
    'settings': document.getElementById('settings-view'),
};

// --- UTILITY FUNCTIONS ---

/** Shows a custom alert message (replaces alert()) */
function alertMessage(message) {
    document.getElementById('alert-text').textContent = message;
    document.getElementById('custom-alert').classList.remove('hidden');
    document.getElementById('custom-alert').classList.add('flex');
}

/** Closes the custom alert modal. */
function closeAlert() {
    document.getElementById('custom-alert').classList.add('hidden');
    document.getElementById('custom-alert').classList.remove('flex');
}

/**
 * Switches the visible view and updates the header.
 * @param {string} viewName - The name of the view to show.
 */
function showView(viewName) {
    // Check authentication guard
    const protectedViews = ['feed', 'profile', 'post-create', 'messages', 'notifications', 'settings'];
    if (protectedViews.includes(viewName) && !isLoggedIn) {
        alertMessage("Você precisa estar logado para acessar esta página.");
        return;
    }

    // Handle special auth view logic
    if (viewName === 'login' || viewName === 'register') {
        toggleAuthMode(viewName);
        viewName = 'auth';
    }

    // Hide all views
    Object.values(views).forEach(view => {
        if (view) view.classList.add('hidden');
    });

    // Show the target view
    const targetView = views[viewName];
    if (targetView) {
        targetView.classList.remove('hidden');
        currentView = viewName;
    }

    // Update Header Visibility
    updateHeaderVisibility();

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
}

/** Updates header buttons based on login state. */
function updateHeaderVisibility() {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;
    const links = navLinks.querySelectorAll('a, button');

    links.forEach(el => {
        // Determine if link is for authenticated users
        const isAuthLink = el.id === 'logout-btn' || el.textContent.includes('Feed') || el.textContent.includes('Perfil') || el.textContent.includes('Mensagens') || el.textContent.includes('Notificações') || el.textContent.includes('Configurações');
        // Determine if link is for public users (login/register)
        const isPublicLink = el.id === 'login-btn' || el.id === 'register-btn';

        if (isLoggedIn) {
            if (isAuthLink) {
                el.classList.remove('hidden');
            } else if (isPublicLink) {
                el.classList.add('hidden');
            }
        } else {
            if (isAuthLink) {
                el.classList.add('hidden');
            } else if (isPublicLink) {
                el.classList.remove('hidden');
            }
        }
    });

    // Ensure profile and settings buttons are visible for logged-in users
    document.getElementById('logout-btn').classList.toggle('hidden', !isLoggedIn);
    document.getElementById('login-btn').classList.toggle('hidden', isLoggedIn);
    document.getElementById('register-btn').classList.toggle('hidden', isLoggedIn);
}

// --- AUTH LOGIC (MOCK) ---

/** Switches the form within the #auth-view. */
function toggleAuthMode(mode) {
    authMode = mode;
    const title = document.getElementById('auth-title');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const messageBox = document.getElementById('auth-message');

    if (!title || !loginForm || !registerForm || !messageBox) return;

    messageBox.classList.add('hidden');

    if (mode === 'register') {
        title.textContent = 'Cadastre-se na Plataforma';
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    } else {
        title.textContent = 'Entrar na Plataforma';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }
    showView('auth');
}

/** Mocks the login process. */
function handleLogin(event) {
    event.preventDefault();
    const messageBox = document.getElementById('auth-message');

    // Simple validation mock
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value;
    const password = passwordInput.value;

    if (email.trim() === '' || password.trim() === '') {
        messageBox.textContent = "Preencha todos os campos para continuar.";
        messageBox.className = 'mb-4 p-3 rounded-lg text-sm text-center bg-red-100 text-red-700';
        messageBox.classList.remove('hidden');
        return;
    }

    // Success mock
    isLoggedIn = true;
    alertMessage("Login realizado com sucesso! Bem-vindo(a) ao Feed.");
    showView('feed');
}

/** Mocks the registration process. */
function handleRegister(event) {
    event.preventDefault();
    const messageBox = document.getElementById('auth-message');

    // Simple validation mock
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');

    if (!nameInput || !emailInput) return;

    const name = nameInput.value;
    const email = emailInput.value;

    if (name.trim() === '' || email.trim() === '') {
        messageBox.textContent = "Preencha todos os campos obrigatórios.";
        messageBox.className = 'mb-4 p-3 rounded-lg text-sm text-center bg-red-100 text-red-700';
        messageBox.classList.remove('hidden');
        return;
    }

    // Success mock
    isLoggedIn = true;
    alertMessage("Cadastro concluído! Seja bem-vindo à Paraná InovaNet.");
    showView('feed');
}

/** Mocks the logout process. */
function handleLogout() {
    isLoggedIn = false;
    alertMessage("Você foi desconectado(a).");
    showView('home');
}

// --- VIEW-SPECIFIC LOGIC ---

/** Toggles the mobile navigation menu. */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

/** Handles profile tab switching. */
function switchProfileTab(event) {
    const targetTab = event.target.dataset.tab;
    if (!targetTab) return;

    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-sky-600', 'text-sky-600');
        btn.classList.add('border-transparent', 'text-gray-600');
    });
    event.target.classList.add('border-sky-600', 'text-sky-600');
    event.target.classList.remove('border-transparent', 'text-gray-600');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    const targetContent = document.getElementById(targetTab);
    if (targetContent) {
        targetContent.classList.remove('hidden');
    }
}

/** Handles post creation form submission. */
function handlePostCreation(event) {
    event.preventDefault();
    const postText = document.getElementById('post-text');
    const fileNameDisplay = document.getElementById('file-name');

    if (!postText || !fileNameDisplay) return;

    const text = postText.value;
    const fileName = fileNameDisplay.textContent;

    if (text.trim() === '') {
        alertMessage("O texto da publicação não pode estar vazio.");
        return;
    }

    alertMessage(`Publicação enviada com sucesso! \nTexto: "${text.substring(0, 30)}..." \nAnexo: ${fileName}`);

    // Reset form and return to feed
    const form = document.getElementById('post-create-form');
    if (form) form.reset();
    fileNameDisplay.textContent = 'Nenhum arquivo selecionado.';
    showView('feed');
}

/** Shows selected file name in the post creation form. */
function updateFileName() {
    const fileInput = document.getElementById('post-image');
    const fileNameDisplay = document.getElementById('file-name');
    
    if (fileInput && fileNameDisplay) {
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado.';
        }
    }
}


// --- INITIALIZATION ---
function init() {
    // Set up form submission listeners
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    const postCreateForm = document.getElementById('post-create-form');
    if (postCreateForm) postCreateForm.addEventListener('submit', handlePostCreation);
    
    const postImageInput = document.getElementById('post-image');
    if (postImageInput) postImageInput.addEventListener('change', updateFileName);

    // Set up profile tab listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchProfileTab);
    });

    // Start on the home view (public)
    showView('home');
}

// Run initialization when the window loads
window.onload = init;

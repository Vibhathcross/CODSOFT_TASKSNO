document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let cartCount = 0;
    let currentTab = 'login'; // 'login' or 'signup'
    
    // --- ELEMENT REFERENCES ---
    const loginModal = document.getElementById('login-modal');
    const loginNavBtn = document.getElementById('login-nav-btn');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const cartCountEl = document.getElementById('cart-count');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const authForm = document.getElementById('auth-form');
    const passwordGroup = document.getElementById('password-group');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const newsletterForm = document.getElementById('newsletter-form');
    const toastContainer = document.getElementById('toast-container');
    
    // Hero Elements
    const heroSneakerImg = document.getElementById('hero-sneaker-img');
    const selectorDots = document.querySelectorAll('.selector-dot');
    const coloredHeroText = document.getElementById('colored-hero-text');
    const heroShoeBadge = document.getElementById('hero-shoe-badge');
    const heroCtaBuy = document.getElementById('hero-cta-buy');

    // Anatomy Deep Dive Elements
    const anatomyTabs = document.querySelectorAll('.anatomy-tab');
    const anatomyShowcaseImg = document.getElementById('anatomy-showcase-img');
    const anatomyShowcaseText = document.getElementById('anatomy-showcase-text');
    
    // --- TOAST NOTIFICATIONS ---
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Emoji based on type
        const icon = type === 'success' ? '🔥' : '⚡';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        
        toastContainer.appendChild(toast);
        
        // Trigger transition
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // --- CART LOGIC ---
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = e.target.getAttribute('data-product');
            cartCount++;
            
            // Update counter
            cartCountEl.textContent = cartCount;
            
            // Pop animation
            cartCountEl.classList.add('pop');
            setTimeout(() => {
                cartCountEl.classList.remove('pop');
            }, 200);
            
            showToast(`Added ${productName} to Cart!`);
        });
    });
    
    // --- HERO COLORWAY SWITCHER ---
    selectorDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            // Remove active state from all dots
            selectorDots.forEach(d => d.classList.remove('active'));
            
            // Add active state to clicked dot
            dot.classList.add('active');
            
            const color = dot.getAttribute('data-color');
            
            if (color === 'orange') {
                heroSneakerImg.src = 'assets/sneaker_orange.png';
                coloredHeroText.textContent = 'STREETS';
                coloredHeroText.className = ''; // remove blue-text
                heroShoeBadge.textContent = 'NEW ARRIVAL';
                heroShoeBadge.className = 'neo-badge neo-badge-orange';
                heroCtaBuy.className = 'neo-btn neo-btn-orange';
            } else if (color === 'blue') {
                heroSneakerImg.src = 'assets/sneaker_blue.png';
                coloredHeroText.textContent = 'STYLE';
                coloredHeroText.className = 'blue-text';
                heroShoeBadge.textContent = 'LIMITED EDITION';
                heroShoeBadge.className = 'neo-badge neo-badge-blue';
                heroCtaBuy.className = 'neo-btn neo-btn-blue';
            }
            
            // Mini scale bounce on shoe swap
            heroSneakerImg.style.transform = 'scale(0.8)';
            setTimeout(() => {
                heroSneakerImg.style.transform = '';
            }, 150);
            
            showToast(`Swapped to ${color.toUpperCase()} colorway!`, 'info');
        });
    });
    
    // --- SIZE SELECTOR ---
    document.querySelectorAll('.size-selector').forEach(selector => {
        const buttons = selector.querySelectorAll('.size-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    // --- ANATOMY INTERACTIVE DEEP DIVE ---
    anatomyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            anatomyTabs.forEach(t => t.classList.remove('active'));
            // Set active to this tab
            tab.classList.add('active');

            const tabType = tab.getAttribute('data-tab');

            // Handle content swap
            if (tabType === 'upper') {
                anatomyShowcaseImg.src = 'assets/sneaker_lace.png';
                anatomyShowcaseText.textContent = '01 // Ripstop Shield Upper (Detailed Mesh Structure)';
            } else if (tabType === 'sole') {
                anatomyShowcaseImg.src = 'assets/sneaker_sole.png';
                anatomyShowcaseText.textContent = '02 // Tread-Active Cushion (Multi-density Dispersion Outsole)';
            } else if (tabType === 'packaging') {
                anatomyShowcaseImg.src = 'assets/sneaker_box.png';
                anatomyShowcaseText.textContent = '03 // Collector Box (Graphic Heavyweight Box Packaging)';
            }

            // Quick display animation bounce
            anatomyShowcaseImg.style.transform = 'scale(0.9) rotate(-3deg)';
            setTimeout(() => {
                anatomyShowcaseImg.style.transform = 'scale(1) rotate(0deg)';
            }, 200);

            showToast(`Loading specs for: ${tabType.toUpperCase()}`, 'info');
        });
    });
    
    // --- MODAL CONTROLS ---
    function openModal() {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }
    
    function closeModal() {
        loginModal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scroll
    }
    
    loginNavBtn.addEventListener('click', openModal);
    modalCloseBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking backdrop
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal();
        }
    });
    
    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Switch Tabs
    tabLogin.addEventListener('click', () => {
        currentTab = 'login';
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        passwordGroup.style.display = 'block';
        authSubmitBtn.textContent = 'Access Portal';
    });
    
    tabSignup.addEventListener('click', () => {
        currentTab = 'signup';
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        passwordGroup.style.display = 'block';
        authSubmitBtn.textContent = 'Create Member Account';
    });
    
    // Handle Form Submit
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        closeModal();
        showToast(currentTab === 'login' ? `Welcome back, ${email}!` : `Account created for ${email}!`);
        // Reset inputs
        authForm.reset();
    });
    
    // Google Sign-in simulation
    googleLoginBtn.addEventListener('click', () => {
        closeModal();
        showToast('Successfully authenticated via Google!');
    });
    
    // Newsletter Submit
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        showToast(`Subscribed! Check email for discount code.`, 'success');
        newsletterForm.reset();
    });
    
    // --- DYNAMIC GEOMETRIC BACKGROUND DECORATIONS ---
    const shapesContainer = document.getElementById('decorations-container');
    const shapeTypes = ['star', 'circle', 'triangle'];
    const colors = ['var(--accent-yellow)', 'var(--accent-pink)', 'var(--accent-blue)', 'var(--accent-orange)'];
    
    for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div');
        const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        shape.className = `shape shape-${type} float-slow`;
        shape.style.backgroundColor = color;
        shape.style.top = `${Math.random() * 85 + 5}%`;
        shape.style.left = `${Math.random() * 92}%`;
        
        // Random size
        const size = Math.random() * 20 + 20; // 20px to 40px
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        
        // Add random floating duration
        shape.style.animationDuration = `${Math.random() * 4 + 5}s`;
        shape.style.animationDelay = `${Math.random() * 2}s`;
        
        shapesContainer.appendChild(shape);
    }

    // --- SCROLL PARALLAX EFFECT FOR BACKGROUND DECORATIONS ---
    window.addEventListener('scroll', () => {
        const scrollValue = window.scrollY;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = (index % 3 + 1) * 0.12;
            const direction = index % 2 === 0 ? 1 : -1;
            // Apply translation offset based on scroll position
            shape.style.transform = `translateY(${scrollValue * speed * direction}px) rotate(${scrollValue * 0.04}deg)`;
        });
    });

    // --- INTERSECTION OBSERVER FOR SCROLL REVEAL ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-element').forEach(element => {
        revealObserver.observe(element);
    });
});

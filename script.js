document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Lucide Icons de forma assíncrona para não bloquear a renderização principal (melhora drástica no TBT)
    setTimeout(() => {
        lucide.createIcons();
    }, 50);

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Dispara quando 15% do elemento estiver visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: parar de observar depois que animou
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Form submission
    const form = document.getElementById('capture-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Enviando...';
            lucide.createIcons();
            
            // URL do Web App do Google Apps Script
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwB10UdKQdT9CYdFFyuNFiypJhbXgiiMmh3QXLDfR2EoQ7l9g6u5heDTE-IW2wOsT0/exec';

            const formData = new FormData(form);
            const data = new URLSearchParams();
            for (const pair of formData) {
                data.append(pair[0], pair[1]);
            }

            fetch(scriptURL, { 
                method: 'POST', 
                body: data,
                mode: 'no-cors'
            })
                .then(response => {
                    btn.innerHTML = '<i data-lucide="check"></i> Solicitação Enviada!';
                    btn.style.backgroundColor = 'var(--color-success)';
                    btn.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
                    lucide.createIcons();
                    form.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.boxShadow = '';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Houve um problema ao enviar seus dados. Tente novamente.');
                    btn.innerHTML = originalText;
                });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navList.contains(e.target) && !mobileMenuBtn.contains(e.target) && navList.classList.contains('active')) {
            navList.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Carousel Logic
    const slides = document.querySelectorAll('.carousel-item');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Event Listeners
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
        });
    }

    // Auto Play
    let timer = setInterval(nextSlide, slideInterval);

    function stopAutoPlay() {
        clearInterval(timer);
    }

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyCII56NPvQy4uJemw3w4Q2qHF5xWOlNglYtrKUk8D2aPhfdqDt1GwgE3jkpiCIdtRV/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const recaptchaResponse = grecaptcha.getResponse();
            if (recaptchaResponse.length === 0) {
                alert("Por favor, confirme que você não é um robô selecionando a caixa acima.");
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            const formData = new FormData(contactForm);

            // Adiciona a string do reCAPTCHA no envio para ser validadada pelo backend
            formData.append('g-recaptcha-response', recaptchaResponse);

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para evitar erros de CORS em sites estáticos
                body: formData
            })
                .then(() => {
                    // Com 'no-cors', não conseguimos ler a resposta JSON (response.json() falharia).
                    // Mas se a Promise resolveu, o envio foi feito.
                    alert('Mensagem enviada com sucesso! Em breve entrarei em contato.');
                    contactForm.reset();
                    grecaptcha.reset(); // Reinicia o widget do reCAPTCHA
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Houve um erro no envio. Por favor, tente pelo WhatsApp.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        });
    }

    // Phone Masking
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            let formattedValue = '';
            if (value.length > 0) {
                formattedValue = '(' + value.substring(0, 2);
            }
            if (value.length > 2) {
                formattedValue += ') ' + value.substring(2, 7);
            }
            if (value.length > 7) {
                formattedValue += '-' + value.substring(7, 11);
            }
            e.target.value = formattedValue;
        });
    }
});

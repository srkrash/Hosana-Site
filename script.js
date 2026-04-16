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

    const contactForm = document.querySelector('.contact-form');
    // Usando Formsubmit para envio direto para o email
    const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/hosana.goncalves.neuropsi@gmail.com'; 

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
            
            // Campos opcionais do Formsubmit
            formData.append('_subject', 'Novo Contato pelo Site'); // Assunto do email
            formData.append('_captcha', 'false'); // Desativa o captcha padrão deles pois já usamos o do Google

            fetch(FORMSUBMIT_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "true" || data.success === true) {
                        alert('Mensagem enviada com sucesso! Em breve entrarei em contato.');
                        contactForm.reset();
                        try { grecaptcha.reset(); } catch(e){}
                    } else if (data.message && data.message.includes("Activation")) {
                        alert('Aviso de Segurança: Um e-mail de ativação foi enviado para o seu e-mail (hosana...). Por favor, abra-o e clique em "Activate Form" para que o formulário comece a funcionar nas próximas vezes!');
                    } else {
                        throw new Error(data.message || 'Erro na resposta do servidor');
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Houve um erro no envio: ' + error.message);
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

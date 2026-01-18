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
            resetTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });
    }

    // Auto Play
    let timer = setInterval(nextSlide, slideInterval);

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(nextSlide, slideInterval);
    }
});

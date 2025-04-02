document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider Functionality
    const dots = document.querySelectorAll('.dot');
    const heroSection = document.querySelector('.hero');
    
    // Background images for hero slider
    const heroBackgrounds = [
        'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/placeholder.svg?height=800&width=1600")',
        'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/placeholder.svg?height=800&width=1600&text=Slide2")',
        'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/placeholder.svg?height=800&width=1600&text=Slide3")'
    ];
    
    // Hero content for each slide
    const heroContent = [
        {
            tag: 'NATURAL ENVIRONMENT',
            title: 'Be Safe Controls Environment',
            description: 'Professionally optimize transparent intellectual strategies connect best practices. Progressively fabricate done'
        },
        {
            tag: 'SUSTAINABLE FUTURE',
            title: 'Protect Our Planet Today',
            description: 'Creating sustainable solutions for a greener tomorrow. Join us in our mission to preserve nature.'
        },
        {
            tag: 'RENEWABLE ENERGY',
            title: 'Clean Energy Revolution',
            description: 'Harnessing the power of nature to create clean, renewable energy sources for a sustainable future.'
        }
    ];
    
    let currentSlide = 0;
    
    // Function to update the hero slider
    function updateSlider(index) {
        // Update background
        heroSection.style.background = heroBackgrounds[index];
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        
        // Update content
        const tagElement = document.querySelector('.hero .tag');
        const titleElement = document.querySelector('.hero h1');
        const descriptionElement = document.querySelector('.hero p');
        
        tagElement.textContent = heroContent[index].tag;
        titleElement.textContent = heroContent[index].title;
        descriptionElement.textContent = heroContent[index].description;
        
        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
        });
    });
    
    // Auto slide functionality
    let slideInterval = setInterval(() => {
        let nextSlide = (currentSlide + 1) % heroBackgrounds.length;
        updateSlider(nextSlide);
    }, 5000);
    
    // Reset interval when manually changing slides
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                let nextSlide = (currentSlide + 1) % heroBackgrounds.length;
                updateSlider(nextSlide);
            }, 5000);
        });
    });
    
    // Services Navigation
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const serviceCards = document.querySelectorAll('.service-card');
    
    let currentServiceIndex = 0;
    
    // Function to show/hide service cards based on screen size and current index
    function updateServiceCards() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
        
        let cardsPerView = 3;
        if (isMobile) cardsPerView = 1;
        else if (isTablet) cardsPerView = 2;
        
        serviceCards.forEach((card, index) => {
            if (index >= currentServiceIndex && index < currentServiceIndex + cardsPerView) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Initialize service cards
    updateServiceCards();
    
    // Add event listeners to navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentServiceIndex > 0) {
            currentServiceIndex--;
            updateServiceCards();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
        
        let cardsPerView = 3;
        if (isMobile) cardsPerView = 1;
        else if (isTablet) cardsPerView = 2;
        
        if (currentServiceIndex + cardsPerView < serviceCards.length) {
            currentServiceIndex++;
            updateServiceCards();
        }
    });
    
    // Update service cards on window resize
    window.addEventListener('resize', updateServiceCards);
    
    // Animate progress bars on scroll
    const progressBars = document.querySelectorAll('.progress-bar');
    
    function animateProgressBars() {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = width;
            }, 300);
        });
    }
    
    // Simple scroll detection for progress bar animation
    let animated = false;
    window.addEventListener('scroll', () => {
        const goalsSection = document.querySelector('.goals');
        if (!animated && goalsSection && window.scrollY + window.innerHeight >= goalsSection.offsetTop) {
            animateProgressBars();
            animated = true;
        }
    });
    
    // Ticker animation pause on hover
    const ticker = document.querySelector('.ticker-wrapper');
    
    ticker.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
    });
    
    ticker.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
    });
});
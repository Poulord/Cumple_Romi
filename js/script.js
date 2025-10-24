// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
    
    // Función para mostrar el navbar con fondo al hacer scroll
    const handleNavbarScroll = () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
            navbar.style.padding = '0.75rem 0';
        } else {
            navbar.classList.remove('shadow-sm');
            navbar.style.padding = '1rem 0';
        }
    };
    
    // Event listener para el scroll
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Controles del slider hero
    const heroSlides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.hero-controls .prev');
    const nextBtn = document.querySelector('.hero-controls .next');
    let currentSlide = 0;
    
    if (heroSlides.length > 0 && prevBtn && nextBtn) {
        // Función para cambiar el slide
        const goToSlide = (index) => {
            heroSlides.forEach(slide => slide.classList.remove('current'));
            
            // Asegurarse de que el índice está dentro del rango
            if (index < 0) {
                currentSlide = heroSlides.length - 1;
            } else if (index >= heroSlides.length) {
                currentSlide = 0;
            } else {
                currentSlide = index;
            }
            
            heroSlides[currentSlide].classList.add('current');
        };
        
        // Event listeners para los botones
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        
        // Auto cambio cada 5 segundos
        if (heroSlides.length > 1) {
            setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        }
    }
    
    // Smooth scrolling para enlaces con hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Toggle para los menús de navegación en móvil
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Cerrar el menú al hacer click fuera
        document.addEventListener('click', function(e) {
            const isNavbarOpen = navbarCollapse.classList.contains('show');
            
            if (isNavbarOpen && !navbarCollapse.contains(e.target) && e.target !== navbarToggler) {
                // Bootstrap tiene un método para cerrar el menú
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    }
    
    // Añadir al carrito (simulado)
    const addToCartButtons = document.querySelectorAll('.product-action:first-child');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Encontrar el nombre y precio del producto
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            
            // Mostrar una notificación (se podría implementar un toast/modal aquí)
            showNotification(`${productName} añadido al carrito`, 'success');
            
            // Actualizar el contador del carrito (simulado)
            updateCartCount();
        });
    });
    
    // Añadir a favoritos (simulado)
    const addToWishlistButtons = document.querySelectorAll('.product-action:nth-child(2)');
    
    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Encontrar el nombre del producto
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            
            // Mostrar una notificación
            showNotification(`${productName} añadido a favoritos`, 'info');
        });
    });
    
    // Vista rápida de producto (simulado)
    const quickViewButtons = document.querySelectorAll('.product-action:nth-child(3)');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Encontrar el nombre del producto
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            
            // Aquí se abriría un modal con la información del producto
            console.log(`Vista rápida de ${productName}`);
        });
    });
    
    // Newsletter form (simulado)
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Simulación de envío exitoso
                showNotification('¡Gracias por suscribirte a nuestra newsletter!', 'success');
                
                // Limpiar el campo de email
                emailInput.value = '';
            }
        });
    }
    
    // Función para mostrar notificaciones (simulada)
    function showNotification(message, type = 'info') {
        // Se podría implementar un sistema de notificaciones más avanzado
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar la notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Ocultar la notificación después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Eliminar el elemento después de la animación
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        // Cerrar la notificación al hacer click en el botón de cerrar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            
            // Eliminar el elemento después de la animación
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
    }
    
    // Función para actualizar el contador del carrito (simulada)
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            // Obtener el valor actual
            let count = parseInt(cartCount.textContent);
            
            // Incrementar el contador
            count++;
            
            // Actualizar el contador
            cartCount.textContent = count;
            
            // Animación simple
            cartCount.classList.add('pulse');
            
            // Quitar la clase de animación después de la animación
            setTimeout(() => {
                cartCount.classList.remove('pulse');
            }, 300);
        }
    }
    
    // Testimonios - Rotación automática (si hay múltiples testimonios)
    const setupTestimonialRotation = () => {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        if (testimonialCards.length > 3) {
            let currentIndex = 0;
            
            // Función para rotar testimonios
            const rotateTestimonials = () => {
                // Ocultar todos los testimonios con una animación
                testimonialCards.forEach(card => {
                    card.classList.add('fade-out');
                });
                
                // Después de que la animación de salida termine
                setTimeout(() => {
                    // Actualizar qué testimonios mostrar
                    testimonialCards.forEach((card, index) => {
                        // Mostrar sólo 3 testimonios a la vez
                        if (index >= currentIndex && index < currentIndex + 3) {
                            card.style.display = 'block';
                            card.classList.remove('fade-out');
                            card.classList.add('fade-in');
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // Actualizar el índice para la próxima rotación
                    currentIndex = (currentIndex + 3) % testimonialCards.length;
                }, 500);
            };
            
            // Rotar cada 5 segundos
            setInterval(rotateTestimonials, 5000);
        }
    };
    
    // Iniciar rotación de testimonios si hay suficientes
    setupTestimonialRotation();
    
    // Activar efectos de hover en dispositivos táctiles
    document.addEventListener('touchstart', function() {}, true);
}); 
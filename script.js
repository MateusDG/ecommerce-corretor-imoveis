// Smooth scrolling para links de navegação
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar funcionalidade aos dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            // Adicionar efeito visual ao clicar
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Funcionalidade do botão de busca
    const searchBtn = document.querySelector('.btn-search');
    const searchInputs = document.querySelectorAll('.dropdown');
    
    searchBtn.addEventListener('click', function() {
        // Simular busca
        const searchData = {};
        searchInputs.forEach((input, index) => {
            const labels = ['localizacao', 'tipo', 'area', 'finalidade'];
            searchData[labels[index]] = input.querySelector('.dropdown-text').textContent;
        });
        
        console.log('Buscando terrenos rurais com:', searchData);
        
        // Adicionar feedback visual
        this.textContent = 'Buscando...';
        this.disabled = true;
        
        setTimeout(() => {
            this.textContent = 'Search';
            this.disabled = false;
        }, 2000);
    });

    // Animação de hover para cards de propriedades
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Funcionalidade do botão de seta na propriedade em destaque
    const arrowBtn = document.querySelector('.btn-arrow');
    if (arrowBtn) {
        arrowBtn.addEventListener('click', function() {
            // Simular navegação para detalhes da propriedade
            console.log('Navegando para detalhes da propriedade...');
            
            // Adicionar efeito de clique
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 200);
        });
    }

    // Animação para os cards de features
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0px 15px 25px 0px rgba(41, 41, 42, 0.15)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0px 10px 20px 0px rgba(41, 41, 42, 0.07)';
        });
    });

    // Funcionalidade do botão "View more"
    const viewMoreBtn = document.querySelector('.btn-view-more');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function() {
            console.log('Carregando mais propriedades...');
            
            // Simular carregamento
            this.textContent = 'Carregando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'View more';
                this.disabled = false;
                // Aqui você poderia adicionar mais cards de propriedades
            }, 1500);
        });
    }

    // Animação de entrada para elementos quando ficam visíveis
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animação de entrada a seções específicas
    const animatedElements = document.querySelectorAll('.section-header, .feature-card, .recent-row');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Funcionalidade para links de navegação
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os itens
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Adicionar classe active ao item clicado
            this.classList.add('active');
            
            // Simular navegação
            console.log('Navegando para:', this.textContent);
        });
    });

    // Efeito parallax suave no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Funcionalidade para propriedades do footer
    const footerProperties = document.querySelectorAll('.footer-property');
    
    footerProperties.forEach(property => {
        property.addEventListener('click', function() {
            console.log('Navegando para propriedade do footer...');
            
            // Adicionar efeito visual
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
        
        property.style.cursor = 'pointer';
        property.style.transition = 'transform 0.2s ease';
    });

    // Adicionar funcionalidade de busca por Enter
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('dropdown')) {
                searchBtn.click();
            }
        }
    });

    // Animação suave para botões
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Lazy loading para imagens
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                img.onload = function() {
                    this.style.opacity = '1';
                };
                
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Adicionar classe para navegação ativa baseada na seção visível
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.className;
                
                // Atualizar navegação ativa baseada na seção visível
                navItems.forEach(nav => {
                    nav.classList.remove('active');
                    if (sectionId.includes('hero') && nav.textContent === 'Home') {
                        nav.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// Função para criar efeito de digitação no título principal
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efeito de digitação ao carregar a página
window.addEventListener('load', function() {
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        const titleText = mainTitle.textContent;
        setTimeout(() => {
            typeWriter(mainTitle, titleText, 50);
        }, 1000);
    }
});

// Adicionar funcionalidade de scroll suave para âncoras
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para alternar tema (caso queira implementar futuramente)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Carregar tema salvo
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

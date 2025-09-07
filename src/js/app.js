// Smooth scrolling para links de navegação
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar funcionalidade aos dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Dropdown menus simples com opções pré-definidas
    function createMenu(dropdown, items) {
        // Remove menus anteriores
        document.querySelectorAll('.dropdown-menu').forEach(m => m.remove());
        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';
        Object.assign(menu.style, {
            position: 'absolute',
            background: '#fff',
            border: '1px solid #D0D5DD',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 1500,
            marginTop: '8px',
            minWidth: dropdown.offsetWidth + 'px',
            padding: '6px 0'
        });
        items.forEach(it => {
            const opt = document.createElement('div');
            opt.textContent = it.label;
            Object.assign(opt.style, {
                padding: '8px 12px',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px'
            });
            opt.addEventListener('mouseenter', () => (opt.style.background = '#F9FAFB'));
            opt.addEventListener('mouseleave', () => (opt.style.background = 'transparent'));
            opt.addEventListener('click', () => {
                dropdown.querySelector('.dropdown-text').textContent = it.label;
                // Armazena metadados para busca
                dropdown.dataset.value = it.value ?? '';
                if (it.min != null) dropdown.dataset.min = String(it.min);
                else delete dropdown.dataset.min;
                if (it.max != null) dropdown.dataset.max = String(it.max);
                else delete dropdown.dataset.max;
                menu.remove();
            });
            menu.appendChild(opt);
        });
        // Posicionar o menu
        const rect = dropdown.getBoundingClientRect();
        menu.style.top = window.scrollY + rect.bottom + 'px';
        menu.style.left = window.scrollX + rect.left + 'px';
        document.body.appendChild(menu);
        // Fechar ao clicar fora
        const close = (e) => {
            if (!menu.contains(e.target) && !dropdown.contains(e.target)) {
                menu.remove();
                document.removeEventListener('mousedown', close);
            }
        };
        document.addEventListener('mousedown', close);
    }

    const filterOptions = {
        localizacao: [
            { label: 'Qualquer localização', value: '' },
            { label: 'São Paulo (SP)', value: 'SP' },
            { label: 'Minas Gerais (MG)', value: 'MG' }
        ],
        tipo: [
            { label: 'Qualquer tipo', value: '' },
            { label: 'Chácara de Lazer', value: 'chacara' },
            { label: 'Fazenda Produtiva', value: 'fazenda' }
        ],
        area: [
            { label: 'Qualquer área', value: '', min: null, max: null },
            { label: 'Até 20 ha', value: '0-20', min: 0, max: 20 },
            { label: '20 a 100 ha', value: '20-100', min: 20, max: 100 },
            { label: 'Acima de 100 ha', value: '100+', min: 100, max: null }
        ],
        finalidade: [
            { label: 'Qualquer finalidade', value: '' },
            { label: 'Moradia', value: 'Moradia' },
            { label: 'Lazer', value: 'Lazer' },
            { label: 'Agronegócio', value: 'Agronegócio' },
            { label: 'Produção', value: 'Produção' },
            { label: 'Investimento', value: 'Investimento' }
        ]
    };

    dropdowns.forEach((dropdown, idx) => {
        dropdown.style.position = 'relative';
        dropdown.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => { this.style.transform = 'scale(1)'; }, 150);
            const key = ['localizacao', 'tipo', 'area', 'finalidade'][idx];
            createMenu(dropdown, filterOptions[key]);
        });
    });

    // Funcionalidade do botão de busca
    const searchBtn = document.querySelector('.btn-search');
    const searchInputs = document.querySelectorAll('.dropdown');

    function getFiltersFromUI() {
        const filters = {};
        const [loc, tipo, area, fin] = Array.from(searchInputs);
        // Localização por estado
        filters.state = (loc?.dataset.value || '').toUpperCase();
        // Tipo
        filters.type = (tipo?.dataset.value || '').toLowerCase(); // 'chacara' | 'fazenda'
        // Área
        filters.areaMin = area?.dataset.min ? Number(area.dataset.min) : null;
        filters.areaMax = area?.dataset.max ? Number(area.dataset.max) : null;
        // Finalidade
        filters.purpose = fin?.dataset.value || '';
        return filters;
    }

    async function performSearch() {
        const btn = searchBtn;
        try {
            btn.textContent = 'Buscando...';
            btn.disabled = true;

            const f = getFiltersFromUI();
            const result = await window.DB.searchProperties(f);
            renderPropertiesResults(result);
        } catch (e) {
            console.error('Erro na busca:', e);
        } finally {
            btn.textContent = 'Buscar Terrenos';
            btn.disabled = false;
        }
    }

    function renderPropertiesResults(properties) {
        const container = document.querySelector('.recent-content');
        if (!container) return;
        container.innerHTML = '';
        if (!properties.length) {
            const empty = document.createElement('div');
            empty.className = 'recent-row';
            empty.innerHTML = '<div class="recent-info"><div class="recent-text"><h3 class="recent-title">Nenhuma propriedade encontrada</h3><p class="recent-desc">Ajuste os filtros e tente novamente.</p></div></div>';
            container.appendChild(empty);
            registerAnimatedElements('.recent-row');
            return;
        }
        const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
        properties.forEach((p, idx) => {
            const row = document.createElement('div');
            row.className = 'recent-row' + (idx % 2 === 1 ? ' reverse' : '');
            const price = typeof p.priceBRL === 'number' ? brl.format(p.priceBRL) : '';
            const imgSrc = Array.isArray(p.images) && p.images.length ? p.images[0] : '';
            const infra = Array.isArray(p.infrastructure) ? p.infrastructure.join(', ') : '';
            const idealFor = Array.isArray(p.idealFor) ? p.idealFor.join(', ') : '';
            const leftImage = `
                <div class="recent-image">
                    <img src="${imgSrc}" alt="${p.title || 'Propriedade'}">
                </div>`;
            const rightInfo = `
                <div class="recent-info">
                    <div class="recent-text">
                        <h3 class="recent-title">${p.title || ''}</h3>
                        <p class="recent-desc">
                            ${p.areaHectares ? `<strong>Área:</strong> ${p.areaHectares} hectares<br>` : ''}
                            ${p.location ? `<strong>Localização:</strong> ${p.location}<br>` : ''}
                            ${infra ? `<strong>Infraestrutura:</strong> ${infra}<br>` : ''}
                            ${p.soil ? `<strong>Solo:</strong> ${p.soil}<br>` : ''}
                            ${p.access ? `<strong>Acesso:</strong> ${p.access}<br>` : ''}
                            ${idealFor ? `<strong>Ideal para:</strong> ${idealFor}` : ''}
                        </p>
                    </div>
                    <div class="recent-price">${price}</div>
                </div>`;
            row.innerHTML = idx % 2 === 1 ? rightInfo + leftImage : leftImage + rightInfo;
            container.appendChild(row);
        });
        registerAnimatedElements('.recent-row');
    }

    searchBtn.addEventListener('click', performSearch);

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

    // Helper to register animations on newly added elements
    function registerAnimatedElements(selectors) {
        const els = document.querySelectorAll(selectors);
        els.forEach((el) => {
            if (el.dataset._observed) return;
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
            el.dataset._observed = '1';
        });
    }

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

    // Lazy loading / fade-in para imagens (corrigido)
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const img = entry.target;
            img.style.transition = 'opacity 0.5s ease';

            if (img.complete) {
                // Imagem já carregada (cache) – garanta que fique visível
                img.style.opacity = '1';
            } else {
                // Preparar fade-in quando terminar de carregar
                img.style.opacity = '0';
                img.addEventListener(
                    'load',
                    () => {
                        img.style.opacity = '1';
                    },
                    { once: true }
                );
            }

            imageObserver.unobserve(img);
        });
    });

    images.forEach((img) => {
        // Estado inicial: se já carregada, mantenha visível; senão, prepare para fade-in
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
        }
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

    // Botão para popular dados (apenas em localhost para evitar uso indevido)
    try {
        const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        if (isLocal && window.seedDatabase) {
            const btn = document.createElement('button');
            btn.textContent = 'Popular dados (Firestore)';
            btn.className = 'btn-primary';
            btn.style.position = 'fixed';
            btn.style.right = '16px';
            btn.style.bottom = '16px';
            btn.style.zIndex = '2000';
            btn.style.padding = '10px 16px';
            btn.addEventListener('click', async () => {
                btn.disabled = true;
                const original = btn.textContent;
                btn.textContent = 'Enviando...';
                try {
                    await window.seedDatabase();
                    btn.textContent = 'Concluído!';
                } catch (e) {
                    console.error('Falha ao popular dados:', e);
                    btn.textContent = 'Erro (ver console)';
                } finally {
                    setTimeout(() => {
                        btn.textContent = original;
                        btn.disabled = false;
                    }, 2000);
                }
            });
            document.body.appendChild(btn);
        }
    } catch {}

    // Firestore data binding
    (async function connectFirestoreAndRender() {
        try {
            const db = window.firebaseDb;
            if (!db) return; // Firebase not initialized

            // Fetch features
            try {
                const features = await window.DB.getFeatures();
                const featuresContainer = document.querySelector('.features-cards');
                if (featuresContainer && features.length) {
                    featuresContainer.innerHTML = '';
                    features.forEach((data) => {
                        const card = document.createElement('div');
                        card.className = 'feature-card';
                        card.innerHTML = `
                            <h3 class="feature-title">${data.title || ''}</h3>
                            <p class="feature-desc">${data.description || ''}</p>
                        `;
                        featuresContainer.appendChild(card);
                    });
                    registerAnimatedElements('.feature-card');
                }
            } catch (e) { console.warn('Falha ao carregar features', e); }

            // Fetch property types
            try {
                const types = await window.DB.getPropertyTypes();
                const grid = document.querySelector('.types-grid');
                if (grid && types.length) {
                    grid.innerHTML = '';
                    types.forEach((t) => {
                        const card = document.createElement('div');
                        card.className = 'type-card';
                        const feats = Array.isArray(t.features) ? t.features : [];
                        card.innerHTML = `
                            <div class="type-icon">${t.icon || ''}</div>
                            <h3 class="type-title">${t.title || ''}</h3>
                            <p class="type-desc">${t.description || ''}</p>
                            <ul class="type-features">
                                ${feats.map((f) => `<li>✓ ${f}</li>`).join('')}
                            </ul>
                        `;
                        grid.appendChild(card);
                    });
                    registerAnimatedElements('.type-card');
                }
            } catch (e) { console.warn('Falha ao carregar tipos de propriedade', e); }

            // Fetch recent properties
            try {
                const props = await window.DB.getRecentProperties();
                const list = document.querySelector('.recent-content');
                if (list && props.length) {
                    list.innerHTML = '';
                    const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
                    let idx = 0;
                    props.forEach((p) => {
                        const row = document.createElement('div');
                        row.className = 'recent-row' + (idx % 2 === 1 ? ' reverse' : '');

                        const price = typeof p.priceBRL === 'number' ? brl.format(p.priceBRL) : '';
                        const imgSrc = Array.isArray(p.images) && p.images.length ? p.images[0] : '';
                        const infra = Array.isArray(p.infrastructure) ? p.infrastructure.join(', ') : '';
                        const idealFor = Array.isArray(p.idealFor) ? p.idealFor.join(', ') : '';

                        const leftImage = `
                            <div class="recent-image">
                                <img src="${imgSrc}" alt="${p.title || 'Propriedade'}">
                            </div>`;
                        const rightInfo = `
                            <div class="recent-info">
                                <div class="recent-text">
                                    <h3 class="recent-title">${p.title || ''}</h3>
                                    <p class="recent-desc">
                                        ${p.areaHectares ? `<strong>Área:</strong> ${p.areaHectares} hectares<br>` : ''}
                                        ${p.location ? `<strong>Localização:</strong> ${p.location}<br>` : ''}
                                        ${infra ? `<strong>Infraestrutura:</strong> ${infra}<br>` : ''}
                                        ${p.soil ? `<strong>Solo:</strong> ${p.soil}<br>` : ''}
                                        ${p.access ? `<strong>Acesso:</strong> ${p.access}<br>` : ''}
                                        ${idealFor ? `<strong>Ideal para:</strong> ${p.idealFor}` : ''}
                                    </p>
                                </div>
                                <div class="recent-price">${price}</div>
                            </div>`;

                        row.innerHTML = idx % 2 === 1 ? rightInfo + leftImage : leftImage + rightInfo;
                        list.appendChild(row);
                        idx++;
                    });
                    registerAnimatedElements('.recent-row');
                }
            } catch (e) { console.warn('Falha ao carregar propriedades recentes', e); }

            // Footer contact
            try {
                const c = await window.DB.getContact();
                if (c) {
                    const addrEl = document.querySelector('.footer-contact-address');
                    if (addrEl && c.address) addrEl.textContent = c.address;
                    const details = document.querySelector('.footer-contact-details');
                    if (details) {
                        details.innerHTML = `
                            ${c.phone ? `<p>Telefone: ${c.phone}</p>` : ''}
                            ${c.email ? `<p>Email: ${c.email}</p>` : ''}
                            ${c.website ? `<p>Website: ${c.website}</p>` : ''}
                            ${c.whatsapp ? `<p>WhatsApp: ${c.whatsapp}</p>` : ''}
                        `;
                    }
                }
            } catch (e) { console.warn('Falha ao carregar contato', e); }
        } catch (err) {
            console.warn('Firestore não disponível', err);
        }
    })();
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

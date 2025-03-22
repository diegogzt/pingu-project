// Objeto para almacenar los filtros activos
let activeFilters = {
    priceMin: null,
    priceMax: null,
    categories: [],
    rarities: [],
    stats: []
};

document.addEventListener('DOMContentLoaded', () => {
    // Cambiar el número de columnas del grid (ahora flex)
    document.querySelectorAll('.grid-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Resaltar el botón activo
            document.querySelectorAll('.grid-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            const columns = button.getAttribute('data-columns');
            
            // Actualizar clases de los elementos para cambiar la vista
            if (columns === "1") {
                updateMarketItemClasses('two-columns');
                // Aplicar modo de 2 cartas por fila
                applyTwoCardsStyle();
                // Añadir clase m1-active al body para aplicar estilos CSS específicos
                document.body.classList.add('m1-active');
            } else if (columns === "2") {
                updateMarketItemClasses('four-columns');
                // Restaurar estilos originales
                resetCardStyles();
                // Remover clase m1-active del body al cambiar de vista
                document.body.classList.remove('m1-active');
            } else if (columns === "3") {
                updateMarketItemClasses('six-columns');
                // Remover clase m1-active del body al cambiar de vista
                document.body.classList.remove('m1-active');
            }
        });
    });
    
    // Inicializar filtros
    setupFilters();

    // Manejar el clic en el botón "m2" para establecer el estilo por defecto
    const m2Button = document.getElementById('m2');
    if (m2Button) {
        m2Button.addEventListener('click', () => {
            // Remover la clase "m3-style" del body si está presente
            document.body.classList.remove('m3-style');
            
            // Remover clases relacionadas con m3 de todos los elementos relevantes
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('m3-card');
            });
            
            document.querySelectorAll('.card-image').forEach(img => {
                img.classList.remove('m3-card-image');
            });
            
            document.querySelectorAll('.card-info').forEach(info => {
                info.classList.remove('m3-card-info');
            });
            
            document.querySelectorAll('.card-header').forEach(header => {
                header.classList.remove('m3-card-header');
            });
            
            // Restablecer estilos por defecto
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const cardStats = card.querySelector('.card-stats');
                const cardActions = card.querySelector('.card-actions');
                
                if (cardStats) cardStats.style.display = 'flex';
                if (cardActions) cardActions.style.display = 'flex';
                
                // Restaurar aspecto y tamaños originales
                card.style.flexBasis = '';
                card.style.width = '';
                card.style.maxWidth = '';
                card.style.aspectRatio = '';
            });
            
            // Ajustar altura de las cartas según el estilo por defecto
            ajustarAlturaCards();
        });
    }

    // Implementar búsqueda por ID de token
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        // Función para realizar la búsqueda
        function performSearch(searchTerm, exactMatch = false) {
            searchTerm = searchTerm.trim().toLowerCase();
            const cards = document.querySelectorAll('.card');
            let resultsFound = false;
            
            // Si no hay término de búsqueda, mostrar todas las tarjetas
            if (searchTerm === '') {
                cards.forEach(card => {
                    card.style.display = '';
                });
                
                // Eliminar mensaje de "no se encontraron resultados" si existe
                removeNoResultsMessage();
                return;
            }
            
            // Eliminar cualquier resaltado previo
            cards.forEach(card => {
                card.classList.remove('highlighted-card');
            });
            
            cards.forEach(card => {
                // Buscar el ID del token en el elemento card-id
                const tokenIdElement = card.querySelector('.card-id');
                if (tokenIdElement) {
                    const tokenId = tokenIdElement.textContent.trim().toLowerCase();
                    
                    // Determinar si la tarjeta coincide con la búsqueda
                    let isMatch = false;
                    
                    if (exactMatch) {
                        // Búsqueda exacta
                        isMatch = tokenId === searchTerm;
                    } else {
                        // Búsqueda parcial
                        isMatch = tokenId.includes(searchTerm);
                    }
                    
                    // Mostrar u ocultar la tarjeta según si coincide con la búsqueda
                    if (isMatch) {
                        card.style.display = '';
                        resultsFound = true;
                        
                        // Si es una coincidencia exacta, resaltar la tarjeta
                        if (exactMatch || tokenId === searchTerm) {
                            card.classList.add('highlighted-card');
                            // Hacer scroll a la tarjeta encontrada
                            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            
                            // Quitar el resaltado después de un tiempo
                            setTimeout(() => {
                                card.classList.remove('highlighted-card');
                            }, 2000);
                        }
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            // Mostrar mensaje si no se encontraron resultados
            if (!resultsFound) {
                showNoResultsMessage();
            } else {
                removeNoResultsMessage();
            }
            
            return resultsFound;
        }
        
        // Búsqueda en tiempo real mientras se escribe
        searchBar.addEventListener('input', function() {
            performSearch(this.value, false); // Búsqueda parcial
        });
        
        // Buscar al presionar Enter
        searchBar.addEventListener('keydown', function(e) {
            // Si la tecla presionada es Enter
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevenir comportamiento por defecto
                
                const searchTerm = this.value.trim().toLowerCase();
                
                // Intentar primero una búsqueda exacta
                const exactMatchFound = performSearch(searchTerm, true);
                
                // Si no se encuentra una coincidencia exacta, realizar una búsqueda parcial
                if (!exactMatchFound) {
                    performSearch(searchTerm, false);
                }
            }
        });
        
        // Limpiar la búsqueda cuando el campo esté vacío o se presione Escape
        searchBar.addEventListener('keyup', function(e) {
            if (e.key === 'Escape' || this.value === '') {
                this.value = '';
                const cards = document.querySelectorAll('.card');
                
                cards.forEach(card => {
                    card.style.display = '';
                    card.classList.remove('highlighted-card');
                });
                
                removeNoResultsMessage();
            }
        });
    }

    // Manejar el clic en el botón "m3" para aplicar estilos de m3.css
    const m3Button = document.getElementById('m3');
    if (m3Button) {
        m3Button.addEventListener('click', () => {
            // Aplicar la clase "m3-style" al body o contenedor principal
            document.body.classList.toggle('m3-style');
            
            // Aplicar estilos de m3.css a las cartas
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.classList.toggle('m3-card');
            });
            
            // Actualizar otros elementos según los estilos de m3.css
            const cardImages = document.querySelectorAll('.card-image');
            cardImages.forEach(img => {
                img.classList.toggle('m3-card-image');
            });
            
            const cardInfos = document.querySelectorAll('.card-info');
            cardInfos.forEach(info => {
                info.classList.toggle('m3-card-info');
            });
            
            const cardHeaders = document.querySelectorAll('.card-header');
            cardHeaders.forEach(header => {
                header.classList.toggle('m3-card-header');
            });
            
            // Ajustar la vista según los estilos aplicados
            adjustCardStyles();
            ajustarAlturaCards();
        });
    }

    // Función para ordenar elementos por precio
    function sortElementsByPrice(value) {
        const content = document.querySelector('.marketplace-container');
        const items = Array.from(document.querySelectorAll('.card'));
        
        items.sort((a, b) => {
            // Obtener el texto del precio y limpiarlo
            const priceTextA = a.querySelector('.card-number span').textContent.trim();
            const priceTextB = b.querySelector('.card-number span').textContent.trim();
            
            // Extraer solo los números del precio (eliminar símbolos de moneda y espacios)
            const priceA = parseFloat(priceTextA.replace(/[^0-9.]/g, ''));
            const priceB = parseFloat(priceTextB.replace(/[^0-9.]/g, ''));
            
            // Manejar casos donde el precio no es un número válido
            if (isNaN(priceA)) return 1;
            if (isNaN(priceB)) return -1;
            if (isNaN(priceA) && isNaN(priceB)) return 0;
            
            // Ordenar según la selección
            return value === 'low' ? priceA - priceB : priceB - priceA;
        });

        // Limpiar y reordenar los elementos
        content.innerHTML = '';
        items.forEach(item => content.appendChild(item));
    }

    // Manejar cambios en los selectores de precio (tanto en vista normal como medium)
    document.querySelectorAll('.price-filter').forEach(select => {
        select.addEventListener('change', (event) => {
            const value = event.target.value;
            if (value === 'all') {
                // Si se selecciona "All Prices", recargar la página para mostrar el orden original
                window.location.reload();
                return;
            }
            sortElementsByPrice(value);
        });
    });

    // Botón de filtros para pantalla mediana
    const filterButton = document.querySelector('.sidebar-show-medium');
    const mediumSidebarFilters = document.querySelector('.medium-sidebar-filters');
    const sidebarMedium = document.querySelector('.sidebar-medium');

    if (filterButton && mediumSidebarFilters) {
        filterButton.addEventListener('click', function() {
            mediumSidebarFilters.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        });

        // Cerrar al hacer clic fuera del sidebar
        mediumSidebarFilters.addEventListener('click', function(e) {
            if (e.target === mediumSidebarFilters) {
                mediumSidebarFilters.classList.remove('active');
                document.body.style.overflow = ''; // Restaurar scroll del body

                // Esperar a que termine la animación antes de ocultar completamente
                sidebarMedium.addEventListener('transitionend', function() {
                    if (!mediumSidebarFilters.classList.contains('active')) {
                        mediumSidebarFilters.style.pointerEvents = 'none';
                    }
                }, { once: true });
            }
        });

        // Prevenir que los clics dentro del sidebar cierren el modal
        sidebarMedium.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Establecer vista por defecto (4 columnas)
    window.addEventListener('load', function() {
        updateMarketItemClasses('four-columns');
        
        // Marcar el botón de 4 columnas como activo por defecto
        const defaultButton = document.querySelector('.grid-btn[data-columns="2"]');
        if (defaultButton) {
            document.querySelectorAll('.grid-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            defaultButton.classList.add('active');
        }
        
        // Asegurarse de que los estilos m3 no estén aplicados al cargar la página
        document.body.classList.remove('m3-style');
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('m3-card');
        });
        document.querySelectorAll('.card-image').forEach(img => {
            img.classList.remove('m3-card-image');
        });
        document.querySelectorAll('.card-info').forEach(info => {
            info.classList.remove('m3-card-info');
        });
        document.querySelectorAll('.card-header').forEach(header => {
            header.classList.remove('m3-card-header');
        });
    });
    
    // Configurar la estructura de los summaries y añadir barras de búsqueda
    setupDetailsSummaries();
    
    // Configurar los eventos de búsqueda en los summaries
    setupSummarySearches();

    // Función para mostrar la animación del carrito de compras
    function showCartAnimation(event) {
        // Prevenir comportamiento predeterminado del botón
        event.preventDefault();
        
        // Crear el contenedor de la animación si no existe
        let cartContainer = document.querySelector('.cart-animation-container');
        if (!cartContainer) {
            cartContainer = document.createElement('div');
            cartContainer.className = 'cart-animation-container';
            
            // Crear el icono del carrito
            const cartIcon = document.createElement('div');
            cartIcon.className = 'cart-icon';
            
            // Crear el mensaje de éxito
            const successMessage = document.createElement('div');
            successMessage.className = 'cart-success-message';
            successMessage.textContent = '¡Añadido al carrito!';
            
            // Crear el contenedor de partículas
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'cart-particles';
            
            // Agregar 12 partículas con colores aleatorios
            const colors = ['#ff5555', '#ffcc00', '#00aaff', '#00ff00', '#ff00ff'];
            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Posición aleatoria
                const angle = (i / 12) * Math.PI * 2;
                particle.style.setProperty('--x', Math.cos(angle));
                particle.style.setProperty('--y', Math.sin(angle));
                
                particlesContainer.appendChild(particle);
            }
            
            // Ensamblar los componentes
            cartIcon.appendChild(particlesContainer);
            cartContainer.appendChild(cartIcon);
            cartContainer.appendChild(successMessage);
            document.body.appendChild(cartContainer);
        }
        
        // Mostrar la animación
        cartContainer.classList.add('show');
        
        // Ocultar después de 1.5 segundos
        setTimeout(() => {
            cartContainer.classList.remove('show');
        }, 1500);
        
        // Opcional: Destacar la tarjeta que se está añadiendo
        const card = event.target.closest('.card');
        if (card) {
            card.classList.add('highlighted-card');
            setTimeout(() => {
                card.classList.remove('highlighted-card');
            }, 2000);
        }
    }

    // Agregar event listeners a todos los botones de añadir
    function setupCartAnimations() {
        const addButtons = document.querySelectorAll('.add-btn');
        addButtons.forEach(button => {
            button.addEventListener('click', showCartAnimation);
        });
    }

    // Ejecutar la configuración cuando el DOM esté completamente cargado
    setupCartAnimations();
    
    // También configurar para los botones añadidos dinámicamente
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                setupCartAnimations();
            }
        });
    });
    
    // Observar cambios en el contenedor del marketplace
    const marketplaceContainer = document.querySelector('.marketplace-container');
    if (marketplaceContainer) {
        observer.observe(marketplaceContainer, { childList: true, subtree: true });
    }
});

// Función para actualizar las clases de los elementos de mercado
function updateMarketItemClasses(className) {
    const marketItems = document.querySelectorAll('.market-item');
    marketItems.forEach(item => {
        item.classList.remove('two-columns', 'four-columns', 'six-columns');
        item.classList.add(className);
    });
}

// Función para ajustar estilos de las cartas según si están en modo m3 o no
function adjustCardStyles() {
    const isM3Mode = document.body.classList.contains('m3-style');
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Ajustar la visibilidad de elementos según el modo m3
        const cardStats = card.querySelector('.card-stats');
        const cardActions = card.querySelector('.card-actions');
        
        if (isM3Mode) {
            // Aplicar estilos de m3.css
            if (cardStats) cardStats.style.display = 'none';
            if (cardActions) cardActions.style.display = 'none';
            
            // Ajustar aspecto y tamaños según m3.css
            card.style.flexBasis = '13%';
            card.style.width = '13%';
            card.style.maxWidth = '13%';
            card.style.aspectRatio = '0.7/1';
        } else {
            // Restaurar estilos originales
            if (cardStats) cardStats.style.display = 'flex';
            if (cardActions) cardActions.style.display = 'flex';
            
            // Restaurar aspecto y tamaños originales
            card.style.flexBasis = '';
            card.style.width = '';
            card.style.maxWidth = '';
            card.style.aspectRatio = '';
        }
    });
}

// Función para aplicar el estilo de 2 cartas por fila (m1)
function applyTwoCardsStyle() {
    // Ahora la mayor parte de los estilos se aplican mediante CSS
    // con la clase m1-active en el elemento body
    
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Mantener la información visible (a diferencia de m3)
        const cardStats = card.querySelector('.card-stats');
        const cardActions = card.querySelector('.card-actions');
        
        if (cardStats) cardStats.style.display = 'flex';
        if (cardActions) cardActions.style.display = 'flex';
        ajustarAlturaCardsM1()
    });
    
}

// Función para restaurar los estilos originales de las cartas
function resetCardStyles() {
    const cards = document.querySelectorAll('.card');
    
    // Eliminar la clase m1-active del body para desactivar los estilos de m1.css
    document.body.classList.remove('m1-active');
    
    cards.forEach(card => {
        // Restaurar tamaños originales
        card.style.flexBasis = '';
        card.style.width = '';
        card.style.maxWidth = '';
        card.style.minWidth = '';
        card.style.height = '';
        card.style.minHeight = '';
        card.style.maxHeight = '';
        card.style.aspectRatio = '';
        card.style.display = '';
        card.style.flexDirection = '';
        
        // Restaurar tamaños de fuente originales
        const cardId = card.querySelector('.card-id');
        const cardRarity = card.querySelector('.card-rarity');
        const cardStats = card.querySelector('.card-stats');
        const cardNumber = card.querySelector('.card-number');
        const buyBtn = card.querySelector('.buy-btn');
        const addBtn = card.querySelector('.add-btn');
        const cardImage = card.querySelector('.card-image');
        const cardInfo = card.querySelector('.card-info');
        const cardHeader = card.querySelector('.card-header');
        const cardActions = card.querySelector('.card-actions');
        
        // Restaurar componentes principales de la carta
        if (cardImage) {
            cardImage.style.height = '';
            cardImage.style.minHeight = '';
            cardImage.style.maxHeight = '';
            cardImage.style.overflow = '';
            cardImage.style.display = '';
            cardImage.style.alignItems = '';
            cardImage.style.justifyContent = '';
            
            // Restaurar imagen
            const img = cardImage.querySelector('img.image');
            if (img) {
                img.style.width = '';
                img.style.height = '';
                img.style.objectFit = '';
                img.style.objectPosition = '';
                img.style.maxWidth = '';
            }
        }
        
        // Restaurar footer de la carta
        if (cardInfo) {
            cardInfo.style.height = '';
            cardInfo.style.minHeight = '';
            cardInfo.style.maxHeight = '';
            cardInfo.style.overflow = '';
            cardInfo.style.padding = '';
            cardInfo.style.display = '';
            cardInfo.style.flexDirection = '';
            cardInfo.style.justifyContent = '';
        }
        
        // Restaurar elementos del footer
        if (cardHeader) cardHeader.style.marginBottom = '';
        if (cardStats) {
            cardStats.style.display = 'flex';
            cardStats.style.marginBottom = '';
            cardStats.style.fontSize = '';
        }
        if (cardNumber) cardNumber.style.marginBottom = '';
        
        // Limpiar los estilos inline para restaurar a los valores del CSS
        if (cardId) cardId.style.fontSize = '';
        if (cardRarity) cardRarity.style.fontSize = '';
        if (buyBtn) buyBtn.style.fontSize = '';
        if (addBtn) addBtn.style.fontSize = '';
        
        // Restaurar tamaño de los iconos
        const icons = card.querySelectorAll('.heart-icon, .lightning-icon, .ghost-icon, .sword-icon, .currency-icon');
        icons.forEach(icon => {
            if (icon.classList.contains('currency-icon')) {
                icon.style.width = '';
                icon.style.height = '';
            } else {
                icon.style.fontSize = '';
            }
        });
        
        // Asegurar que la información y acciones están visibles
        if (cardActions) cardActions.style.display = 'flex';
    });
    
    // Aplicar reajuste de altura después de resetear los estilos
    setTimeout(() => {
        ajustarAlturaCards();
        window.dispatchEvent(new Event('resize'));
    }, 100);
}

// Función para ajustar la altura de las tarjetas basada en su ancho
function ajustarAlturaCards() {
    // Si m1 está activo, no aplicar esta función
    if (document.body.classList.contains('m1-active')) {
        return;
    }
    
    // Seleccionar todas las tarjetas
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Obtener el ancho actual de la tarjeta
        const cardWidth = card.offsetWidth;
        
        // Calcular la altura (ancho + 30% del ancho)
        const cardHeight = cardWidth + (cardWidth * 0.6);
        
        // Aplicar la altura calculada
        card.style.height = `${cardHeight}px`;
    });
}

function ajustarAlturaCardsM1() {
    // Seleccionar todas las tarjetas
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Obtener el ancho actual de la tarjeta
        const cardWidth = card.offsetWidth;

        // Calcular la altura (ancho + 30% del ancho)
        const cardHeight = cardWidth + (cardWidth * 0.3);

        // Aplicar la altura calculada
        card.style.height = `${cardHeight}px`;
    });
}

// Ejecutar la función cuando se carga la página
window.addEventListener('load', function() {
    // Si m1 está activo, ajustar las cartas con ajustarAlturaCardsM1
    if (document.body.classList.contains('m1-active')) {
        ajustarAlturaCardsM1();
    } else {
        // Si no, usar el ajuste normal
        ajustarAlturaCards();
    }
});

// Ejecutar la función cuando se redimensiona la ventana
window.addEventListener('resize', function() {
    // Si m1 está activo, ajustar las cartas con ajustarAlturaCardsM1
    if (document.body.classList.contains('m1-active')) {
        ajustarAlturaCardsM1();
    } else {
        // Si no, usar el ajuste normal
        ajustarAlturaCards();
    }
});


// Funcionalidad para el botón de filtros móvil y el modal
function setupFiltersModal() {
    const filtersBtn = document.querySelector('.filters-mobile-btn');
    const filtersModal = document.getElementById('filters-modal');
    const closeBtn = document.querySelector('.close-filters-btn');
    
    if (filtersBtn && filtersModal && closeBtn) {
        // Abrir el modal al hacer clic en el botón de filtros
        filtersBtn.addEventListener('click', () => {
            filtersModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevenir scroll en el body
        });
        
        // Cerrar el modal al hacer clic en el botón de cerrar
        closeBtn.addEventListener('click', () => {
            filtersModal.classList.remove('show');
            document.body.style.overflow = ''; // Restaurar scroll en el body
        });
        
        // Cerrar el modal al hacer clic fuera del contenido del modal
        filtersModal.addEventListener('click', (e) => {
            if (e.target === filtersModal) {
                filtersModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
        
        // Cerrar el modal con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && filtersModal.classList.contains('show')) {
                filtersModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
}

// Ejecutar la configuración del modal de filtros cuando se carga la página
document.addEventListener('DOMContentLoaded', setupFiltersModal);

// Función para configurar todos los filtros
function setupFilters() {
    // Filtro de rango de precios
    setupPriceRangeFilter();
    
    // Filtro de categorías (PP0, PP1, PP2)
    setupCategoryFilter();
    
    // Filtro de rarezas (Legendary, Mythic, Rare, Common)
    setupRarityFilter();
    
    // Filtro de estadísticas
    setupStatsFilter();
    
    // Filtro de propiedades
    setupPropertiesFilter();
}

// Configuración del filtro de rango de precios
function setupPriceRangeFilter() {
    // Obtener todos los inputs de precio mínimo y máximo (tanto en sidebar como en modal)
    const minPriceInputs = document.querySelectorAll('#price-range');
    const maxPriceInputs = document.querySelectorAll('#price-range-max');
    
    // Configurar evento input para precio mínimo
    minPriceInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            activeFilters.priceMin = isNaN(value) ? null : value;
            
            // Sincronizar valores entre todos los inputs de precio mínimo
            minPriceInputs.forEach(otherInput => {
                if (otherInput !== this) {
                    otherInput.value = this.value;
                }
            });
            
            applyFilters();
        });
    });
    
    // Configurar evento input para precio máximo
    maxPriceInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            activeFilters.priceMax = isNaN(value) ? null : value;
            
            // Sincronizar valores entre todos los inputs de precio máximo
            maxPriceInputs.forEach(otherInput => {
                if (otherInput !== this) {
                    otherInput.value = this.value;
                }
            });
            
            applyFilters();
        });
    });
}

// Configuración del filtro de categorías
function setupCategoryFilter() {
    // Asignar IDs a los checkboxes de categoría para poder identificarlos
    const categoryLabels = document.querySelectorAll('.section-category .label-category');
    categoryLabels.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
            // Asignar ID al checkbox basado en el ID del label (pp0, pp1, pp2)
            checkbox.id = 'checkbox-' + label.id;
            
            // Añadir evento change
            checkbox.addEventListener('change', function() {
                const category = label.id;
                
                if (this.checked) {
                    // Añadir categoría a los filtros activos si no está ya
                    if (!activeFilters.categories.includes(category)) {
                        activeFilters.categories.push(category);
                    }
                } else {
                    // Eliminar categoría de los filtros activos
                    activeFilters.categories = activeFilters.categories.filter(cat => cat !== category);
                }
                
                // Sincronizar el estado del checkbox con su contraparte en el otro menú
                syncCheckboxState('checkbox-' + category, this.checked);
                
                applyFilters();
            });
        }
    });
}

// Configuración del filtro de rarezas
function setupRarityFilter() {
    // Asignar IDs a los checkboxes de rareza para poder identificarlos
    const rarityLabels = document.querySelectorAll('#rarity ~ .section-content .label-category');
    rarityLabels.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox) {
            // Asignar ID al checkbox basado en el ID del label (legendary, mythic, etc.)
            checkbox.id = 'checkbox-' + label.id;
            
            // Añadir evento change
            checkbox.addEventListener('change', function() {
                const rarity = label.id;
                
                if (this.checked) {
                    // Añadir rareza a los filtros activos si no está ya
                    if (!activeFilters.rarities.includes(rarity)) {
                        activeFilters.rarities.push(rarity);
                    }
                } else {
                    // Eliminar rareza de los filtros activos
                    activeFilters.rarities = activeFilters.rarities.filter(r => r !== rarity);
                }
                
                // Sincronizar el estado del checkbox con su contraparte en el otro menú
                syncCheckboxState('checkbox-' + rarity, this.checked);
                
                applyFilters();
            });
        }
    });
}

// Configuración del filtro de estadísticas
function setupStatsFilter() {
    // Encontrar la sección de estadísticas de manera más compatible con todos los navegadores
    const statsSections = Array.from(document.querySelectorAll('.section')).filter(section => {
        const title = section.querySelector('.section-title');
        return title && title.textContent.trim() === 'Stats';
    });
    
    statsSections.forEach(section => {
        const statsLabels = section.querySelectorAll('.label-category.icons');
        
        statsLabels.forEach((label, index) => {
            // Asignar ID a cada label de estadística si no tiene uno
            if (!label.id) {
                label.id = 'stat-' + index;
            }
            
            // Crear checkbox para cada estadística si no existe
            if (!label.querySelector('input[type="checkbox"]')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'input-category';
                checkbox.id = 'checkbox-' + label.id;
                label.appendChild(checkbox);
            }
            
            const checkbox = label.querySelector('input[type="checkbox"]');
            // Añadir evento change
            checkbox.addEventListener('change', function() {
                const statId = label.id;
                const statType = getStatTypeFromImage(label.querySelector('img').src);
                
                if (this.checked) {
                    // Añadir estadística a los filtros activos
                    if (!activeFilters.stats.includes(statType)) {
                        activeFilters.stats.push(statType);
                    }
                } else {
                    // Eliminar estadística de los filtros activos
                    activeFilters.stats = activeFilters.stats.filter(stat => stat !== statType);
                }
                
                // Sincronizar checkbox en todos los menús
                syncCheckboxState('checkbox-' + statId, this.checked);
                
                applyFilters();
            });
        });
    });
}

// Función para obtener el tipo de estadística a partir de la imagen
function getStatTypeFromImage(imageSrc) {
    if (imageSrc.includes('shield.png')) return 'heart';
    if (imageSrc.includes('energy.png')) return 'lightning';
    if (imageSrc.includes('life.png')) return 'ghost';
    if (imageSrc.includes('X.png')) return 'sword';
    return null;
}

// Configuración del filtro de propiedades
function setupPropertiesFilter() {
    // Obtener todas las propiedades (details > summary)
    const properties = document.querySelectorAll('details');
    
    properties.forEach(property => {
        const propertyName = property.querySelector('summary').textContent.trim();
        
        // Configurar los checkboxes dentro de cada propiedad
        const propertyOptions = property.querySelectorAll('.label-sumary');
        propertyOptions.forEach(option => {
            const optionText = option.textContent.trim().split(' ')[0]; // Obtener el texto del label sin el espacio y 'input'
            const checkbox = option.querySelector('input[type="checkbox"]');
            
            // Asignar ID único al checkbox
            const checkboxId = `property-${propertyName.toLowerCase()}-${optionText.toLowerCase()}`;
            checkbox.id = checkboxId;
            
            // Añadir evento change
            checkbox.addEventListener('change', function() {
                // No necesitamos almacenar estas propiedades en activeFilters
                // ya que usaremos los IDs directamente
                
                // Sincronizar el estado del checkbox con su contraparte en el otro menú
                syncCheckboxState(checkboxId, this.checked);
                
                applyFilters();
            });
        });
    });
}

// Sincronizar el estado de los checkboxes entre la sidebar y el modal
function syncCheckboxState(checkboxId, isChecked) {
    // Obtener todos los checkboxes con el mismo ID
    const checkboxes = document.querySelectorAll(`#${checkboxId}`);
    
    // Actualizar su estado
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
}

// Función principal para aplicar todos los filtros
function applyFilters() {
    // Obtener todas las cartas
    const cards = document.querySelectorAll('.card');
    
    // Verificar cada carta contra los filtros activos
    cards.forEach(card => {
        let showCard = true;
        
        // 1. Filtro de precio
        if (activeFilters.priceMin !== null || activeFilters.priceMax !== null) {
            // Buscar el precio dentro del price-container usando la estructura real de las cartas
            const priceContainer = card.querySelector('.price-container');
            if (priceContainer) {
                // El precio está en el primer span dentro del price-container
                const priceElement = priceContainer.querySelector('span');
                if (priceElement) {
                    const price = parseFloat(priceElement.textContent.trim());
                    
                    if (!isNaN(price)) { // Verificar que el precio sea un número válido
                        if (activeFilters.priceMin !== null && price < activeFilters.priceMin) {
                            showCard = false;
                        }
                        
                        if (activeFilters.priceMax !== null && price > activeFilters.priceMax) {
                            showCard = false;
                        }
                    }
                }
            }
        }
        
        // 2. Filtro de rareza
        if (activeFilters.rarities.length > 0) {
            const cardHeader = card.querySelector('.card-header');
            let cardRarity = '';
            
            // Determinar rareza por el id del header o por las clases de la carta
            if (cardHeader && cardHeader.id) {
                if (cardHeader.id === 'common2') {
                    // Corregir la discrepancia entre common2 y common
                    cardRarity = 'common';
                } else {
                    cardRarity = cardHeader.id;
                }
            } else if (card.classList.contains('legendary-card')) {
                cardRarity = 'legendary';
            } else if (card.classList.contains('mythic-card')) {
                cardRarity = 'mythic';
            } else if (card.classList.contains('rare-card')) {
                cardRarity = 'rare';
            } else if (card.classList.contains('common-card')) {
                cardRarity = 'common';
            }
            
            if (!activeFilters.rarities.includes(cardRarity)) {
                showCard = false;
            }
        }
        
        // 3. Filtro de estadísticas
        if (activeFilters.stats.length > 0) {
            const cardStats = card.querySelector('.card-stats');
            if (cardStats) {
                let hasRequiredStats = true;
                
                activeFilters.stats.forEach(statType => {
                    let statElement;
                    
                    switch(statType) {
                        case 'heart':
                            statElement = cardStats.querySelector('.heart-icon');
                            break;
                        case 'lightning':
                            statElement = cardStats.querySelector('.lightning-icon');
                            break;
                        case 'ghost':
                            statElement = cardStats.querySelector('.ghost-icon');
                            break;
                        case 'sword':
                            statElement = cardStats.querySelector('.sword-icon');
                            break;
                    }
                    
                    if (!statElement || !statElement.closest('.stat')) {
                        hasRequiredStats = false;
                    }
                });
                
                if (!hasRequiredStats) {
                    showCard = false;
                }
            } else {
                showCard = false;
            }
        }
        
        // Mostrar u ocultar la carta según el resultado del filtrado
        card.style.display = showCard ? '' : 'none';
    });
    
    // Mostrar mensaje si no hay resultados
    const visibleCards = document.querySelectorAll('.card[style=""], .card:not([style*="display: none"])');
    if (visibleCards.length === 0) {
        showNoResultsMessage();
    } else {
        removeNoResultsMessage();
    }
}

// Función para configurar la estructura de los summaries con barras de búsqueda
function setupDetailsSummaries() {
    // Obtener todos los elementos details
    const detailsElements = document.querySelectorAll('details');
    
    detailsElements.forEach(details => {
        // Obtener el summary
        const summary = details.querySelector('summary');
        
        // Guardar el texto original del summary
        const originalText = summary.textContent.trim();
        
        // Limpiar y restaurar el título original sin la barra de búsqueda
        summary.innerHTML = '';
        
        // Crear el div para el título dentro del summary
        const titleDiv = document.createElement('div');
        titleDiv.className = 'summary-title';
        titleDiv.textContent = originalText;
        
        // Añadir el título al summary
        summary.appendChild(titleDiv);
        
        // Buscar o crear el div para el contenido
        let detailsContent = details.querySelector('.details-content');
        
        // Si no existe el div de contenido, crearlo
        if (!detailsContent) {
            // Guardar todos los nodos de contenido que no son el summary
            const contentNodes = Array.from(details.childNodes).filter(node => 
                node !== summary && node.nodeType !== Node.TEXT_NODE);
            
            // Crear el div para el contenido
            detailsContent = document.createElement('div');
            detailsContent.className = 'details-content';
            
            // Mover todos los nodos de contenido al nuevo div
            contentNodes.forEach(node => {
                details.removeChild(node);
                detailsContent.appendChild(node);
            });
            
            // Añadir el div de contenido al details
            details.appendChild(detailsContent);
        }
        
        // Crear el div para la barra de búsqueda
        const searchDiv = document.createElement('div');
        searchDiv.className = 'details-search';
        
        // Crear el input de búsqueda
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = `Buscar en ${originalText.toLowerCase()}...`;
        searchInput.setAttribute('data-category', originalText.toLowerCase());
        
        // Añadir el input al div de búsqueda
        searchDiv.appendChild(searchInput);
        
        // Insertar la barra de búsqueda al principio del contenido
        if (detailsContent.firstChild) {
            detailsContent.insertBefore(searchDiv, detailsContent.firstChild);
        } else {
            detailsContent.appendChild(searchDiv);
        }
    });
}

// Función para configurar la funcionalidad de búsqueda en los summaries
function setupSummarySearches() {
    // Obtener todos los inputs de búsqueda
    const searchInputs = document.querySelectorAll('.details-search input');
    
    searchInputs.forEach(input => {
        // Evento de foco para abrir el details si está cerrado y añadir clase active
        input.addEventListener('focus', function() {
            const details = this.closest('details');
            const searchContainer = this.closest('.details-search');
            
            if (!details.open) {
                details.open = true;
            }
            
            // Añadir clase active al contenedor de búsqueda
            searchContainer.classList.add('active');
        });
        
        // Evento de pérdida de foco para quitar clase active
        input.addEventListener('blur', function() {
            const searchContainer = this.closest('.details-search');
            searchContainer.classList.remove('active');
        });
        
        // Evento de clic para evitar que se cierre el details al hacer clic en la barra de búsqueda
        input.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Evento de input para filtrar los elementos
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const details = this.closest('details');
            
            // Abrir el details si está cerrado y hay un término de búsqueda
            if (!details.open && searchTerm !== '') {
                details.open = true;
            }
            
            // Buscar en los elementos dentro del details actual
            const labels = details.querySelectorAll('.label-category');
            
            labels.forEach(label => {
                const labelText = label.textContent.toLowerCase();
                
                if (searchTerm === '' || labelText.includes(searchTerm)) {
                    label.style.display = 'flex';
                } else {
                    label.style.display = 'none';
                }
            });
        });
    });
}

// Función para mostrar mensaje de "no se encontraron resultados"
function showNoResultsMessage() {
    // Eliminar mensaje anterior si existe
    removeNoResultsMessage();
    
    // Crear mensaje
    const noResultsMsg = document.createElement('div');
    noResultsMsg.id = 'no-results-message';
    noResultsMsg.style.width = '100%';
    noResultsMsg.style.textAlign = 'center';
    noResultsMsg.style.padding = '20px';
    noResultsMsg.style.color = '#ffffff';
    noResultsMsg.style.fontSize = '1rem';
    noResultsMsg.style.fontFamily = 'var(--pixel)';
    noResultsMsg.textContent = 'No se encontraron tokens con ese ID';
    
    // Insertar mensaje después del contenedor de marketplace
    const marketplaceContainer = document.querySelector('.marketplace-container');
    if (marketplaceContainer) {
        marketplaceContainer.appendChild(noResultsMsg);
    }
}

// Función para eliminar mensaje de "no se encontraron resultados"
function removeNoResultsMessage() {
    const noResultsMsg = document.getElementById('no-results-message');
    if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

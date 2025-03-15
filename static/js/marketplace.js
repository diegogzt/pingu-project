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
            } else if (columns === "2") {
                updateMarketItemClasses('four-columns');
                // Restaurar estilos originales
                resetCardStyles();
            } else if (columns === "3") {
                updateMarketItemClasses('six-columns');
            }
        });
    });

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
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Ajustar tamaños para mostrar solo 2 cartas por fila
        card.style.flexBasis = '48%';
        card.style.width = '48%';
        card.style.maxWidth = '48%';
        card.style.aspectRatio = '0.7/1';
        
        // Mantener la información visible (a diferencia de m3)
        const cardStats = card.querySelector('.card-stats');
        const cardActions = card.querySelector('.card-actions');
        
        if (cardStats) cardStats.style.display = 'flex';
        if (cardActions) cardActions.style.display = 'flex';
    });
}

// Función para restaurar los estilos originales de las cartas
function resetCardStyles() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Restaurar tamaños originales
        card.style.flexBasis = '';
        card.style.width = '';
        card.style.maxWidth = '';
        card.style.aspectRatio = '';
        
        // Asegurar que la información y acciones están visibles
        const cardStats = card.querySelector('.card-stats');
        const cardActions = card.querySelector('.card-actions');
        
        if (cardStats) cardStats.style.display = 'flex';
        if (cardActions) cardActions.style.display = 'flex';
    });
}

// Función para ajustar la altura de las tarjetas basada en su ancho
function ajustarAlturaCards() {
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

// Ejecutar la función cuando se carga la página
window.addEventListener('load', ajustarAlturaCards);

// Ejecutar la función cuando se redimensiona la ventana
window.addEventListener('resize', ajustarAlturaCards);

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

// Variables globales
let productData = null;

document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');

    // Si no hay ID en la URL, intentar recuperarlo del localStorage
    if (!productId) {
        productId = localStorage.getItem('selectedCardId');
        console.log('ID recuperado del localStorage:', productId);
    }

    if (productId) {
        console.log('Cargando producto con ID:', productId);
        loadProductData(productId);
    } else {
        console.warn('No se encontró ID de producto, cargando la primera carta por defecto');
        // Si no hay ID, intentamos cargar el primer producto disponible
        loadProductData('default');
    }

    // Configurar los tabs
    setupTabs();
});

// Función para cargar los datos del producto
async function loadProductData(productId) {
    try {
        // Cargar el archivo JSON con los datos de las tarjetas
        const response = await fetch('static/js/cards.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
        }
        const data = await response.json();
        console.log('JSON cargado:', data); // Log para debug
        
        if (!data || !data.cards || !Array.isArray(data.cards)) {
            throw new Error('Formato de datos inválido');
        }
        
        // Intentar varias formas de buscar la carta
        let card = null;
        
        // Primero intentar buscar por coincidencia exacta de string
        card = data.cards.find(c => c.id === productId);
        
        // Si no se encuentra, intentar haciendo un toString()
        if (!card) {
            card = data.cards.find(c => c.id.toString() === productId.toString());
        }
        
        // Si todavía no se encuentra, buscar por coincidencia parcial
        if (!card && productId.includes('#')) {
            const idNumber = productId.split('#')[1].trim();
            card = data.cards.find(c => c.id.includes(idNumber));
        }
        
        // Si no hay coincidencia, tomar la primera carta como fallback
        if (!card && data.cards.length > 0) {
            console.warn('No se encontró la carta específica, usando la primera disponible');
            card = data.cards[0];
        }
        
        if (card) {
            console.log('Carta encontrada:', card); // Log para debug
            productData = card;
            displayProductData(card);
        } else {
            console.error('Producto no encontrado');
            // Mostrar mensaje de error
            document.querySelector('.product-wrapper').innerHTML = `
                <div class="error-message">
                    <h2>Producto no encontrado</h2>
                    <p>Lo sentimos, no pudimos encontrar el producto con ID: ${productId}</p>
                    <a href="marketplace.html" class="back-btn">Volver al Marketplace</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar los datos del producto:', error);
        // Mostrar mensaje de error
        document.querySelector('.product-wrapper').innerHTML = `
            <div class="error-message">
                <h2>Error al cargar el producto</h2>
                <p>${error.message}</p>
                <a href="marketplace.html" class="back-btn">Volver al Marketplace</a>
            </div>
        `;
    }
}

// Función para mostrar los datos del producto en la página
function displayProductData(card) {
    console.log('Mostrando datos de la carta:', card);
    
    // Actualizar el título de la página
    document.title = `${card.id} - NFT Detail`;
    
    // ----------------------
    // ACTUALIZAR LA IMAGEN
    // ----------------------
    const productImage = document.getElementById('product-image');
    if (productImage) {
        // Asegurarnos que la ruta de la imagen es correcta
        console.log('Actualizando imagen con:', card.image);
        
        // Intentamos cargar la imagen directamente
        const img = new Image();
        img.onload = function() {
            console.log('Imagen cargada correctamente!');
            productImage.src = card.image;
        };
        img.onerror = function() {
            console.error('Error al cargar la imagen:', card.image);
            // Intentar con una imagen alternativa
            const backupImage = `static/img/card-images/nft${Math.floor(Math.random() * 7) + 1}.png`;
            console.log('Intentando con imagen alternativa:', backupImage);
            productImage.src = backupImage;
        };
        img.src = card.image;
        
        productImage.alt = `${card.id}`;
    } else {
        console.error('Elemento product-image no encontrado');
    }
    
    // ----------------------
    // ACTUALIZAR TÍTULO Y DETALLES
    // ----------------------
    const productIdSpan = document.getElementById('product-id');
    if (productIdSpan) {
        productIdSpan.textContent = card.id;
    }
    
    const productTitle = document.getElementById('product-title');
    if (productTitle) {
        productTitle.textContent = card.id;
    }
    
    // ----------------------
    // ACTUALIZAR RAREZA
    // ----------------------
    const productCollection = document.getElementById('product-collection');
    if (productCollection) {
        productCollection.textContent = card.rarity || 'Common';
        productCollection.style.color = getRarityColor(card.rarity);
    }
    
    // ----------------------
    // ACTUALIZAR PRECIO
    // ----------------------
    const productPrice = document.getElementById('product-price');
    if (productPrice) {
        productPrice.textContent = card.price;
    }
    
    // Calcular un precio en USD simulado
    const currencyElement = document.querySelector('.currency');
    if (currencyElement) {
        const usdPrice = (card.price * 2100).toFixed(0);
        currencyElement.textContent = `($${usdPrice})`;
    }
    
    // ----------------------
    // ACTUALIZAR PROPIETARIO
    // ----------------------
    const productOwner = document.getElementById('product-owner');
    if (productOwner) {
        const owners = ['zerc', 'nftcollector', 'pengulover', 'crypto_whale'];
        const randomOwner = owners[Math.floor(Math.random() * owners.length)];
        productOwner.textContent = randomOwner;
    }
    
    // ----------------------
    // ACTUALIZAR RASGOS/TRAITS
    // ----------------------
    // Primero limpiamos cualquier trait existente
    const traitsGrid = document.querySelector('.traits-grid');
    if (traitsGrid) {
        // Mantener solo los primeros 3 elementos de ejemplo si existen
        const existingTraits = traitsGrid.querySelectorAll('.trait-item');
        if (existingTraits.length > 3) {
            for (let i = 3; i < existingTraits.length; i++) {
                traitsGrid.removeChild(existingTraits[i]);
            }
        }
        
        // Añadir traits basados en las stats
        if (card.stats) {
            updateStatsInTraits(card.stats);
        }
    }
    
    // ----------------------
    // ACTUALIZAR INFORMACIÓN EN LA PESTAÑA INFO
    // ----------------------
    const infoTokenId = document.getElementById('info-token-id');
    if (infoTokenId) {
        infoTokenId.textContent = card.id;
    }
    
    console.log('Datos mostrados correctamente.');
}

// Función para obtener el color basado en la rareza
function getRarityColor(rarity) {
    switch(rarity) {
        case 'Common':
            return 'var(--common-color)';
        case 'Rare':
            return 'var(--rare-color)';
        case 'Mythic':
            return 'var(--mythic-color)';
        case 'Legendary':
            return 'var(--legendary-color)';
        default:
            return 'var(--text-color-primary)';
    }
}

// Función para actualizar las estadísticas en la sección de rasgos
function updateStatsInTraits(stats) {
    // Añadir stats como traits adicionales
    const traitsGrid = document.querySelector('.traits-grid');
    
    // Añadir cada stat como un nuevo trait
    const statItems = [
        { title: 'Heart', value: stats.heart },
        { title: 'Lightning', value: stats.lightning },
        { title: 'Ghost', value: stats.ghost },
        { title: 'Sword', value: stats.sword }
    ];
    
    // Crear elementos para cada stat
    statItems.forEach(stat => {
        // Verificar si ya existe un trait con este título
        let existingTrait = false;
        
        // Buscar manualmente entre los elementos existentes
        const traitTitles = document.querySelectorAll('.trait-title');
        traitTitles.forEach(title => {
            if (title.textContent === stat.title) {
                existingTrait = true;
            }
        });
        
        if (!existingTrait) {
            const traitItem = document.createElement('div');
            traitItem.className = 'trait-item';
            
            const traitTitle = document.createElement('div');
            traitTitle.className = 'trait-title';
            traitTitle.textContent = stat.title;
            
            const traitValue = document.createElement('div');
            traitValue.className = 'trait-value';
            traitValue.textContent = stat.value;
            
            traitItem.appendChild(traitTitle);
            traitItem.appendChild(traitValue);
            
            traitsGrid.appendChild(traitItem);
        }
    });
}

// Función para actualizar los rasgos en la UI
function updateTraits(traits) {
    if (traits.background) {
        document.getElementById('trait-background').textContent = traits.background;
    }
    if (traits.eyes) {
        document.getElementById('trait-eyes').textContent = traits.eyes;
    }
    if (traits.shirt) {
        document.getElementById('trait-shirt').textContent = traits.shirt;
    }
    if (traits.head) {
        document.getElementById('trait-head').textContent = traits.head;
    }
    if (traits.accessory) {
        document.getElementById('trait-accessory').textContent = traits.accessory;
    }
}

// Función para generar rasgos predeterminados basados en la rareza
function generateDefaultTraits(card) {
    // Valores posibles para cada rasgo según rareza
    const traitOptions = {
        'Common': {
            background: ['Blue', 'Green', 'Grey'],
            eyes: ['Normal', 'Sleepy', 'Happy'],
            shirt: ['Plain', 'Striped', 'None'],
            head: ['None', 'Cap', 'Beanie'],
            accessory: ['None', 'Backpack', 'Scarf']
        },
        'Rare': {
            background: ['Red', 'Purple', 'Yellow'],
            eyes: ['Angry', 'Surprised', 'Wink'],
            shirt: ['Checkered', 'Jersey', 'Suit'],
            head: ['Hat', 'Headphones', 'Sunglasses'],
            accessory: ['Watch', 'Belt', 'Necklace']
        },
        'Mythic': {
            background: ['Galaxy', 'Aurora', 'Sunset'],
            eyes: ['Glowing', 'Hypnotic', 'Multi-colored'],
            shirt: ['Glitter', 'Animated', 'Neon'],
            head: ['Crown', 'Halo', 'Flame'],
            accessory: ['Magic Wand', 'Potion', 'Amulet']
        },
        'Legendary': {
            background: ['Cosmic', 'Divine', 'Inferno'],
            eyes: ['Diamond', 'Rainbow', 'Void'],
            shirt: ['Legendary Armor', 'Royal Robe', 'Elemental'],
            head: ['God Crown', 'Ancient Relic', 'Mythical Helm'],
            accessory: ['Dragon Companion', 'Legendary Weapon', 'Angel Wings']
        }
    };
    
    // Seleccionar la categoría de rasgos según la rareza
    const rarityTraits = traitOptions[card.rarity] || traitOptions['Common'];
    
    // Generar rasgos aleatorios de la categoría
    return {
        background: rarityTraits.background[Math.floor(Math.random() * rarityTraits.background.length)],
        eyes: rarityTraits.eyes[Math.floor(Math.random() * rarityTraits.eyes.length)],
        shirt: rarityTraits.shirt[Math.floor(Math.random() * rarityTraits.shirt.length)],
        head: rarityTraits.head[Math.floor(Math.random() * rarityTraits.head.length)],
        accessory: rarityTraits.accessory[Math.floor(Math.random() * rarityTraits.accessory.length)]
    };
}

// Función para configurar los tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover la clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar la clase active al botón seleccionado
            button.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

// Función para volver al marketplace
function backToMarketplace() {
    window.location.href = 'marketplace.html';
}

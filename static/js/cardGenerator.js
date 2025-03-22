// Función para cargar el archivo JSON con la información de las cartas
async function loadCardsData() {
    try {
        const response = await fetch('static/js/cards.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
        }
        const data = await response.json();
        return data.cards;
    } catch (error) {
        console.error('Error al cargar los datos de las cartas:', error);
        return [];
    }
}

// Función para crear una tarjeta a partir de los datos
function createCardElement(cardData) {
    // Crear el elemento principal de la tarjeta
    const card = document.createElement('div');
    card.className = 'card';
    
    // Añadir clase adicional según la rareza
    if (cardData.rarity === 'Legendary') {
        card.classList.add('legendary-card');
    } else if (cardData.rarity === 'Mythic') {
        card.classList.add('mythic-card');
    } else if (cardData.rarity === 'Rare') {
        card.classList.add('rare-card');
    } else if (cardData.rarity === 'Common') {
        card.classList.add('common-card');
    }
    
    // Crear la sección de la imagen
    const cardImage = document.createElement('div');
    cardImage.className = 'card-image';
    
    const image = document.createElement('img');
    image.className = 'image';
    image.src = cardData.image;
    image.alt = `Card ${cardData.id}`;
    
    cardImage.appendChild(image);
    
    // Crear la sección de información
    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';
    
    // Crear el encabezado de la tarjeta
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    // Asignar ID basado en la rareza para los estilos de color
    if (cardData.rarity === 'Legendary') {
        cardHeader.id = 'legendary';
    } else if (cardData.rarity === 'Mythic') {
        cardHeader.id = 'mythic';
    } else if (cardData.rarity === 'Rare') {
        cardHeader.id = 'rare';
    } else if (cardData.rarity === 'Common') {
        cardHeader.id = 'common2';
    }
    
    const cardId = document.createElement('div');
    cardId.className = 'card-id';
    cardId.textContent = cardData.id;
    
    const cardRarity = document.createElement('div');
    cardRarity.className = 'card-rarity';
    cardRarity.textContent = cardData.rarity;
    
    cardHeader.appendChild(cardId);
    cardHeader.appendChild(cardRarity);
    
    // Crear las estadísticas de la tarjeta
    const cardStats = document.createElement('div');
    cardStats.className = 'card-stats';
    
    // Crear cada estadística
    const heartStat = document.createElement('span');
    heartStat.className = 'stat';
    heartStat.innerHTML = `<span class="heart-icon">❤️</span> ${cardData.stats.heart}`;
    
    const lightningStat = document.createElement('span');
    lightningStat.className = 'stat';
    lightningStat.innerHTML = `<span class="lightning-icon">⚡</span> ${cardData.stats.lightning}`;
    
    const ghostStat = document.createElement('span');
    ghostStat.className = 'stat';
    ghostStat.innerHTML = `<span class="ghost-icon">👻</span> ${cardData.stats.ghost}`;
    
    const swordStat = document.createElement('span');
    swordStat.className = 'stat';
    swordStat.innerHTML = `<span class="sword-icon">✖️</span> ${cardData.stats.sword}`;
    
    cardStats.appendChild(heartStat);
    cardStats.appendChild(lightningStat);
    cardStats.appendChild(ghostStat);
    cardStats.appendChild(swordStat);
    
    // Crear el precio
    const cardNumber = document.createElement('div');
    cardNumber.className = 'card-number';
    
    // Crear el contenedor para el precio y la moneda
    const priceContainer = document.createElement('div');
    priceContainer.className = 'price-container';
    
    // Añadir el precio como texto
    const priceText = document.createElement('span');
    priceContainer.className = ('price-card');
    priceText.textContent = cardData.price;
    priceContainer.appendChild(priceText);
    
    // Añadir la imagen de la moneda según el tipo
    const currencyImg = document.createElement('img');
    currencyImg.className = 'currency-icon';
    
    // Seleccionar la imagen según el tipo de moneda
    if (cardData.currency === 'ethereum') {
        currencyImg.src = 'static/img/ethereum.png';
        currencyImg.alt = 'Ethereum';
    } else if (cardData.currency === 'bitcoin') {
        currencyImg.src = 'static/img/bitcoin.png';
        currencyImg.alt = 'Bitcoin';
    } else if (cardData.currency === 'dogecoin') {
        currencyImg.src = 'static/img/dogecoin.png';
        currencyImg.alt = 'Dogecoin';
    }
    
    priceContainer.appendChild(currencyImg);
    cardNumber.appendChild(priceContainer);
    
    // Crear las acciones de la tarjeta
    const cardActions = document.createElement('div');
    cardActions.className = 'card-actions';
    
    const buyBtn = document.createElement('button');
    buyBtn.className = 'buy-btn';
    buyBtn.textContent = 'Buy Now';
    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.textContent = '🛒 Add';
    
    cardActions.appendChild(buyBtn);
    cardActions.appendChild(addBtn);
    
    // Ensamblar la tarjeta
    cardInfo.appendChild(cardHeader);
    cardInfo.appendChild(cardStats);
    cardInfo.appendChild(cardNumber);
    cardInfo.appendChild(cardActions);
    
    card.appendChild(cardImage);
    card.appendChild(cardInfo);
    
    // Añadir click event para redirigir a la página de producto
    card.style.cursor = 'pointer';
    card.addEventListener('click', (event) => {
        // Evitar que el evento se dispare cuando se hace clic en los botones
        if (event.target.tagName === 'BUTTON' || event.target.parentElement.tagName === 'BUTTON') {
            return;
        }
        
        // Depurar el ID que estamos pasando
        console.log('Redirigiendo a producto con ID:', cardData.id);
        
        // Almacenar en localStorage como respaldo por si se pierde el parámetro de URL
        localStorage.setItem('selectedCardId', cardData.id);
        
        // Redirigir a la página de producto con el ID como parámetro
        window.location.href = `product.html?id=${encodeURIComponent(cardData.id)}`;
    });
    
    // Evitar que los clics en los botones de compra/añadir redirijan a la página de producto
    const preventRedirectButtons = card.querySelectorAll('.buy-btn, .add-btn');
    preventRedirectButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Evitar que el evento se propague al elemento padre (card)
        });
    });
    
    return card;
}

// Función para llenar el contenedor de marketplace con las tarjetas
async function populateMarketplace() {
    const cardsData = await loadCardsData();
    const marketplaceContainer = document.querySelector('.marketplace-container');
    
    // Limpiar el contenedor antes de añadir nuevas tarjetas
    if (marketplaceContainer) {
        marketplaceContainer.innerHTML = '';
        
        // Crear y añadir cada tarjeta al contenedor
        cardsData.forEach(cardData => {
            const cardElement = createCardElement(cardData);
            marketplaceContainer.appendChild(cardElement);
        });
        
        // Ajustar la altura de las tarjetas una vez que se han creado
        ajustarAlturaCards();
    } else {
        console.error('No se encontró el contenedor de marketplace');
    }
}

// Función para obtener una carta específica por su ID o índice
function getCardById(id) {
    return loadCardsData().then(cards => {
        return cards.find(card => card.id === id);
    });
}

// Función para crear una nueva carta con datos personalizados
function createCustomCard(customData) {
    // Verificar que todos los campos requeridos estén presentes
    const requiredFields = ['id', 'rarity', 'stats', 'price', 'image'];
    for (const field of requiredFields) {
        if (!customData[field]) {
            console.error(`El campo ${field} es requerido para crear una carta`);
            return null;
        }
    }
    
    // Crear la carta con los datos personalizados
    return createCardElement(customData);
}

// Cargar las cartas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    populateMarketplace();
}); 
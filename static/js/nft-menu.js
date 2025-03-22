// Script específico para cargar 12 cartas aleatorias en el menú NFT de play.html

// Función para obtener un array aleatorio de cartas
async function getRandomCards(count = 12) {
    try {
        // Cargar todos los datos de las cartas
        const response = await fetch('static/js/cards.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
        }
        
        const data = await response.json();
        const allCards = data.cards;
        
        // Mezclar el array de cartas usando el algoritmo Fisher-Yates
        const shuffled = [...allCards];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Devolver solo el número solicitado de cartas aleatorias
        return shuffled.slice(0, count);
    } catch (error) {
        console.error('Error al cargar los datos de las cartas:', error);
        return [];
    }
}

// Función para crear una tarjeta con el botón "Select" en lugar de "Buy Now"
function createNFTCardElement(cardData) {
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
    
    // Texto "Select" en lugar de "Buy Now"
    const selectBtn = document.createElement('button');
    selectBtn.className = 'buy-btn';
    selectBtn.textContent = 'Select';
    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.textContent = '🛒 Add';
    
    cardActions.appendChild(selectBtn);
    cardActions.appendChild(addBtn);
    
    // Ensamblar la tarjeta
    cardInfo.appendChild(cardHeader);
    cardInfo.appendChild(cardStats);
    cardInfo.appendChild(cardNumber);
    cardInfo.appendChild(cardActions);
    
    card.appendChild(cardImage);
    card.appendChild(cardInfo);
    
    // Añadir evento para seleccionar carta y cerrar el menú
    selectBtn.addEventListener('click', () => {
        console.log(`Carta ${cardData.id} seleccionada`);
        
        // Cerrar el menú NFT
        const nftMenu = document.getElementById('nft-menu');
        nftMenu.classList.remove('active');
        
        // Actualizar el mensaje en la GameBoy
        const gameText = document.querySelector('.game-text');
        if (gameText) {
            gameText.textContent = `¡Has seleccionado ${cardData.id}!`;
        }
        
        // Almacenar la carta seleccionada
        localStorage.setItem('selectedNFTCard', JSON.stringify(cardData));
        
        // Llamar a función existente para cerrar el menú si está disponible
        if (typeof closeNFTMenu === 'function') {
            closeNFTMenu();
        }
    });
    
    return card;
}

// Función para cargar cartas aleatorias en el menú NFT
async function loadRandomNFTCards() {
    const nftCardsContainer = document.getElementById('nft-cards-container');
    if (!nftCardsContainer) {
        console.error('No se encontró el contenedor de cartas NFT');
        return;
    }
    
    // Limpiar el contenedor
    nftCardsContainer.innerHTML = '';
    
    // Obtener 12 cartas aleatorias
    const randomCards = await getRandomCards(12);
    
    // Crear y añadir cada carta al contenedor
    randomCards.forEach(cardData => {
        const cardElement = createNFTCardElement(cardData);
        nftCardsContainer.appendChild(cardElement);
    });
    
    // Ajustar altura de cartas si la función está disponible
    if (typeof ajustarAlturaCards === 'function') {
        ajustarAlturaCards();
    }
}

// Cargar las cartas cuando el DOM esté listo y cuando se abra el menú NFT
document.addEventListener('DOMContentLoaded', () => {
    // Cargar cartas al iniciar la página
    loadRandomNFTCards();
    
    // Recargar cartas cada vez que se abra el menú NFT
    const btnSelect = document.getElementById('btn-select');
    if (btnSelect) {
        btnSelect.addEventListener('click', () => {
            setTimeout(loadRandomNFTCards, 100); // Pequeño retraso para asegurar que el menú está visible
        });
    }
    
    // Evento para el botón de recarga en el sidebar
    const reloadButton = document.querySelector('.reload-button');
    if (reloadButton) {
        reloadButton.addEventListener('click', loadRandomNFTCards);
    }
});

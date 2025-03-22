// JavaScript para la página de juego
document.addEventListener('DOMContentLoaded', function() {
    // Función para ajustar el tamaño del GameBoy según el ancho de la pantalla
    function adjustGameboySize() {
        const gameboy = document.querySelector('.gameboy');
        if (!gameboy) return;
        
        // Verificar si la pantalla es menor a 900px
        if (window.innerWidth < 900) {
            // Hacer el GameBoy un 20% más pequeño (scale 0.4 en lugar de 0.5)
            gameboy.style.transform = 'scale(0.4)';
        } else {
            // Restaurar el tamaño original
            gameboy.style.transform = 'scale(0.5)';
        }
    }
    
    // Ajustar el tamaño al cargar la página
    adjustGameboySize();
    
    // Ajustar el tamaño cuando cambie el tamaño de la ventana
    window.addEventListener('resize', adjustGameboySize);
    
    // Referencias a elementos
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnA = document.getElementById('btn-a');
    const btnB = document.getElementById('btn-b');
    const btnStart = document.getElementById('btn-start');
    const btnSelect = document.getElementById('btn-select');
    const gameText = document.querySelector('.game-text');
    const gameboy = document.querySelector('.gameboy');
    const powerButton = document.querySelector('.power-button');
    const nftMenu = document.getElementById('nft-menu');
    
    // Depuración: Verificar referencias a elementos
    console.log('Elementos DOM:', {
        btnSelect: btnSelect,
        nftMenu: nftMenu
    });
    
    // Textos para el juego
    const gameTexts = [
        "Presiona START para comenzar",
        "Usa las flechas para moverte",
        "Presiona A para saltar",
        "Presiona B para atacar",
        "¡El pingüino se mueve!"
    ];
    
    // Estado de encendido del Game Boy - ENCENDIDO POR DEFECTO
    let isPowerOn = true;
    let isNFTMenuOpen = false;
    
    // Aplicar estado inicial de encendido
    gameboy.classList.add('power-on');
    gameText.textContent = gameTexts[0];
    
    // Función para encender/apagar el Game Boy
    powerButton.addEventListener('click', function() {
        isPowerOn = !isPowerOn;
        console.log('Game Boy encendido:', isPowerOn);
        if (isPowerOn) {
            gameboy.classList.add('power-on');
            gameText.textContent = gameTexts[0];
        } else {
            gameboy.classList.remove('power-on');
            gameText.textContent = "";
            // Si el Game Boy se apaga, cerrar el menú NFT
            if (isNFTMenuOpen) {
                // Cerrar el menú
                nftMenu.classList.remove('active');
                isNFTMenuOpen = false;
            }
        }
    });
    
    // Función para abrir el menú NFT (similar al botón de prueba)
    function openNFTMenu() {
        // Asegurarse de que la Game Boy esté encendida
        if (!isPowerOn) {
            isPowerOn = true;
            gameboy.classList.add('power-on');
            gameText.textContent = gameTexts[0];
            console.log('Game Boy encendido automáticamente');
        }
        
        // Abrir menú NFT
        isNFTMenuOpen = true;
        // Primero hacemos visible el menú
        nftMenu.style.display = 'flex';
        // Añadimos un pequeño retraso para que la transición funcione
        setTimeout(() => {
            nftMenu.classList.add('active');
        }, 10);
        console.log('Menú NFT abierto');
        updateGameText("Menú de NFTs abierto", 2000);
    }
    
    // Función para cerrar el menú NFT
    function closeNFTMenu() {
        isNFTMenuOpen = false;
        // Primero quitamos la clase active para iniciar la transición
        nftMenu.classList.remove('active');
        // Después de la transición, ocultamos completamente el menú
        setTimeout(() => {
            nftMenu.style.display = 'none';
        }, 500); // mismo tiempo que la duración de la transición
        console.log('Menú NFT cerrado');
    }
    
    // Cambiar texto al presionar botones (solo cuando está encendido)
    function updateGameText(text, duration = 1000) {
        if (!isPowerOn) return;
        
        gameText.textContent = text;
        setTimeout(() => {
            if (isPowerOn) {
                gameText.textContent = gameTexts[0];
            }
        }, duration);
    }
    
    // El botón Select abre el menú NFT exactamente como el botón de prueba
    btnSelect.addEventListener('click', function() {
        console.log('Botón Select presionado');
        openNFTMenu();
    });
    
    // Botones sin funcionalidad real (solo muestran texto)
    btnStart.addEventListener('click', function() {
        updateGameText("¡Juego iniciado!", 2000);
    });
    
    btnA.addEventListener('click', function() {
        updateGameText("¡Salto!");
    });
    
    btnB.addEventListener('click', function() {
        updateGameText("¡Ataque!");
    });
    
    btnUp.addEventListener('click', function() {
        updateGameText("Movimiento arriba");
    });
    
    btnDown.addEventListener('click', function() {
        updateGameText("Movimiento abajo");
    });
    
    btnLeft.addEventListener('click', function() {
        updateGameText("Movimiento izquierda");
    });
    
    btnRight.addEventListener('click', function() {
        updateGameText("Movimiento derecha");
    });
    
    // Añadir funcionalidad a los botones de selección de NFT
    document.querySelectorAll('.nft-card-button.nft-select').forEach(button => {
        button.addEventListener('click', function() {
            // Cerrar el menú después de seleccionar un NFT
            closeNFTMenu();
            // Mostrar mensaje de selección
            updateGameText("NFT seleccionado", 2000);
        });
    });
    
    // Añadir funcionalidad al botón de cierre del menú NFT
    const closeNftMenuBtn = document.getElementById('close-nft-menu');
    if (closeNftMenuBtn) {
        closeNftMenuBtn.addEventListener('click', function() {
            console.log('Botón de cierre de menú NFT presionado');
            closeNFTMenu();
            updateGameText("Volviendo al juego", 2000);
        });
    }
    
    // Añadir evento al botón de prueba para el menú NFT
    const testNftButton = document.getElementById('test-nft-button');
    if (testNftButton) {
        testNftButton.addEventListener('click', function() {
            console.log('Botón de prueba NFT presionado');
            openNFTMenu();
        });
    }
    
    // Manejador de eventos del documento para clic en Select
    document.addEventListener('click', function(event) {
        // Verificar si el clic fue en el botón Select o en uno de sus elementos hijos
        let target = event.target;
        while (target != null) {
            if (target.id === 'btn-select') {
                console.log('Clic detectado en el botón Select desde el documento');
                openNFTMenu();
                break;
            }
            target = target.parentElement;
        }
    });
    
    // Soporte para teclado
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Shift':
            case 'n':
                console.log('Tecla Select presionada');
                btnSelect.classList.add('pressed');
                openNFTMenu();
                break;
            case 'Escape':
                // Cerrar el menú NFT con la tecla Escape
                if (isNFTMenuOpen) {
                    closeNFTMenu();
                }
                break;
            default:
                // Para otros botones solo mostramos efecto visual
                handleButtonEffectByKey(e.key);
                break;
        }
    });
    
    // Función para manejar efectos visuales de botones según tecla
    function handleButtonEffectByKey(key) {
        let button = null;
        
        switch(key) {
            case 'ArrowUp':
            case 'w':
                button = btnUp;
                updateGameText("Movimiento arriba");
                break;
            case 'ArrowDown':
            case 's':
                button = btnDown;
                updateGameText("Movimiento abajo");
                break;
            case 'ArrowLeft':
            case 'a':
                button = btnLeft;
                updateGameText("Movimiento izquierda");
                break;
            case 'ArrowRight':
            case 'd':
                button = btnRight;
                updateGameText("Movimiento derecha");
                break;
            case 'z':
            case 'j':
                button = btnB;
                updateGameText("¡Ataque!");
                break;
            case 'x':
            case 'k':
                button = btnA;
                updateGameText("¡Salto!");
                break;
            case 'Enter':
                button = btnStart;
                updateGameText("¡Juego iniciado!", 2000);
                break;
        }
        
        if (button) {
            button.classList.add('pressed');
        }
    }
    
    document.addEventListener('keyup', function(e) {
        removeButtonEffectByKey(e.key);
    });
    
    // Función para quitar efectos visuales de botones según tecla
    function removeButtonEffectByKey(key) {
        let button = null;
        
        switch(key) {
            case 'ArrowUp':
            case 'w':
                button = btnUp;
                break;
            case 'ArrowDown':
            case 's':
                button = btnDown;
                break;
            case 'ArrowLeft':
            case 'a':
                button = btnLeft;
                break;
            case 'ArrowRight':
            case 'd':
                button = btnRight;
                break;
            case 'z':
            case 'j':
                button = btnB;
                break;
            case 'x':
            case 'k':
                button = btnA;
                break;
            case 'Enter':
                button = btnStart;
                break;
            case 'Shift':
            case 'n':
                button = btnSelect;
                break;
        }
        
        if (button) {
            button.classList.remove('pressed');
        }
    }
    
    // También añadir manejadores para los controles de la barra lateral
    const squareCheckboxes = document.querySelectorAll('.square-checkbox');
    squareCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            // Quitar la clase 'active' de todos los checkboxes en el mismo grupo
            const parent = this.closest('.available-options');
            parent.querySelectorAll('.square-checkbox').forEach(cb => {
                cb.classList.remove('active');
            });
            
            // Añadir la clase 'active' al checkbox clickeado
            this.classList.add('active');
        });
    });
    
    // Añadir manejador para el botón de recarga
    const reloadButton = document.querySelector('.reload-button');
    if (reloadButton) {
        reloadButton.addEventListener('click', function() {
            console.log('Recargando filtros y NFTs');
            // Desmarcar todos los checkboxes
            document.querySelectorAll('.checkbox').forEach(cb => {
                cb.checked = false;
            });
            
            // Desactivar los checkboxes cuadrados
            document.querySelectorAll('.square-checkbox').forEach(cb => {
                cb.classList.remove('active');
            });
            
            // Limpiar el campo de búsqueda
            document.querySelector('.search-input').value = '';
        });
    }
}); 
// Script para manejar el modal del sidebar-content en la página de play

document.addEventListener('DOMContentLoaded', function() {
    setupSidebarModal();
    
    // Verificar el tamaño de pantalla al cargar la página
    window.dispatchEvent(new Event('resize'));
    
    // Ajustar al cambiar entre vistas (orientación móvil)
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            window.dispatchEvent(new Event('resize'));
        }, 200);
    });
});

function setupSidebarModal() {
    // Referencias a elementos DOM
    const sidebarContent = document.getElementById('sidebar-content');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const modal = document.getElementById('sidebar-content-modal');
    const modalInner = modal ? modal.querySelector('.sidebar-content-modal-inner') : null;
    const closeBtn = modal ? modal.querySelector('.close-sidebar-modal') : null;
    
    // Verificar que existan todos los elementos necesarios
    if (!toggleBtn || !modal || !modalInner || !closeBtn) {
        console.warn('No se encontraron todos los elementos necesarios para el modal del sidebar');
        return;
    }
    
    // Si no existe sidebarContent (puede pasar en algunas páginas),
    // usaremos el contenido de la sidebar del menú NFT si está disponible
    if (!sidebarContent) {
        const nftSidebarContent = document.querySelector('.sidebar-content');
        if (nftSidebarContent) {
            sidebarContent = nftSidebarContent;
        } else {
            console.warn('No se encontró contenido de sidebar para mostrar en el modal');
        }
    }
    
    // Función para copiar el contenido del sidebar al modal
    function updateModalContent() {
        // Limpiar el contenido previo (excepto el botón de cerrar)
        while (modalInner.childNodes.length > 1) {
            modalInner.removeChild(modalInner.lastChild);
        }
        
        // Primero intentar obtener el contenido del sidebar del NFT menu
        const nftSidebarContent = document.querySelector('.sidebar-content');
        const nftMenu = document.getElementById('nft-menu');
        
        // Si estamos en el menú NFT y existe el sidebar
        if (nftSidebarContent && nftMenu && nftMenu.classList.contains('active')) {
            // Clonar el contenido del sidebar NFT
            const sidebarChildren = nftSidebarContent.children;
            for (let i = 0; i < sidebarChildren.length; i++) {
                const clone = sidebarChildren[i].cloneNode(true);
                modalInner.appendChild(clone);
            }
            
            // Añadir eventos para checkboxes y botones en el modal
            setupModalEvents(modalInner);
        } else if (sidebarContent) {
            // Si no estamos en el NFT menu o no hay sidebar NFT, usar el contenido normal
            const sidebarChildren = sidebarContent.children;
            for (let i = 0; i < sidebarChildren.length; i++) {
                const clone = sidebarChildren[i].cloneNode(true);
                modalInner.appendChild(clone);
            }
        }
    }
    
    // Configura eventos para elementos del modal
    function setupModalEvents(container) {
        // Reconfigurar checkboxes
        const checkboxes = container.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                console.log('Checkbox seleccionado en modal');
            });
        });
        
        // Reconfigurar checkboxes cuadrados
        const squareCheckboxes = container.querySelectorAll('.square-checkbox');
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
        
        // Reconfigurar botón de recarga
        const reloadButton = container.querySelector('.reload-button');
        if (reloadButton) {
            reloadButton.addEventListener('click', function() {
                // Cerrar el modal después de recargar
                closeModal();
                // Llamar a la función que recarga las cartas NFT
                if (typeof loadRandomNFTCards === 'function') {
                    loadRandomNFTCards();
                }
            });
        }
    }
    
    // Función para abrir el modal
    function openModal() {
        // Actualizar el contenido del modal
        updateModalContent();
        
        // Mostrar el modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
    
    // Función para cerrar el modal
    function closeModal() {
        // Animar la salida
        modal.classList.add('hide');
        
        // Esperar a que termine la animación
        setTimeout(() => {
            modal.classList.remove('show');
            modal.classList.remove('hide');
            document.body.style.overflow = ''; // Restaurar scroll
        }, 300);
    }
    
    // Evento para abrir el modal al hacer clic en el botón
    toggleBtn.addEventListener('click', openModal);
    
    // Evento para cerrar el modal al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', closeModal);
    
    // Evento para cerrar el modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Evento para cerrar el modal con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Función para ajustar visibilidad según el tamaño de pantalla
    function adjustForScreenSize() {
        if (window.innerWidth <= 770) {
            // En pantallas pequeñas, mostrar el botón y preparar para el modo modal
            toggleBtn.style.display = 'flex';
            if (sidebarContent) {
                sidebarContent.classList.add('button-mode');
            }
            
            // También ocultar el sidebar del NFT menu
            const nftSidebar = document.querySelector('.sidebar');
            if (nftSidebar) {
                nftSidebar.style.display = 'none';
            }
        } else {
            // En pantallas grandes, ocultar el botón y mostrar el sidebar normal
            toggleBtn.style.display = 'none';
            if (sidebarContent) {
                sidebarContent.classList.remove('button-mode');
            }
            
            // Asegurar que el sidebar del NFT menu esté visible
            const nftSidebar = document.querySelector('.sidebar');
            if (nftSidebar) {
                nftSidebar.style.display = 'flex';
            }
            
            // Si el modal está abierto, cerrarlo
            if (modal.classList.contains('show')) {
                closeModal();
            }
        }
    }
    
    // Ajustar inicialmente según el tamaño de pantalla
    adjustForScreenSize();
    
    // Ajustar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', adjustForScreenSize);
}

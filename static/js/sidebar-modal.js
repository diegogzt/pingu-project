// Script para manejar el modal del sidebar-content en la página de play

document.addEventListener('DOMContentLoaded', function() {
    setupSidebarModal();
});

function setupSidebarModal() {
    // Referencias a elementos DOM
    const sidebarContent = document.getElementById('sidebar-content');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const modal = document.getElementById('sidebar-content-modal');
    const modalInner = modal ? modal.querySelector('.sidebar-content-modal-inner') : null;
    const closeBtn = modal ? modal.querySelector('.close-sidebar-modal') : null;
    
    // Verificar que existan todos los elementos necesarios
    if (!sidebarContent || !toggleBtn || !modal || !modalInner || !closeBtn) {
        console.warn('No se encontraron todos los elementos necesarios para el modal del sidebar');
        return;
    }
    
    // Función para copiar el contenido del sidebar al modal
    function updateModalContent() {
        // Limpiar el contenido previo (excepto el botón de cerrar)
        while (modalInner.childNodes.length > 1) {
            modalInner.removeChild(modalInner.lastChild);
        }
        
        // Clonar el contenido del sidebar
        const sidebarChildren = sidebarContent.children;
        for (let i = 0; i < sidebarChildren.length; i++) {
            const clone = sidebarChildren[i].cloneNode(true);
            modalInner.appendChild(clone);
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
        if (window.innerWidth <= 1200) {
            // En pantallas medianas, mostrar el botón y preparar para el modo modal
            toggleBtn.style.display = 'flex';
            sidebarContent.classList.add('button-mode');
        } else {
            // En pantallas grandes, ocultar el botón y mostrar el sidebar normal
            toggleBtn.style.display = 'none';
            sidebarContent.classList.remove('button-mode');
            
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

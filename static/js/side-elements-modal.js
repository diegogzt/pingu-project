// Script para el modal de elementos laterales en la página de play

document.addEventListener('DOMContentLoaded', function() {
    setupSideElementsModal();
});

function setupSideElementsModal() {
    // Elementos DOM
    const sideElements = document.querySelector('.side-elements');
    const toggleBtn = document.getElementById('side-elements-toggle-btn');
    const modal = document.getElementById('side-elements-modal');
    const modalBody = modal.querySelector('.side-elements-modal-body');
    const closeBtn = modal.querySelector('.close-side-elements-btn');
    
    // Si no existen los elementos necesarios, no continuamos
    if (!sideElements || !toggleBtn || !modal || !modalBody || !closeBtn) {
        console.warn('Elementos necesarios para el modal no encontrados');
        return;
    }
    
    // Función para copiar el contenido de los elementos laterales al modal
    function updateModalContent() {
        // Limpiar el contenido previo
        modalBody.innerHTML = '';
        
        // Clonar los elementos laterales
        const elementsClone = sideElements.cloneNode(true);
        
        // Extraer solo los círculos (no queremos la estructura contenedora)
        const circles = elementsClone.querySelectorAll('.circle-element');
        
        // Añadir cada círculo al cuerpo del modal
        circles.forEach(circle => {
            modalBody.appendChild(circle);
        });
    }
    
    // Función para abrir el modal
    function openModal() {
        // Actualizar el contenido del modal
        updateModalContent();
        
        // Mostrar el modal con animación
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
    
    // Función para cerrar el modal
    function closeModal() {
        // Ocultar el modal con animación
        modal.classList.add('hide');
        
        // Esperar a que termine la animación antes de quitar la clase show
        setTimeout(() => {
            modal.classList.remove('show');
            modal.classList.remove('hide');
            document.body.style.overflow = ''; // Restaurar scroll
        }, 300); // Tiempo igual a la duración de la animación
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
    
    // Control de visibilidad del botón según el tamaño de la pantalla
    function adjustButtonVisibility() {
        if (window.innerWidth <= 1200) {
            toggleBtn.style.display = 'flex';
        } else {
            toggleBtn.style.display = 'none';
            
            // Si el modal está abierto y se redimensiona a pantalla grande, cerrarlo
            if (modal.classList.contains('show')) {
                closeModal();
            }
        }
    }
    
    // Verificar la visibilidad inicial del botón
    adjustButtonVisibility();
    
    // Ajustar la visibilidad cuando cambie el tamaño de la ventana
    window.addEventListener('resize', adjustButtonVisibility);
}

(function() {
    function navigateToLinkedInWithTransition(url) {
        const qrContainer = document.getElementById('qr-container');
        qrContainer.classList.add('animating');
        setTimeout(() => {
            window.open(url, '_blank');
            qrContainer.classList.remove('animating');
        }, 1200);
    }
    window.navigateToLinkedInWithTransition = navigateToLinkedInWithTransition;

    // =================================================
    // === 1. Lógica del Botón de Tema (Modo Claro/Oscuro) ===
    // =================================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function updateTheme() {
        const savedTheme = localStorage.getItem('theme');
        const isLightMode = savedTheme === 'light';
        if (isLightMode) {
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        updateTheme();
    });

    // Inicializa el tema al cargar la página
    updateTheme();

    // =================================================
    // === 3. LÓGICA DEL NUEVO MENÚ Y MODALES ===
    // =================================================
    function initSideMenuAndModals() {
        const sideMenu = document.getElementById('side-menu');
        const pinBtn = document.getElementById('pin-menu-btn');
        const menuButtons = document.querySelectorAll("[data-modal-target]");
        const closeModalButtons = document.querySelectorAll(".close-modal-btn");

        function applyPinState() {
            // Comprobamos si estamos en la vista de escritorio (coincide con la media query)
            if (window.matchMedia('(min-width: 769px)').matches) {
                // Esta es tu lógica original para escritorio
                const isPinned = localStorage.getItem('menuPinned') === 'true';
                if (isPinned && pinBtn) { // pinBtn puede no existir en móvil
                    sideMenu.classList.add('pinned');
                    pinBtn.classList.add('pinned');
                    document.body.style.paddingLeft = '220px';
                } else {
                    sideMenu.classList.remove('pinned');
                    pinBtn.classList.remove('pinned');
                    document.body.style.paddingLeft = '60px';
                }
            } else {
                // Si estamos en móvil, forzamos a que no haya padding-left.
                document.body.style.paddingLeft = '0px';
                // Y nos aseguramos de que no esté "pinned" visualmente
                sideMenu.classList.remove('pinned');
                if(pinBtn) pinBtn.classList.remove('pinned');
            }
        }

        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isPinned = sideMenu.classList.toggle('pinned');
            pinBtn.classList.toggle('pinned');
            localStorage.setItem('menuPinned', isPinned);
            applyPinState();
        });

        window.addEventListener('resize', applyPinState); // Re-evaluar al cambiar tamaño

        function closeAllModals() {
            document.querySelectorAll('.modal.visible').forEach(modal => {
                modal.classList.remove('visible');
            });
        }

        menuButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetModal = document.querySelector(button.dataset.modalTarget);
                if (targetModal) {
                    closeAllModals();
                    targetModal.classList.add('visible');
                }
            });
        });

        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.modal').classList.remove('visible');
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('visible');
            }
        });

        applyPinState();
    }

    // =================================================
    // === 4. LÓGICA PARA ARRASTRAR MODALES ===
    // =================================================
    function initDraggableModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const header = modal.querySelector('.modal-header');
            let isDragging = false;
            let initialX, initialY, offsetX, offsetY;

            if (!header) return; // Si no hay header, no se puede arrastrar.

            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                if (!modal.style.left) {
                    const rect = modal.getBoundingClientRect();
                    modal.style.left = `${rect.left}px`;
                    modal.style.top = `${rect.top}px`;
                    modal.style.transform = 'none';
                }
                initialX = e.clientX;
                initialY = e.clientY;
                offsetX = modal.offsetLeft;
                offsetY = modal.offsetTop;

                document.onmousemove = (moveEvent) => {
                    if (isDragging) {
                        const dx = moveEvent.clientX - initialX;
                        const dy = moveEvent.clientY - initialY;
                        modal.style.left = `${offsetX + dx}px`;
                        modal.style.top = `${offsetY + dy}px`;
                    }
                };

                document.onmouseup = () => {
                    isDragging = false;
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            });
        });
    }

    // Ejecutar la inicialización del menú y modales cuando el DOM esté listo.
    document.addEventListener('DOMContentLoaded', function() {
        initSideMenuAndModals();
        initDraggableModals();
        // La inicialización del juego (initGame) se mantiene en su propio script si es necesario.
    });
})();
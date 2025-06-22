// script.js para Artigas
console.log("¡Bienvenido a la Aventura en Artigas! El script se ha cargado.");

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el año en el footer
    const yearSpan = document.getElementById('year-artigas');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Smooth scroll para los enlaces de navegación y destacar enlace activo (similar a Salto)
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');

    function getScrollOffset() {
        let offset = 0;
        if (header && getComputedStyle(header).position === 'sticky') {
            offset += header.offsetHeight;
        }
        if (nav && getComputedStyle(nav).position === 'sticky') {
            offset += nav.offsetHeight;
        }
        return offset + 15; // Margen extra
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - getScrollOffset();
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    function changeActiveLink() {
        let index = sections.length;
        const scrollPosition = window.scrollY + getScrollOffset() + 20;
        while(--index && scrollPosition < sections[index].offsetTop) {}
        navLinks.forEach((link) => link.classList.remove('active'));
        if (index >= 0 && sections[index]) {
            const currentSectionId = sections[index].id;
            const activeNavLink = document.querySelector(`nav a[href="#${currentSectionId}"]`);
            if (activeNavLink) activeNavLink.classList.add('active');
        }
    }
    if (sections.length > 0 && navLinks.length > 0) {
        changeActiveLink();
        window.addEventListener('scroll', changeActiveLink);
        window.addEventListener('resize', changeActiveLink);
    }

    // --- Lógica del Juego de Rompecabezas ---
    const puzzleContainer = document.getElementById('puzzle-container');
    const puzzleSourceContainer = document.getElementById('puzzle-source');
    const resultadoPuzzleEl = document.getElementById('resultado-puzzle');
    const resetPuzzleBtn = document.getElementById('reset-puzzle');

    // Configuración del Puzzle
    const PUZZLE_IMAGE_SRC = 'images/piedra_pintada.png'; // Imagen a usar
    const PUZZLE_ROWS = 2; // Por ejemplo, 2x3=6 piezas
    const PUZZLE_COLS = 3;
    const PIECE_BORDER_WIDTH = 1; // Ancho del borde de la pieza en px

    let pieceWidth, pieceHeight;
    let pieces = [];
    let slots = [];
    let draggedPiece = null;
    let correctPiecesCount = 0;

    function setupPuzzle() {
        if (!puzzleContainer || !puzzleSourceContainer || !resultadoPuzzleEl || !resetPuzzleBtn) {
            console.warn("Elementos del rompecabezas no encontrados. El juego no funcionará.");
            return;
        }

        // Limpiar contenedores y resetear variables
        puzzleContainer.innerHTML = '';
        puzzleSourceContainer.innerHTML = '';
        pieces = [];
        slots = [];
        correctPiecesCount = 0;
        resultadoPuzzleEl.textContent = '';
        resetPuzzleBtn.style.display = 'none';

        // Usar dimensiones del contenedor del puzzle para calcular tamaño de pieza
        // Restar bordes del contenedor y de las piezas mismas
        const containerWidth = puzzleContainer.clientWidth;
        const containerHeight = puzzleContainer.clientHeight;

        pieceWidth = Math.floor((containerWidth - (PUZZLE_COLS * PIECE_BORDER_WIDTH * 2)) / PUZZLE_COLS) ;
        pieceHeight = Math.floor((containerHeight - (PUZZLE_ROWS * PIECE_BORDER_WIDTH * 2)) / PUZZLE_ROWS);

        puzzleContainer.style.gridTemplateColumns = `repeat(${PUZZLE_COLS}, ${pieceWidth}px)`;
        puzzleContainer.style.gridTemplateRows = `repeat(${PUZZLE_ROWS}, ${pieceHeight}px)`;

        let pieceIdCounter = 0;
        for (let i = 0; i < PUZZLE_ROWS; i++) {
            for (let j = 0; j < PUZZLE_COLS; j++) {
                // Crear pieza
                const piece = document.createElement('div');
                piece.classList.add('puzzle-piece');
                piece.style.width = `${pieceWidth}px`;
                piece.style.height = `${pieceHeight}px`;
                piece.style.backgroundImage = `url(${PUZZLE_IMAGE_SRC})`;
                piece.style.backgroundPosition = `-${j * pieceWidth}px -${i * pieceHeight}px`;
                piece.style.backgroundSize = `${containerWidth}px ${containerHeight}px`; // Tamaño de la imagen original
                piece.draggable = true;
                piece.id = `piece-${pieceIdCounter}`;
                piece.dataset.correctCol = j;
                piece.dataset.correctRow = i;
                pieces.push(piece);

                // Crear slot correspondiente en el área del puzzle
                const slot = document.createElement('div');
                slot.classList.add('puzzle-slot');
                slot.style.width = `${pieceWidth}px`;
                slot.style.height = `${pieceHeight}px`;
                slot.dataset.col = j;
                slot.dataset.row = i;
                slots.push(slot);
                puzzleContainer.appendChild(slot);

                pieceIdCounter++;
            }
        }

        // Mezclar piezas y añadirlas al source container
        pieces.sort(() => Math.random() - 0.5);
        pieces.forEach(p => puzzleSourceContainer.appendChild(p));

        addDragDropListeners();
    }

    function addDragDropListeners() {
        pieces.forEach(piece => {
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragend', handleDragEnd);
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('dragenter', handleDragEnter);
            slot.addEventListener('dragleave', handleDragLeave);
            slot.addEventListener('drop', handleDrop);
        });

        // Permitir arrastrar piezas de vuelta al source container
        puzzleSourceContainer.addEventListener('dragover', handleDragOver);
        puzzleSourceContainer.addEventListener('drop', (e) => {
            if (draggedPiece && draggedPiece.parentElement !== puzzleSourceContainer) {
                puzzleSourceContainer.appendChild(draggedPiece);
                 // Si la pieza estaba correcta, decrementar el contador
                if (draggedPiece.dataset.isCorrect === "true") {
                    correctPiecesCount--;
                    draggedPiece.dataset.isCorrect = "false"; // Marcar como no correcta
                }
            }
        });
    }

    function handleDragStart(e) {
        draggedPiece = e.target;
        setTimeout(() => e.target.style.opacity = '0.5', 0);
    }

    function handleDragEnd(e) {
        draggedPiece = null;
        e.target.style.opacity = '1';
        slots.forEach(s => s.classList.remove('over')); // Limpiar resaltado de slots
    }

    function handleDragOver(e) {
        e.preventDefault(); // Necesario para permitir drop
    }

    function handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('puzzle-slot') && e.target.children.length === 0) { // Solo si el slot está vacío
            e.target.classList.add('over');
        }
    }

    function handleDragLeave(e) {
        if (e.target.classList.contains('puzzle-slot')) {
            e.target.classList.remove('over');
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        const targetSlot = e.target.closest('.puzzle-slot');

        if (targetSlot && draggedPiece && targetSlot.children.length === 0) { // Solo si el slot está vacío
            targetSlot.appendChild(draggedPiece);
            targetSlot.classList.remove('over');

            // Verificar si la pieza está en el slot correcto
            if (draggedPiece.dataset.correctCol == targetSlot.dataset.col &&
                draggedPiece.dataset.correctRow == targetSlot.dataset.row) {
                if (draggedPiece.dataset.isCorrect !== "true") {
                    correctPiecesCount++;
                    draggedPiece.dataset.isCorrect = "true"; // Marcar como correcta
                }
                draggedPiece.draggable = false; // No se puede mover una vez correcta
                // Opcional: aplicar un estilo a la pieza correcta
            } else {
                 // Si estaba correcta y se movió a un lugar incorrecto
                if (draggedPiece.dataset.isCorrect === "true") {
                    correctPiecesCount--;
                    draggedPiece.dataset.isCorrect = "false";
                }
            }

            checkCompletion();
        } else if (e.target === puzzleSourceContainer && draggedPiece) {
            // Si se suelta sobre el source container (ya manejado en su propio listener)
        }
    }

    function checkCompletion() {
        if (correctPiecesCount === PUZZLE_ROWS * PUZZLE_COLS) {
            resultadoPuzzleEl.textContent = "¡Excelente! ¡Armaste el rompecabezas de la Piedra Pintada! 🎉";
            resultadoPuzzleEl.className = 'correcto';
            resetPuzzleBtn.style.display = 'inline-block';
            // Deshabilitar drag en todas las piezas por si acaso
            pieces.forEach(p => p.draggable = false);
        } else {
            resultadoPuzzleEl.textContent = `Piezas correctas: ${correctPiecesCount} de ${PUZZLE_ROWS * PUZZLE_COLS}`;
            resultadoPuzzleEl.className = '';
        }
    }

    if (resetPuzzleBtn) {
        resetPuzzleBtn.addEventListener('click', setupPuzzle);
    }

    // Iniciar el rompecabezas
    // Se llama con un pequeño retraso para asegurar que el DOM está completamente renderizado y las dimensiones son correctas
    setTimeout(setupPuzzle, 100);
    window.addEventListener('resize', () => setTimeout(setupPuzzle, 100)); // Re-setup en resize por si cambian dimensiones
});

// script.js
console.log("¡Bienvenido a la Aventura en Salto! El script se ha cargado.");

// Actualizar el año en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll para los enlaces de navegación y destacar enlace activo
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Calcula la posición del elemento restando el offset del header/nav
                // Esto es un valor aproximado, puede necesitar ajuste fino
                const headerHeight = document.querySelector('header').offsetHeight;
                const navHeight = document.querySelector('nav').offsetHeight;
                const offsetTop = targetSection.offsetTop - headerHeight - navHeight - 20; // 20px de margen extra

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Destacar enlace activo al hacer scroll
    function changeActiveLink() {
        let index = sections.length;

        while(--index && window.scrollY + 150 < sections[index].offsetTop) {} // 150 es un offset para activar un poco antes

        navLinks.forEach((link) => link.classList.remove('active'));

        // Asegurarse de que el índice es válido antes de intentar acceder a navLinks[index]
        if (index >= 0 && index < navLinks.length) {
            // Comprobar que el href del enlace coincida con el id de la sección actual
            // Esto es importante porque la sección "bienvenida" no está en la nav
            const currentSectionId = sections[index].id;
            const activeNavLink = document.querySelector(`nav a[href="#${currentSectionId}"]`);
            if (activeNavLink) {
                activeNavLink.classList.add('active');
            } else if (currentSectionId === "bienvenida" && navLinks.length > 0) {
                // Si estamos en bienvenida y no hay un enlace directo, no activar ninguno
                // o activar el primero si se desea (ej. "Ubicación")
                // Por ahora, no se activa ninguno para "bienvenida"
            }
        }
    }

    // Inicializar el enlace activo y actualizarlo al hacer scroll
    changeActiveLink(); // Llamar una vez para el estado inicial
    window.addEventListener('scroll', changeActiveLink);

    // Lógica para el Juego de Correspondencia
    const juegoData = [
        { imagen: "images/termas_dayman.png", opciones: ["Termas", "Represa", "Río"], correcta: "Termas" },
        { imagen: "images/represa_salto_grande.png", opciones: ["Costanera", "Represa", "Naranja"], correcta: "Represa" },
        { imagen: "images/bandera_salto.png", opciones: ["Escudo", "Bandera", "Mapa"], correcta: "Bandera" },
        { imagen: "images/escudo_salto.png", opciones: ["Escudo", "Carpincho", "Ceibo"], correcta: "Escudo" },
        { imagen: "images/fauna_salto.png", opciones: ["Flora", "Fauna", "Termas"], correcta: "Fauna" }, // Placeholder genérico
        { imagen: "images/flora_salto.png", opciones: ["Flora", "Fauna", "Río"], correcta: "Flora" }  // Placeholder genérico
    ];

    let preguntaActualIndex = 0;
    const imgJuegoEl = document.getElementById('imagen-juego');
    const opcionesJuegoEl = document.getElementById('opciones-juego');
    const resultadoJuegoEl = document.getElementById('resultado-juego');
    const siguientePreguntaBtn = document.getElementById('siguiente-pregunta');

    function cargarPregunta() {
        const pregunta = juegoData[preguntaActualIndex];
        imgJuegoEl.src = pregunta.imagen;
        imgJuegoEl.alt = `Imagen de ${pregunta.correcta}`; // Mejorar accesibilidad
        opcionesJuegoEl.innerHTML = ''; // Limpiar opciones anteriores
        resultadoJuegoEl.textContent = '';
        resultadoJuegoEl.className = '';
        siguientePreguntaBtn.style.display = 'none'; // Ocultar botón "Siguiente"

        // Mezclar opciones para que no siempre estén en el mismo orden
        const opcionesMezcladas = [...pregunta.opciones].sort(() => Math.random() - 0.5);

        opcionesMezcladas.forEach(opcion => {
            const boton = document.createElement('button');
            boton.textContent = opcion;
            boton.onclick = () => verificarRespuesta(opcion, pregunta.correcta);
            opcionesJuegoEl.appendChild(boton);
        });

        // Habilitar botones de opción
        opcionesJuegoEl.querySelectorAll('button').forEach(b => b.disabled = false);
    }

    function verificarRespuesta(seleccionada, correcta) {
        opcionesJuegoEl.querySelectorAll('button').forEach(b => b.disabled = true); // Deshabilitar botones
        if (seleccionada === correcta) {
            resultadoJuegoEl.textContent = '¡Correcto! 🎉';
            resultadoJuegoEl.className = 'correcto';
        } else {
            resultadoJuegoEl.textContent = `Incorrecto. Era ${correcta}. 🙁`;
            resultadoJuegoEl.className = 'incorrecto';
        }
        siguientePreguntaBtn.style.display = 'inline-block'; // Mostrar botón "Siguiente"
    }

    siguientePreguntaBtn.addEventListener('click', () => {
        preguntaActualIndex++;
        if (preguntaActualIndex >= juegoData.length) {
            preguntaActualIndex = 0; // Reiniciar el juego o mostrar mensaje final
            resultadoJuegoEl.textContent = "¡Juego completado! Puedes empezar de nuevo.";
            // Opcional: esperar un poco antes de cargar la primera pregunta de nuevo
        }
        cargarPregunta();
    });

    // Cargar la primera pregunta del juego de correspondencia
    if (imgJuegoEl) { // Asegurarse que el elemento existe
       cargarPregunta();
    }

    // La lógica de la Sopa de Letras ha sido eliminada.

});

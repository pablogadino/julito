// script.js
console.log("¡Bienvenido a la Aventura en Salto! El script se ha cargado.");

// Actualizar el año en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll para los enlaces de navegación y destacar enlace activo
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');

    // Función para calcular el offset dinámicamente
    function getScrollOffset() {
        let offset = 0;
        if (header && getComputedStyle(header).position === 'sticky') {
            offset += header.offsetHeight;
        }
        if (nav && getComputedStyle(nav).position === 'sticky') {
            offset += nav.offsetHeight;
        }
        return offset + 20; // 20px de margen extra
    }

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - getScrollOffset();
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
        const scrollPosition = window.scrollY + getScrollOffset() + 20; // +20 para activar un poco antes

        while(--index && scrollPosition < sections[index].offsetTop) {}

        navLinks.forEach((link) => link.classList.remove('active'));

        if (index >= 0 && sections[index]) { // Asegurarse que sections[index] existe
            const currentSectionId = sections[index].id;
            const activeNavLink = document.querySelector(`nav a[href="#${currentSectionId}"]`);
            if (activeNavLink) {
                activeNavLink.classList.add('active');
            }
        } else if (navLinks.length > 0 && window.scrollY < sections[0].offsetTop - getScrollOffset()) {
            // Si estamos por encima de la primera sección (ej. en Bienvenida que no está en nav)
            // no activar ninguno, o el primero si se prefiere. Por ahora ninguno.
        }
    }

    // Inicializar el enlace activo y actualizarlo al hacer scroll y resize (por si cambia el offset)
    if (sections.length > 0 && navLinks.length > 0) { // Solo si hay secciones y links de nav
        changeActiveLink();
        window.addEventListener('scroll', changeActiveLink);
        window.addEventListener('resize', changeActiveLink); // Para recalcular offsets si el layout cambia
    }

    // Lógica para el Juego de Correspondencia
    const juegoData = [
        { imagen: "images/termas_dayman.png", opciones: ["Termas", "Represa", "Río"], correcta: "Termas" },
        { imagen: "images/represa_salto_grande.png", opciones: ["Costanera", "Represa", "Naranja"], correcta: "Represa" },
        { imagen: "images/bandera_salto.png", opciones: ["Escudo", "Bandera", "Mapa"], correcta: "Bandera" },
        { imagen: "images/escudo_salto.png", opciones: ["Escudo", "Carpincho", "Ceibo"], correcta: "Escudo" },
        { imagen: "images/fauna_salto.png", opciones: ["Flora", "Fauna", "Termas"], correcta: "Fauna" },
        { imagen: "images/flora_salto.png", opciones: ["Flora", "Fauna", "Río"], correcta: "Flora" }
    ];

    let preguntaActualIndex = 0;
    const imgJuegoEl = document.getElementById('imagen-juego');
    const opcionesJuegoEl = document.getElementById('opciones-juego');
    const resultadoJuegoEl = document.getElementById('resultado-juego');
    const siguientePreguntaBtn = document.getElementById('siguiente-pregunta');

    function cargarPregunta() {
        if (!imgJuegoEl || !opcionesJuegoEl || !resultadoJuegoEl || !siguientePreguntaBtn) {
            console.warn("Elementos del juego de correspondencia no encontrados. El juego no funcionará.");
            return;
        }

        const pregunta = juegoData[preguntaActualIndex];
        imgJuegoEl.src = pregunta.imagen;
        imgJuegoEl.alt = `Imagen de ${pregunta.correcta}`;
        opcionesJuegoEl.innerHTML = '';
        resultadoJuegoEl.textContent = '';
        resultadoJuegoEl.className = '';
        siguientePreguntaBtn.style.display = 'none';

        const opcionesMezcladas = [...pregunta.opciones].sort(() => Math.random() - 0.5);

        opcionesMezcladas.forEach(opcion => {
            const boton = document.createElement('button');
            boton.textContent = opcion;
            boton.onclick = () => verificarRespuesta(opcion, pregunta.correcta);
            opcionesJuegoEl.appendChild(boton);
        });

        opcionesJuegoEl.querySelectorAll('button').forEach(b => b.disabled = false);
    }

    function verificarRespuesta(seleccionada, correcta) {
        opcionesJuegoEl.querySelectorAll('button').forEach(b => b.disabled = true);
        if (seleccionada === correcta) {
            resultadoJuegoEl.textContent = '¡Correcto! 🎉';
            resultadoJuegoEl.className = 'correcto';
        } else {
            resultadoJuegoEl.textContent = `Incorrecto. La respuesta correcta es ${correcta}. 🙁`;
            resultadoJuegoEl.className = 'incorrecto';
        }
        siguientePreguntaBtn.style.display = 'inline-block';
    }

    if (siguientePreguntaBtn) {
        siguientePreguntaBtn.addEventListener('click', () => {
            preguntaActualIndex++;
            if (preguntaActualIndex >= juegoData.length) {
                preguntaActualIndex = 0;
                if(resultadoJuegoEl) resultadoJuegoEl.textContent = "¡Juego completado! Puedes empezar de nuevo o explorar más.";
            }
            cargarPregunta();
        });
    }


    // Cargar la primera pregunta del juego de correspondencia si los elementos existen
    if (imgJuegoEl && opcionesJuegoEl && resultadoJuegoEl && siguientePreguntaBtn) {
       cargarPregunta();
    }

    // La lógica de la Sopa de Letras ha sido eliminada.

});

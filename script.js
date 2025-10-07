document.addEventListener('DOMContentLoaded', () => {
    
    // --- DATOS DE LA MALLA CURRICULAR ---
    // (Pega aquí tu objeto 'ramos' completo sin cambios en su estructura)
    const ramos = {
        "Cálculo Diferencial": { semestre: 1, creditos: 4 },
        "Sociología industrial": { semestre: 1, creditos: 3 },
        "Introducción a la Ing. Industrial": { semestre: 1, creditos: 3 },
        // ... Y así con todas las demás materias
        "Trabajo de grado": { semestre: 10, creditos: 6 }
    };
    
    const frasesMotivacionales = [
        "¡Empezando con toda 💪!",
        "¡Ya se siente el ritmo 🏃‍♀️!",
        "Mitad de camino. ¡No pares ahora!",
        "La experiencia te hace más fuerte.",
        "Cada materia es un escalón más.",
        "Entrando en la recta final.",
        "Visualiza la meta. ¡Está cerca!",
        "Pulando los últimos detalles.",
        "Casi allí, futura ingeniera.",
        "Último sprint: ¡que se note quién es la reina de la eficiencia 👑!"
    ];

    const TOTAL_CREDITOS = Object.values(ramos).reduce((sum, ramo) => sum + ramo.creditos, 0);
    
    // --- ESTADO Y LOCALSTORAGE ---
    // El estado ahora puede ser 'pendiente', 'en-curso', 'cursado'
    let estadosRamos = JSON.parse(localStorage.getItem('estadosRamos')) || {};

    function guardarEstado() {
        localStorage.setItem('estadosRamos', JSON.stringify(estadosRamos));
    }

    // --- LÓGICA DEL TEMA (CLARO/OSCURO) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.checked = theme === 'dark';
    }

    themeToggle.addEventListener('change', () => {
        setTheme(themeToggle.checked ? 'dark' : 'light');
    });

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }
    
    // --- RENDERIZADO DE LA MALLA ---
    function renderizarMalla() {
        const mallaContainer = document.getElementById('malla-container');
        mallaContainer.innerHTML = ''; // Limpiar antes de renderizar

        for (let i = 1; i <= 10; i++) {
            const semestreDiv = document.createElement('div');
            semestreDiv.className = 'semestre';
            semestreDiv.innerHTML = `<h2>Semestre ${i}</h2>`;
            
            Object.entries(ramos).forEach(([nombre, datos]) => {
                if (datos.semestre === i) {
                    const estadoActual = estadosRamos[nombre] || 'pendiente';
                    
                    const ramoDiv = document.createElement('div');
                    ramoDiv.className = `ramo ${estadoActual}`;
                    ramoDiv.dataset.nombre = nombre;
                    ramoDiv.innerHTML = `
                        <strong>${nombre}</strong>
                        <span class="ramo-info">${datos.creditos} créditos</span>
                    `;
                    
                    // Click para cambiar de estado
                    ramoDiv.addEventListener('click', () => {
                        cambiarEstadoRamo(nombre);
                    });
                    
                    semestreDiv.appendChild(ramoDiv);
                }
            });
            mallaContainer.appendChild(semestreDiv);
        }
        actualizarProgreso();
    }
    
    // --- LÓGICA DE INTERACCIÓN ---
    function cambiarEstadoRamo(nombre) {
        const estadoActual = estadosRamos[nombre] || 'pendiente';
        let nuevoEstado;

        if (estadoActual === 'pendiente') nuevoEstado = 'en-curso';
        else if (estadoActual === 'en-curso') nuevoEstado = 'cursado';
        else nuevoEstado = 'pendiente'; // Vuelve a pendiente
        
        estadosRamos[nombre] = nuevoEstado;

        // Actualizar la clase del elemento en el DOM
        const ramoDiv = document.querySelector(`.ramo[data-nombre="${nombre}"]`);
        ramoDiv.className = `ramo ${nuevoEstado}`;
        
        guardarEstado();
        actualizarProgreso();
    }
    
    // --- LÓGICA DE LA BARRA DE PROGRESO ---
    function actualizarProgreso() {
        let creditosCursados = 0;
        let semestreMasAlto = 0;

        Object.entries(estadosRamos).forEach(([nombre, estado]) => {
            if (estado === 'cursado') {
                const ramo = ramos[nombre];
                creditosCursados += ramo.creditos;
                if (ramo.semestre > semestreMasAlto) {
                    semestreMasAlto = ramo.semestre;
                }
            }
        });

        const porcentaje = (creditosCursados / TOTAL_CREDITOS) * 100;
        
        // Actualizar la barra y el muñequito
        const progressBar = document.getElementById('progress-bar');
        const progressCharacter = document.getElementById('progress-character');
        progressBar.style.width = `${porcentaje}%`;
        
        // Actualizar frase motivacional
        const motivationalPhrase = document.getElementById('motivational-phrase');
        const semestreActual = Math.max(1, semestreMasAlto); // Si no ha cursado nada, mostrar la del semestre 1
        motivationalPhrase.textContent = frasesMotivacionales[semestreActual - 1];
    }
    
    // --- INICIALIZACIÓN ---
    loadTheme();
    renderizarMalla();
});

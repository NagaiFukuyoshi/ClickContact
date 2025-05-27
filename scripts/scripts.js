/*Variables*/
const btnToggle = document.querySelector('.fa-regular');
const crearContacto = document.querySelector('.contact');
const head = document.querySelector('.head');
const tablaContactos = document.querySelector('.contactos-agenda tbody');
const listaContactos = document.querySelector('.contenedor-agenda');
const formulario = document.querySelector('.nuevo-contacto');
const actualizar = document.getElementById('guardar');

let contactos = JSON.parse(localStorage.getItem('contactos') || '[]');
let contactoEditandoIndex = null;


/*Carga del DOM*/
document.addEventListener('DOMContentLoaded', () =>{
    claroOscuro();
    crearContactos();
    cargarContactosGuardados();
})

/*Modo claro y oscuro*/
function claroOscuro(){
    btnToggle.addEventListener('click',()=>{
        document.body.classList.toggle('modo_oscuro');

        if(btnToggle.classList.contains('fa-moon')){
            btnToggle.classList.remove('fa-moon');
            btnToggle.classList.add('fa-sun');
            btnToggle.setAttribute('title', 'Modo claro')
        } else{
            btnToggle.classList.remove('fa-sun');
            btnToggle.classList.add('fa-moon');
            btnToggle.setAttribute('title', 'Modo oscuro')
        }
    })
}

/*Mostrar menu-dinámico*/
function mostrarMenu(){
    head.classList.toggle('hidden');
    listaContactos.classList.toggle('hidden');
    formulario.classList.toggle('hidden');
    crearContacto.classList.toggle('focus');
}

/*Crear contacto*/
function crearContactos(){

    crearContacto.addEventListener('click', () =>{
        mostrarMenu(); //Se active la función de mostrar menu al darle click en crear contacto
    })

    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); //Evitar el comportamiento de reinicio que tiene por default

        //Se guardan los valores ingresados en los inputs
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;

        // Validaciones
        // Todos los campos deben estar llenos!
        if (!nombre || !apellido || !telefono || !email) {
            Swal.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'Por favor, completa todos los campos.'
            });
            return;
        }

        // Validación del teléfono
        const telefonoRegex = /^[0-9]{7,15}$/; // Números del 0 al 9 y de 7 a 15 dígitos
        if (!telefonoRegex.test(telefono)) { // Test para verificar si se cumple o no los requisitos pedidos en el regex
            Swal.fire({
                icon: 'error',
                title: 'Teléfono inválido',
                text: 'Ingresa un número de teléfono válido (solo dígitos, 7 a 15 caracteres).'
            });
            return;
        }

        // Validación del email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo inválido',
                text: 'Ingresa un correo electrónico válido.'
            });
            return;
        }

        const nuevoContacto = { nombre, apellido, telefono, email }; // Donde se almacenará el nuevo contacto

        if (actualizar.textContent === 'Actualizar') {
            // Actualizar contacto existente
            contactos[contactoEditandoIndex] = nuevoContacto;

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Contacto actualizado!",
                showConfirmButton: false,
                timer: 1500,
            });

        actualizar.textContent = 'Guardar';
        contactoEditandoIndex = null;
        
        } else {
            // Crear nuevo contacto
            contactos.push(nuevoContacto);

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Contacto guardado!",
                showConfirmButton: false,
                timer: 1500,
            });
        }

        // Guardar en localStorage y actualizar tabla
        localStorage.setItem('contactos', JSON.stringify(contactos));
        tablaContactos.innerHTML = '';
        cargarContactosGuardados();

        formulario.reset();
        mostrarMenu();
    });

}

/*Agregar fila*/
function agregarFilaContacto(contacto,index){
    const fila = document.createElement('tr');
    fila.setAttribute('data-index', index);

    fila.innerHTML = `
                    <td>${index}</td>
                    <td>${contacto.nombre}</td>
                    <td>${contacto.apellido}</td>
                    <td>${contacto.telefono}</td>
                    <td>${contacto.email}</td>
                    <td>
                        <i title="Editar" class="fa-solid fa-pen-to-square"></i>
                        <i title="Eliminar" class="fa-solid fa-trash"></i>
                    </td>
                        `
    tablaContactos.appendChild(fila) //se añade fila en la tabla de contactos

    //Se crean variables y eventos en editar y eliminar por aca ya que aun no se han creado
    const btnEliminar = fila.querySelector('.fa-trash'); 
    btnEliminar.addEventListener('click', () => eliminarContacto(index));

    const btnEditar = fila.querySelector('.fa-pen-to-square');
    btnEditar.addEventListener('click', () => editarContacto(index));
}

/*Cargar datos*/
function cargarContactosGuardados() {
    tablaContactos.innerHTML = ''; // Limpiar tabla

    if (contactos.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.setAttribute('colspan', '6'); // Ajusta al número de columnas (6)
        celda.textContent = 'No hay contactos guardados';
        fila.appendChild(celda);
        tablaContactos.appendChild(fila);
    } else {
        contactos.forEach((contacto, index) => {
            agregarFilaContacto(contacto, index);
        });
    }
}

/*Eliminar contactos*/
function eliminarContacto(index){
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Este contacto será eliminado permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            /////////////////////////
            contactos.splice(index,1); //Splice para eliminar 1 dato en el indice indicado
            localStorage.setItem('contactos', JSON.stringify(contactos));

            tablaContactos.innerHTML = '';
            cargarContactosGuardados();
            ////////////////////////
            Swal.fire({
                title: "Contacto eliminado!",
                text: "El contacto ha sido eliminado",
                icon: "success"
            });
        }
    });
}

/*Editar contactos*/
function editarContacto(index){
    let contact = contactos[index];
    document.getElementById('nombre').value = contact.nombre;
    document.getElementById('apellido').value = contact.apellido;
    document.getElementById('telefono').value = contact.telefono;
    document.getElementById('email').value = contact.email;

    actualizar.textContent = 'Actualizar';
    
    contactoEditandoIndex = index;

    mostrarMenu();
}
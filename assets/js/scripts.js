// Definimos un array de nombres de productos en el carrito
var productos = [];
// Recorremos todas las tarjetas de productos
document.querySelectorAll('#productos .card').forEach(function(producto) {
    // asignamos el titulo de la tarjeta con el nombre del producto
    producto.querySelector('h2').innerHTML = producto.getAttribute('nombre')
    // assignamos el precio de la tarjeta con el precio del producto
    producto.querySelector('small').innerHTML = producto.getAttribute('precio') + '€'
    // Escuchamos el evento de inicio de arrastre de la tarjeta
    producto.addEventListener('dragstart', function(e) {
        // asignamos en el evento el nombre y el precio del producto
        e.dataTransfer.setData("nombre", e.target.getAttribute('nombre'));
        e.dataTransfer.setData("precio", e.target.getAttribute('precio'));
        e.dataTransfer.setDragImage(producto.querySelector('img'), producto.querySelector('img').width / 2, producto.querySelector('img').height / 2);
    });
});

// Escuchamos el evento de soltar tarjeta en el carrito
document.querySelector('#soltar').addEventListener('drop', function(e) {
    e.preventDefault();
    // Comprovamos que el evento contenga el nombre del producto
    if (productos.includes(e.dataTransfer.getData("nombre"))) {
        // recorremos la lista del carrito
        document.querySelectorAll('#lista li').forEach(function(producto) {
            // Comprovamos si el producto que estamos comprovando es el mismo que queremos añadir
            if (producto.querySelector('.nombre').innerText == e.dataTransfer.getData("nombre")) {
                // sumamos 1 a la cantidad de productos
                producto.querySelector('.cantidad').innerHTML = +producto.querySelector('.cantidad').innerHTML + 1
                // Calculamos el precio del producto
                producto.querySelector('.precio').innerHTML = +producto.querySelector('.cantidad').innerText * +producto.querySelector('.precio').innerText
            }
        });
    } else {
        // Agregamos el producto al carrito
        document.querySelector('#lista').innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="nombre fw-bold">${e.dataTransfer.getData("nombre")}</div>
                <span class="precio" price="${e.dataTransfer.getData("precio")}">${e.dataTransfer.getData("precio")}</span>
            </div>
            <div class="btn-group flex-nowrap me-2 ms-auto my-auto botones" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-primary" onclick="quitar(this)">-</button>
                <button type="button" class="btn btn-primary" onclick="añadir(this)">+</button>
                <button type="button" class="btn btn-danger" onclick="eliminar(this)">X</button>
                </div>
                <span class="badge bg-primary rounded-pill cantidad my-auto">1</span>
        </li>
        `;
        // Agregamos el nombre del producto al array
        productos.push(e.dataTransfer.getData("nombre"));
    }
    // Calculamos el total
    calcularTotal();
    
    
});

document.querySelector('#soltar').addEventListener('dragover', function(e) {
    e.preventDefault();
});

// Restar 1 en la cantidad de un producto
function quitar(boton) {
    // Comprovamos si la cantidad del producto es mayor a 1
    if (+boton.parentNode.parentNode.querySelector('.cantidad').innerHTML > 1) {
        // Restamos uno a la cantidad
        boton.parentNode.parentNode.querySelector('.cantidad').innerHTML = +boton.parentNode.parentNode.querySelector('.cantidad').innerHTML - 1;
        // Calculamos el precio
        boton.parentNode.parentNode.querySelector('.precio').innerHTML = +boton.parentNode.parentNode.querySelector('.cantidad').innerText * +boton.parentNode.parentNode.querySelector('.precio').getAttribute('price')
    } else if (+boton.parentNode.parentNode.querySelector('.cantidad').innerHTML == 1) {
        boton.parentNode.parentNode.remove();
        var index = productos.indexOf(boton.parentNode.parentNode.querySelector('.nombre').innerText);
        if (index !== -1) {
            productos.splice(index, 1);
        }
    }
    calcularTotal();
}

// sumar uno a la cantidad de un producto
function añadir(boton) {
    boton.parentNode.parentNode.querySelector('.cantidad').innerHTML = +boton.parentNode.parentNode.querySelector('.cantidad').innerHTML + 1;
    boton.parentNode.parentNode.querySelector('.precio').innerHTML = +boton.parentNode.parentNode.querySelector('.cantidad').innerText * +boton.parentNode.parentNode.querySelector('.precio').getAttribute('price')
    calcularTotal();
        
}

// eliminar producto del carrito
function eliminar(boton) {
    boton.parentNode.parentNode.remove();
    var index = productos.indexOf(boton.parentNode.parentNode.querySelector('.nombre').innerText);
    console.log(index);
    if (index !== -1) {
        productos.splice(index, 1);
    }
    calcularTotal();
}

// calcular precio total del carrito
function calcularTotal() {
    var total = 0;
    document.querySelectorAll('.precio').forEach(function(precio) {
        total += +precio.innerText;
    });
    total = total.toFixed(2);
    document.querySelector('.total-price').innerHTML = total + '€';
}

// Mostrar el popup de compra final
function comprar() {
    document.querySelector('.modal-body').innerHTML = document.querySelector('#lista').innerHTML;   
    document.querySelector('.modal-body').querySelectorAll('.botones').forEach(function(botones) {
        botones.remove();
    })
}

// Mostrar popup de compra finalizada
function pagar() {
    $('#modal-compra').modal('toggle')
    $('#modal-finalizar').modal('toggle')
}
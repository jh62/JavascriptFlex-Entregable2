const productos = [
  { id: 1, nombre: "Robot Alpha", precio: 100, pic: "r1.jpg" },
  { id: 2, nombre: "Robot Beta", precio: 200, pic: "r2.jpg" },
  { id: 3, nombre: "Robot Gamma", precio: 300, pic: "r3.jpg" },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/**
 * Muestra los productos agregados por el usuario al carrito de compras.
 */
function mostrarProductos() {
  const listaProductos = document.getElementById("product-list");
  productos.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.className = "product col-md-4";
    productoDiv.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
        <img src="./img/${producto.pic}">
        <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
      `;
    listaProductos.appendChild(productoDiv);
  });
}

/**
 * Agrega al carrito de compras el producto seleccionado.
 * @param {*} productoId int que identifica al producto
 */
function agregarAlCarrito(productoId) {
  const producto = productos.find((p) => p.id === productoId);
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  mostrarToast("Producto agregado al carrito", "success");

  let carrito_amount = Object.keys(carrito).length;

  if (carrito_amount === 5) mostrarToast("Lo que es tener plata!", "warning", 2000);
  if (carrito_amount === 10) mostrarToast("Cuantos robots necesitas?", "warning", 2000);
  if (carrito_amount === 15) mostrarToast("Por qué no pedís uno más?", "warning", 2000);
  if (carrito_amount === 30) mostrarToast("Llevando 300 hay una promo especial.", "warning", 2000);
  if (carrito_amount === 300) mostrarToast("Con tu pedido de 300 robots, tenés de regalo un par de medias!", "warning", 2000);
}

function mostrarCarrito() {
  const listaCarrito = document.getElementById("cart-list");
  listaCarrito.innerHTML = "";
  let total = 0;
  carrito.forEach((item, index) => {
    const carritoItem = document.createElement("div");
    carritoItem.className = "cart-item col-md-4";
    carritoItem.innerHTML = `
        <p>${item.nombre} - $${item.precio}</p>
        <button class="btn btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
      `;
    listaCarrito.appendChild(carritoItem);
    total += item.precio;
  });
  document.getElementById("cart-total").innerText = `Total: $${total}`;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  mostrarToast("Producto eliminado del carrito");
}

function manejarCheckout() {
  if (carrito.length === 0) {
    // 'length' estaba mal escrito como 'lenght'
    mostrarToast("No tenes productos seleccionados.");
    return;
  }
  const formularioCheckout = document.getElementById("checkout-form");
  formularioCheckout.style.display = "block";
}

function enviarPedido() {
  const nombre = document.getElementById("name").value;
  const apellido = document.getElementById("surname").value;
  const direccion = document.getElementById("address").value;

  if (nombre && apellido && direccion) {
    mostrarToast(`Gracias por tu pedido, ${nombre}!`);
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
    document.getElementById("checkout-form").style.display = "none";
  } else {
    mostrarToast("Por favor, completa todos los campos.");
  }
}

function mostrarToast(mensaje, type = "", delay = 750) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.role = "alert";
  toast.ariaLive = "assertive";
  toast.ariaAtomic = "true";
  toast.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Robotiend</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">${mensaje}</div>
    `;
  toastContainer.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast, { delay });
  bsToast.show();
  toast.addEventListener("hidden.bs.toast", () => {
    toastContainer.removeChild(toast);
  });
}

document.getElementById("checkout-btn").addEventListener("click", manejarCheckout);
document.getElementById("submit-order").addEventListener("click", enviarPedido);

mostrarProductos();
mostrarCarrito();


const apiUrl = 'http://localhost:8080/integrales-market/api/products';

// Obtener todos los productos y mostrarlos en la tabla al cargar la página
async function getProducts() {
    try {
        const response = await fetch(`${apiUrl}/all`); //
        const products = await response.json(); // Convertir la respuesta en JSON
        displayProducts(products); // 
    } catch (error) {
        console.error('Error:', error); 
    }
}

// Mostrar los productos en la tabla HTML
function displayProducts(products) {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = ''; 

    // Insertar cada producto en la tabla
    products.forEach(product => {
        insertProductRow(product, false); 
    });
}

// Insertar una fila de producto en la tabla
function insertProductRow(product, atTop = true) {
    const productsList = document.getElementById('products-list');
    const row = productsList.insertRow(atTop ? 0 : -1); 


    // Definir el contenido de la fila
    row.innerHTML = `
        <td>${product.productId}</td>
        <td contenteditable="false">${product.name}</td>
        <td contenteditable="false">${product.categoryId}</td>
        <td contenteditable="false">${product.price}</td>
        <td>
            <button class="btn-edit" onclick="editRow(this)">Editar</button>
            <button class="btn-delete" onclick="deleteProduct(${product.productId})">Eliminar</button>
        </td>
    `;
}

// Crear un nuevo producto
async function createProduct() {
    const name = document.getElementById('productName').value; 
    const category = document.getElementById('productCategory').value; 
    const price = document.getElementById('productPrice').value; 

    // Crear objeto con los datos del nuevo producto
    const newProduct = { name, categoryId: category, price };

    try {
        // Llamada a la API para guardar el producto
        const response = await fetch(`${apiUrl}/save`, {
            method: 'POST', // Usar método POST para crear
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct) 
        });

        if (response.ok) {
            const savedProduct = await response.json(); 
            insertProductRow(savedProduct, true); // Insertar en la parte superior de la tabla
            clearForm(); 
        } else {
            console.error('Error al crear el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Limpiar el formulario después de crear un producto
function clearForm() {
    document.getElementById('productName').value = ''; 
    document.getElementById('productCategory').value = ''; 
    document.getElementById('productPrice').value = ''; 
}


// Habilitar la edición de una fila 
function editRow(button) {
    const row = button.parentNode.parentNode; 
    const cells = row.querySelectorAll('td[contenteditable="false"]'); 


    // Hacer las celdas editables
    cells.forEach(cell => cell.setAttribute('contenteditable', 'true'));
    button.textContent = 'Guardar'; 
    button.onclick = () => saveRow(row, button); // Asignar función de guardar
}


// Guardar los cambios realizados en una fila
async function saveRow(row, button) {
    const productId = row.cells[0].textContent; 
    const name = row.cells[1].textContent; // 
    const category = row.cells[2].textContent; 
    const price = row.cells[3].textContent; 



    // Crear objeto con los datos actualizados
    const updatedProduct = { productId, name, categoryId: category, price };

    try {
        // Llamada a la API para actualizar el producto
        const response = await fetch(`${apiUrl}/update`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct) 
        });


        if (response.ok) {
            // Desactivar edición de las celdas
            row.querySelectorAll('td[contenteditable="true"]').forEach(cell =>
                cell.setAttribute('contenteditable', 'false')
            );
            button.textContent = 'Editar'; 
            button.onclick = () => editRow(button); 
        } else {
            console.error('Error al actualizar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Eliminar un producto
async function deleteProduct(productId) {
    try {
        // Llamada a la API para eliminar el producto
        const response = await fetch(`${apiUrl}/delete/${productId}`, {
            method: 'DELETE' 
        });

        if (response.ok) {
            getProducts(); 
        } else {
            console.error('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar la lista de productos al inicio
getProducts();
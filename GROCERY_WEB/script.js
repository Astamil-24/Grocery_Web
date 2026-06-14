let products = [];
let sales = [];
let cart = [];
let editingProductId = null;
let currentInvoice = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    setupNavigation();
    loadDashboard();
    loadProducts();
    loadBillingProducts();
    loadSales();
});

function initializeData() {
    const storedProducts = localStorage.getItem('groceryProducts');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        products = [
            { id: 'P001', name: 'Apple', category: 'Fruits', price: 2.99, quantity: 50 },
            { id: 'P002', name: 'Banana', category: 'Fruits', price: 1.49, quantity: 80 },
            { id: 'P003', name: 'Orange', category: 'Fruits', price: 3.29, quantity: 45 },
            { id: 'P004', name: 'Milk', category: 'Dairy', price: 4.99, quantity: 30 },
            { id: 'P005', name: 'Cheese', category: 'Dairy', price: 6.99, quantity: 20 },
            { id: 'P006', name: 'Yogurt', category: 'Dairy', price: 3.49, quantity: 25 },
            { id: 'P007', name: 'Bread', category: 'Bakery', price: 2.99, quantity: 40 },
            { id: 'P008', name: 'Croissant', category: 'Bakery', price: 1.99, quantity: 35 },
            { id: 'P009', name: 'Carrot', category: 'Vegetables', price: 1.29, quantity: 60 },
            { id: 'P010', name: 'Broccoli', category: 'Vegetables', price: 2.49, quantity: 3 },
            { id: 'P011', name: 'Tomato', category: 'Vegetables', price: 1.99, quantity: 55 },
            { id: 'P012', name: 'Potato', category: 'Vegetables', price: 0.99, quantity: 100 },
            { id: 'P013', name: 'Cola', category: 'Beverages', price: 1.99, quantity: 70 },
            { id: 'P014', name: 'Orange Juice', category: 'Beverages', price: 3.99, quantity: 40 },
            { id: 'P015', name: 'Water Bottle', category: 'Beverages', price: 1.49, quantity: 90 },
            { id: 'P016', name: 'Chips', category: 'Snacks', price: 2.99, quantity: 4 },
            { id: 'P017', name: 'Cookies', category: 'Snacks', price: 3.49, quantity: 45 },
            { id: 'P018', name: 'Detergent', category: 'Household', price: 5.99, quantity: 15 },
            { id: 'P019', name: 'Soap', category: 'Household', price: 2.49, quantity: 2 },
            { id: 'P020', name: 'Paper Towels', category: 'Household', price: 4.49, quantity: 25 }
        ];
        saveProducts();
    }

    const storedSales = localStorage.getItem('grocerySales');
    if (storedSales) {
        sales = JSON.parse(storedSales);
    } else {
        sales = [];
        saveSales();
    }
}

function saveProducts() {
    localStorage.setItem('groceryProducts', JSON.stringify(products));
}

function saveSales() {
    localStorage.setItem('grocerySales', JSON.stringify(sales));
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
}

function navigateToSection(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    if (sectionId === 'dashboard') {
        loadDashboard();
    } else if (sectionId === 'products') {
        loadProducts();
    } else if (sectionId === 'billing') {
        loadBillingProducts();
    } else if (sectionId === 'sales') {
        loadSales();
    }
}

function loadDashboard() {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.quantity < 5).length;
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockProducts').textContent = lowStockProducts;
    document.getElementById('totalSales').textContent = totalSales;
    document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toFixed(2);

    const lowStockAlert = document.getElementById('lowStockAlert');
    const lowStockMessage = document.getElementById('lowStockMessage');
    
    if (lowStockProducts > 0) {
        lowStockAlert.style.display = 'flex';
        lowStockMessage.textContent = `${lowStockProducts} product(s) have low stock (less than 5 units)`;
    } else {
        lowStockAlert.style.display = 'none';
    }

    loadLowStockTable();
}

function loadLowStockTable() {
    const tbody = document.getElementById('lowStockTableBody');
    const lowStockProducts = products.filter(p => p.quantity < 5);

    if (lowStockProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No low stock products</td></tr>';
        return;
    }

    tbody.innerHTML = lowStockProducts.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td style="color: #f39c12; font-weight: bold;">${product.quantity}</td>
        </tr>
    `).join('');
}

function loadProducts(searchTerm = '') {
    const tbody = document.getElementById('productsTableBody');
    let filteredProducts = products;

    if (searchTerm) {
        filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filteredProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td style="${product.quantity < 5 ? 'color: #f39c12; font-weight: bold;' : ''}">${product.quantity}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function searchProducts() {
    const searchTerm = document.getElementById('productSearch').value;
    loadProducts(searchTerm);
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('modalTitle');

    form.reset();
    editingProductId = null;

    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            title.textContent = 'Edit Product';
            document.getElementById('productId').value = product.id;
            document.getElementById('productId').disabled = true;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productQuantity').value = product.quantity;
            editingProductId = productId;
        }
    } else {
        title.textContent = 'Add Product';
        document.getElementById('productId').disabled = false;
        const nextId = 'P' + String(products.length + 1).padStart(3, '0');
        document.getElementById('productId').value = nextId;
    }

    modal.classList.add('active');
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    editingProductId = null;
}

function saveProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);

    if (!editingProductId && products.some(p => p.id === productId)) {
        alert('Product ID already exists!');
        return;
    }

    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = { id: productId, name, category, price, quantity };
        }
    } else {
        products.push({ id: productId, name, category, price, quantity });
    }

    saveProducts();
    closeProductModal();
    loadProducts();
    loadDashboard();
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        loadProducts();
        loadDashboard();
    }
}

function loadBillingProducts(searchTerm = '') {
    const grid = document.getElementById('billingProductsGrid');
    let filteredProducts = products;

    if (searchTerm) {
        filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No products available</p>';
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card ${product.quantity < 5 ? 'low-stock' : ''}" 
             onclick="addToCart('${product.id}')"
             ${product.quantity === 0 ? 'style="opacity: 0.5; cursor: not-allowed;" onclick="return false;"' : ''}>
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <p class="price">₹${product.price.toFixed(2)}</p>
            <p class="quantity ${product.quantity < 5 ? 'warning' : ''}">
                Stock: ${product.quantity}
            </p>
        </div>
    `).join('');
}

function searchBillingProducts() {
    const searchTerm = document.getElementById('billingSearch').value;
    loadBillingProducts(searchTerm);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity === 0) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.quantity) {
            existingItem.quantity++;
        } else {
            alert('Not enough stock available!');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartDisplay();
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Cart is empty</p>';
        document.getElementById('cartSubtotal').textContent = '₹0.00';
        document.getElementById('cartTotal').textContent = '₹0.00';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateCartQuantity('${item.id}', -1)">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button onclick="updateCartQuantity('${item.id}', 1)">+</button>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartSubtotal').textContent = '₹' + subtotal.toFixed(2);
    document.getElementById('cartTotal').textContent = '₹' + subtotal.toFixed(2);
}

function updateCartQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!item || !product) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > product.quantity) {
        alert('Not enough stock available!');
        return;
    }

    item.quantity = newQuantity;
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function checkout() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    if (!confirm('Are you sure you want to complete this purchase?')) {
        return;
    }

   
    const invoiceNumber = 'INV-' + Date.now();
    const date = new Date().toISOString();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  
    const sale = {
        invoiceNumber,
        date,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total
    };

    sales.push(sale);
    saveSales();

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.quantity -= cartItem.quantity;
        }
    });
    saveProducts();

  
    currentInvoice = sale;

    cart = [];
    updateCartDisplay();
    loadBillingProducts();
    loadDashboard();

 
    showInvoiceModal(sale);
}

function showInvoiceModal(sale) {
    const modal = document.getElementById('invoiceModal');
    const content = document.getElementById('invoiceContent');

    const formattedDate = new Date(sale.date).toLocaleString();

    content.innerHTML = `
        <div class="invoice-content">
            <div class="invoice-header">
                <h2>Grocery Shop</h2>
                <p>123 Main Street, City</p>
                <p>Phone: (555) 123-4567</p>
            </div>
            <div class="invoice-details">
                <div>
                    <p><strong>Invoice #:</strong> ${sale.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                </div>
            </div>
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${sale.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>₹${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="invoice-total">
                Total: ₹${sale.total.toFixed(2)}
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeInvoiceModal() {
    const modal = document.getElementById('invoiceModal');
    modal.classList.remove('active');
    currentInvoice = null;
}

function printInvoice() {
    window.print();
}

function loadSales(dateFilter = null) {
    const tbody = document.getElementById('salesTableBody');
    let filteredSales = sales;

 
    filteredSales.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (dateFilter) {
        filteredSales = filteredSales.filter(sale => {
            const saleDate = new Date(sale.date).toISOString().split('T')[0];
            return saleDate === dateFilter;
        });
    }

    if (filteredSales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No sales records found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredSales.map(sale => {
        const formattedDate = new Date(sale.date).toLocaleDateString();
        const itemsCount = sale.items.reduce((sum, item) => sum + item.quantity, 0);
        
        return `
            <tr>
                <td>${sale.invoiceNumber}</td>
                <td>${formattedDate}</td>
                <td>${itemsCount} items</td>
                <td>₹${sale.total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewSaleInvoice('${sale.invoiceNumber}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterSalesByDate() {
    const dateFilter = document.getElementById('salesDateFilter').value;
    loadSales(dateFilter);
}

function clearDateFilter() {
    document.getElementById('salesDateFilter').value = '';
    loadSales();
}

function viewSaleInvoice(invoiceNumber) {
    const sale = sales.find(s => s.invoiceNumber === invoiceNumber);
    if (sale) {
        currentInvoice = sale;
        showInvoiceModal(sale);
    }
}

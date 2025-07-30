// StockHive - Central hub for all your products
// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' ? '/api' : `${window.location.origin}/api`;

// Global state
let allProducts = [];
let categories = new Set();
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// DOM Elements
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const modal = document.getElementById('productModal');
const closeModal = document.querySelector('.close');
const toast = document.getElementById('toast');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
    initializeAuthTabs();
    initializeAuthForms();
    initializeNavigation();
    initializeModal();
    initializeForm();
    
    // Check authentication status
    checkAuthStatus();
    
    // Hide modal on page load
    if (modal) modal.style.display = 'none';
});

// Authentication Functions
function checkAuthStatus() {
    if (authToken) {
        // Verify token is still valid
        fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Token invalid');
            }
        })
        .then(data => {
            currentUser = data.data;
            showApp();
        })
        .catch(error => {
            console.error('Auth check failed:', error);
            logout();
        });
    } else {
        showAuth();
    }
}

function showAuth() {
    authSection.style.display = 'flex';
    appSection.style.display = 'none';
    userInfo.style.display = 'none';
}

function showApp() {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    userInfo.style.display = 'flex';
    userName.textContent = currentUser.name;
    
    // Load initial data
    loadProducts();
    loadCategories();
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showAuth();
    showToast('Logged out successfully', 'success');
}

function initializeAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });
}

function initializeAuthForms() {
    // Login form
    document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                authToken = data.data.token;
                currentUser = data.data;
                localStorage.setItem('authToken', authToken);
                showApp();
                showToast('Login successful!', 'success');
            } else {
                showToast(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Login failed. Please try again.', 'error');
        }
    });
    
    // Register form
    document.getElementById('registerFormElement').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        try {
            console.log('Attempting registration with:', { name, email, password: '***' });
            console.log('API URL:', `${API_BASE_URL}/auth/register`);
            
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success) {
                authToken = data.data.token;
                currentUser = data.data;
                localStorage.setItem('authToken', authToken);
                showApp();
                showToast('Registration successful!', 'success');
            } else {
                showToast(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Registration failed. Please try again.', 'error');
        }
    });
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // Apply saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Navigation
function initializeNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            switchSection(targetSection);
        });
    });
}

function switchSection(sectionName) {
    // Update navigation buttons
    navButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update sections
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionName).classList.add('active');
    
    // Load section-specific data
    if (sectionName === 'products') {
        loadProducts();
    } else if (sectionName === 'categories') {
        loadCategories();
    }
}

// API Functions with Authentication
async function fetchAPI(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Add auth token if available
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options
        });
        
        if (response.status === 401) {
            // Token expired or invalid
            logout();
            throw new Error('Authentication required');
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('HTTP Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response has content before parsing JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            // For DELETE requests that might not return JSON
            const text = await response.text();
            return text ? JSON.parse(text) : { success: true };
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Product Functions
async function loadProducts() {
    try {
        const data = await fetchAPI('/products');
        allProducts = data.data || [];
        renderProducts(allProducts, document.getElementById('productsGrid'));
        updateStats(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
    }
}

function renderProducts(products, container) {
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No products found</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product._id}">
            <div class="product-image">
                <img src="${product.image || 'https://via.placeholder.com/300x200?text=Product+Image'}" 
                     alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'">
            </div>
            <div class="product-info">
                <div class="product-header">
                    <h3 onclick="showProductDetails('${product._id}', event)">${product.name}</h3>
                    <button class="btn-delete" onclick="deleteProduct('${product._id}', '${product.name}')" title="Delete product">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="product-description">${product.description || 'No description available'}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-category">${product.category}</div>
                ${product.stock !== undefined ? `<div class="product-stock">Stock: ${product.stock}</div>` : ''}
            </div>
        </div>
    `).join('');
}

function updateStats(products) {
    document.getElementById('totalProducts').textContent = products.length;
    
    const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean));
    document.getElementById('totalCategories').textContent = uniqueCategories.size;
    
    if (products.length > 0) {
        const prices = products.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        document.getElementById('priceRange').textContent = `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
    } else {
        document.getElementById('priceRange').textContent = '$0 - $0';
    }
}

async function searchProducts() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        showToast('Please enter a search term', 'info');
        return;
    }
    
    try {
        const data = await fetchAPI(`/products/search?query=${encodeURIComponent(query)}`);
        const results = data.data || [];
        renderProducts(results, document.getElementById('searchResults'));
        
        if (results.length === 0) {
            document.getElementById('searchResults').innerHTML = '<p class="placeholder-text">No products found matching your search</p>';
        }
    } catch (error) {
        console.error('Search error:', error);
        showToast('Search failed', 'error');
    }
}

async function loadCategories() {
    try {
        const data = await fetchAPI('/products');
        const products = data.data || [];
        
        // Extract unique categories
        categories = new Set(products.map(p => p.category).filter(Boolean));
        
        const categoryFilters = document.getElementById('categoryFilters');
        categoryFilters.innerHTML = Array.from(categories).map(category => `
            <button class="category-filter" onclick="filterByCategory('${category}', event)">
                <i class="fas fa-tag"></i> ${category}
            </button>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Failed to load categories', 'error');
    }
}

async function filterByCategory(category, event) {
    // Update active filter
    document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    try {
        const data = await fetchAPI(`/products/category/${encodeURIComponent(category)}`);
        const results = data.data || [];
        renderProducts(results, document.getElementById('categoryResults'));
        
        if (results.length === 0) {
            document.getElementById('categoryResults').innerHTML = '<p class="placeholder-text">No products found in this category</p>';
        }
    } catch (error) {
        console.error('Category filter error:', error);
        showToast('Failed to filter by category', 'error');
    }
}

// Modal Functions
function initializeModal() {
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

async function showProductDetails(productId, event) {
    event.preventDefault();
    
    try {
        const data = await fetchAPI(`/products/${productId}`);
        const product = data.data;
        
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${product.name}</h2>
                <div class="modal-actions">
                    <button class="btn btn-edit" onclick="openEditProductForm('${product._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="modal-close" onclick="closeProductModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="product-modal-content">
                <div class="product-image-large">
                    <img src="${product.image || 'https://via.placeholder.com/400x300?text=Product+Image'}" 
                         alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'">
                </div>
                <div class="product-details">
                    <div class="product-brand">${product.brand || 'Brand'}</div>
                    <div class="product-price-large">$${product.price.toFixed(2)}</div>
                    <div class="product-category-large">${product.category}</div>
                    <p class="product-description-full">${product.description || 'No description available'}</p>
                    ${product.stock !== undefined ? `<div class="product-stock-info">Stock: ${product.stock}</div>` : ''}
                    <div class="product-id">Product ID: ${product._id}</div>
                </div>
            </div>
        `;
        
        // Store the product data globally for editing
        window.currentProductForEdit = product;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading product details:', error);
        showToast('Failed to load product details', 'error');
    }
}

function closeProductModal() {
    modal.style.display = 'none';
}

async function openEditProductForm(productId) {
    let product = window.currentProductForEdit;
    
    // If product data is not available, fetch it
    if (!product || product._id !== productId) {
        try {
            const data = await fetchAPI(`/products/${productId}`);
            product = data.data;
        } catch (error) {
            console.error('Error fetching product for editing:', error);
            showToast('Failed to load product for editing', 'error');
            return;
        }
    }
    
    // Populate form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productBrand').value = product.brand || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productStock').value = product.stock || 0;
    
    // Update form to edit mode
    const form = document.getElementById('addProductForm');
    form.setAttribute('data-edit-id', product._id);
    form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Product';
    
    // Switch to add section
    switchSection('add');
    closeProductModal();
}

function resetEditMode() {
    const form = document.getElementById('addProductForm');
    form.removeAttribute('data-edit-id');
    form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Add Product';
    form.reset();
}

// Form Functions
function initializeForm() {
    const form = document.getElementById('addProductForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const productData = {
            name: formData.get('name'),
            brand: formData.get('brand'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            image: formData.get('image'),
            stock: parseInt(formData.get('stock')) || 0
        };
        
        const editId = form.getAttribute('data-edit-id');
        
        try {
            let response;
            if (editId) {
                // Update existing product
                response = await fetchAPI(`/products/${editId}`, {
                    method: 'PUT',
                    body: JSON.stringify(productData)
                });
                showToast('Product updated successfully!', 'success');
            } else {
                // Create new product
                response = await fetchAPI('/products', {
                    method: 'POST',
                    body: JSON.stringify(productData)
                });
                showToast('Product added successfully!', 'success');
            }
            
            form.reset();
            resetEditMode();
            loadProducts();
            loadCategories();
            
            // Switch to products section
            switchSection('products');
        } catch (error) {
            console.error('Form submission error:', error);
            showToast(editId ? 'Failed to update product' : 'Failed to add product', 'error');
        }
    });
    
    // Reset button
    form.querySelector('button[type="reset"]').addEventListener('click', () => {
        resetEditMode();
    });
}

// Delete Product
async function deleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
        return;
    }
    
    try {
        await fetchAPI(`/products/${productId}`, {
            method: 'DELETE'
        });
        
        showToast('Product deleted successfully!', 'success');
        loadProducts();
        loadCategories();
        
        // Close modal if open
        if (modal.style.display === 'block') {
            closeProductModal();
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Failed to delete product', 'error');
    }
}

// Utility Functions
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Search input enter key handler
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
}); 
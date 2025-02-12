document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const submitButton = document.getElementById("submitButton");
    const saveChangesButton = document.getElementById("saveChanges");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");
    const categoryFilter = document.getElementById("categoryFilter");
    const itemsPerPage = 5;
    let currentPage = 1;
    let editingIndex = null;

    function loadProducts() {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        const categoryLists = {
            "Fruits": document.getElementById("fruitList"),
            "Medicals": document.getElementById("medicalList"),
            "Grocery": document.getElementById("groceryList"),
            "Vegetables": document.getElementById("vegetableList")
        };

        Object.values(categoryLists).forEach(list => {
            if (list) list.innerHTML = "";
        });

        products = applyFilters(products);
        products = paginateProducts(products);

        products.forEach((product, index) => {
            const categoryListId = getCategoryListId(product.category);
            if (categoryListId && categoryLists[product.category]) {
                const productCard = createProductCard(product, index);
                categoryLists[product.category].appendChild(productCard);
            }
        });
    }

    function createProductCard(product, index) {
        const productCard = document.createElement("div");
        productCard.classList.add("product");
        
        let stockWarning = product.quantity < 5 ? "<p style='color: red;'>Low Stock!</p>" : "";

        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <strong>Price: $${product.price}</strong>
            <p>Available Quantity: ${product.quantity}</p>
            ${stockWarning}
            <button class="update-btn" data-index="${index}">Update</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        productCard.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(index));
        productCard.querySelector(".update-btn").addEventListener("click", () => updateProduct(index));
        return productCard;
    }

    function getCategoryListId(category) {
        return {
            "Fruits": "fruitList",
            "Medicals": "medicalList",
            "Grocery": "groceryList",
            "Vegetables": "vegetableList"
        }[category] || null;
    }

    function deleteProduct(index) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        loadProducts();
    }

    function updateProduct(index) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products[index];
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productDescription").value = product.description;
        document.getElementById("productImage").value = product.imageUrl;
        document.getElementById("productQuantity").value = product.quantity;
        document.getElementById("productCategory").value = product.category;
        editingIndex = index;
        submitButton.style.display = "none";
        saveChangesButton.style.display = "block";
    }

    saveChangesButton.addEventListener("click", () => {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        if (editingIndex !== null) {
            products[editingIndex] = {
                name: document.getElementById("productName").value,
                price: document.getElementById("productPrice").value,
                description: document.getElementById("productDescription").value,
                imageUrl: document.getElementById("productImage").value,
                quantity: document.getElementById("productQuantity").value,
                category: document.getElementById("productCategory").value
            };
            localStorage.setItem("products", JSON.stringify(products));
            loadProducts();
            productForm.reset();
            submitButton.style.display = "block";
            saveChangesButton.style.display = "none";
            editingIndex = null;
        }
    });

    productForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const newProduct = {
            name: document.getElementById("productName").value,
            price: document.getElementById("productPrice").value,
            description: document.getElementById("productDescription").value,
            imageUrl: document.getElementById("productImage").value,
            quantity: document.getElementById("productQuantity").value,
            category: document.getElementById("productCategory").value
        };
        let products = JSON.parse(localStorage.getItem("products")) || [];
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        loadProducts();
        productForm.reset();
    });

    function applyFilters(products) {
        if (searchInput.value) {
            products = products.filter(p => p.name.toLowerCase().includes(searchInput.value.toLowerCase()));
        }
        if (categoryFilter.value) {
            products = products.filter(p => p.category === categoryFilter.value);
        }
        if (sortSelect.value) {
            products.sort((a, b) => a[sortSelect.value] > b[sortSelect.value] ? 1 : -1);
        }
        return products;
    }

    function paginateProducts(products) {
        return products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }

    searchInput.addEventListener("input", loadProducts);
    sortSelect.addEventListener("change", loadProducts);
    categoryFilter.addEventListener("change", loadProducts);

    loadProducts();
});

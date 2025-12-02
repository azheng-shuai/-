// 显示提示信息
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 2000);
    }
}

// 检查登录状态
function checkLoginStatus() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// 更新登录状态显示
function updateLoginState() {
    const isLoggedIn = checkLoginStatus();
    const notLoggedInProfile = document.getElementById('notLoggedInProfile');
    const loggedInProfile = document.getElementById('loggedInProfile');
    const logoutContainer = document.getElementById('logoutContainer');
    
    if (notLoggedInProfile && loggedInProfile && logoutContainer) {
        if (isLoggedIn) {
            notLoggedInProfile.style.display = 'none';
            loggedInProfile.style.display = 'block';
            logoutContainer.style.display = 'block';
        } else {
            notLoggedInProfile.style.display = 'block';
            loggedInProfile.style.display = 'none';
            logoutContainer.style.display = 'none';
        }
    }
}

// 分类选择交互
function initCategorySelectors() {
    // 原有的宿舍分区选择器
    const dormAreaSelect = document.getElementById('dormAreaSelect');
    const dormAreaOptions = document.getElementById('dormAreaOptions');
    
    // 三级分类选择器
    const gradeSelect = document.getElementById('gradeSelect');
    const gradeOptions = document.getElementById('gradeOptions');
    const subjectSelect = document.getElementById('subjectSelect');
    const subjectOptions = document.getElementById('subjectOptions');
    const majorSelect = document.getElementById('majorSelect');
    const majorOptions = document.getElementById('majorOptions');
    
    // 年级选择
    if (gradeSelect && gradeOptions) {
        gradeSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            gradeOptions.classList.toggle('active');
            subjectOptions.classList.remove('active');
            majorOptions.classList.remove('active');
            if (dormAreaOptions) dormAreaOptions.classList.remove('active');
        });
    }
    
    // 学科分类选择
    if (subjectSelect && subjectOptions) {
        subjectSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            subjectOptions.classList.toggle('active');
            gradeOptions.classList.remove('active');
            majorOptions.classList.remove('active');
            if (dormAreaOptions) dormAreaOptions.classList.remove('active');
        });
    }
    
    // 专业选择
    if (majorSelect && majorOptions) {
        majorSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            majorOptions.classList.toggle('active');
            gradeOptions.classList.remove('active');
            subjectOptions.classList.remove('active');
            if (dormAreaOptions) dormAreaOptions.classList.remove('active');
        });
    }
    
    // 原有的宿舍分区选择
    if (dormAreaSelect && dormAreaOptions) {
        dormAreaSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            dormAreaOptions.classList.toggle('active');
            if (gradeOptions) gradeOptions.classList.remove('active');
            if (subjectOptions) subjectOptions.classList.remove('active');
            if (majorOptions) majorOptions.classList.remove('active');
        });
    }
    
    // 标签选择交互
    document.querySelectorAll('.option-tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.stopPropagation();
            const optionsContainer = this.parentElement;
            
            // 如果是单选，先清除其他选项的选中状态
            if (optionsContainer.id === 'gradeOptions' || 
                optionsContainer.id === 'subjectOptions' || 
                optionsContainer.id === 'majorOptions' ||
                optionsContainer.id === 'dormAreaOptions' ||
                optionsContainer.id === 'bookCategoryOptions' ||
                optionsContainer.id === 'dormAreaOptions') {
                optionsContainer.querySelectorAll('.option-tag').forEach(t => {
                    t.classList.remove('selected');
                });
            }
            
            this.classList.toggle('selected');
            
            // 更新选择框显示
            const selectElement = document.getElementById(optionsContainer.id.replace('Options', 'Select'));
            if (selectElement) {
                const selectedTags = optionsContainer.querySelectorAll('.option-tag.selected');
                if (selectedTags.length > 0) {
                    const selectedText = Array.from(selectedTags).map(tag => tag.textContent).join(', ');
                    selectElement.querySelector('span').textContent = selectedText;
                } else {
                    selectElement.querySelector('span').textContent = selectElement.id.includes('grade') ? '请选择年级' :
                                                                      selectElement.id.includes('subject') ? '请选择学科' :
                                                                      selectElement.id.includes('major') ? '请选择专业' :
                                                                      selectElement.id.includes('dorm') ? '请点击选择' :
                                                                      '请点击选择';
                }
            }
            
            // 关闭选项列表
            if (optionsContainer.id === 'gradeOptions' || 
                optionsContainer.id === 'subjectOptions' || 
                optionsContainer.id === 'majorOptions' ||
                optionsContainer.id === 'dormAreaOptions') {
                setTimeout(() => {
                    optionsContainer.classList.remove('active');
                }, 300);
            }
        });
    });
    
    // 点击页面其他地方关闭选项列表
    document.addEventListener('click', function() {
        if (gradeOptions) gradeOptions.classList.remove('active');
        if (subjectOptions) subjectOptions.classList.remove('active');
        if (majorOptions) majorOptions.classList.remove('active');
        if (dormAreaOptions) dormAreaOptions.classList.remove('active');
    });
}

// 添加到购物车函数
function addToCart(book) {
    if (!checkLoginStatus()) {
        showToast('请先登录');
        return false;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 检查是否已存在相同书籍
    const existingItem = cart.find(item => item.title === book.title);
    if (existingItem) {
        showToast('该书籍已在购物车中');
        return false;
    }
    
    cart.push(book);
    localStorage.setItem('cart', JSON.stringify(cart));
    return true;
}

// 更新购物车徽章
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBadge = document.getElementById('cartBadge');
    
    if (cartBadge) {
        const itemCount = cart.length;
        cartBadge.textContent = itemCount;
        
        if (itemCount > 0) {
            cartBadge.style.display = 'flex';
            
            // 如果数量超过99，显示99+
            if (itemCount > 99) {
                cartBadge.textContent = '99+';
                cartBadge.style.fontSize = '9px';
                cartBadge.style.width = '22px';
                cartBadge.style.height = '22px';
            } else {
                cartBadge.style.fontSize = '11px';
                cartBadge.style.width = '18px';
                cartBadge.style.height = '18px';
            }
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// 购物车变化监听器
function setupCartListener() {
    // 监听storage变化（跨页面更新购物车）
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateCartBadge();
        }
    });
    
    // 重写localStorage的setItem方法以监听变化
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        const event = new Event('storage');
        event.key = key;
        event.newValue = value;
        window.dispatchEvent(event);
        originalSetItem.apply(this, arguments);
    };
}

// 初始化购物车徽章和监听器
function initCartBadge() {
    updateCartBadge();
    setupCartListener();
}

// 添加到购物车并更新徽章
function addToCartWithBadge(book) {
    const result = addToCart(book);
    if (result) {
        updateCartBadge();
    }
    return result;
}

// 从购物车移除并更新徽章
function removeFromCartWithBadge(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        showToast('已从购物车移除');
        return true;
    }
    return false;
}

// 清空购物车并更新徽章
function clearCartWithBadge() {
    localStorage.removeItem('cart');
    updateCartBadge();
    showToast('购物车已清空');
}

// 获取购物车商品数量
function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length;
}

// 更新购物车显示
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.getElementById('cartCount');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">购物车为空</div>';
            if (cartCountElement) cartCountElement.textContent = '0';
            if (totalPriceElement) totalPriceElement.textContent = '0.00';
            return;
        }
        
        let totalPrice = 0;
        
        cart.forEach((item, index) => {
            totalPrice += item.price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <input type="checkbox" class="cart-checkbox" checked onchange="updateTotalPrice()">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik00MCA0MEM0My4zMTM3IDQwIDQ2IDM3LjMxMzcgNDYgMzRDNDYgMzAuNjg2MyA0My4zMTM3IDI4IDQwIDI4QzM2LjY4NjMgMjggMzQgMzAuNjg2MyAzNCAzNEMzNCAzNy4zMTMcgMzYuNjg2MyA0MCA0MCA0MFpNNDAgNDJDMzQuNDc3OCA0MiAyNiA0NC4yMzg4IDI2IDUwVjU2SDU0VjUwQzU0IDQ0LjIzODggNDUuNTIyMiA0MiA0MCA0MloiIGZpbGw9IiM5OTkiLz4KPC9zdmc+Cg=='">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        if (cartCountElement) cartCountElement.textContent = cart.length;
        if (totalPriceElement) totalPriceElement.textContent = totalPrice.toFixed(2);
    }
}

// 从购物车移除商品
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showToast('已从购物车移除');
}

// 更新总价
function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkboxes = document.querySelectorAll('.cart-checkbox:checked');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (totalPriceElement) {
        if (checkboxes.length === 0) {
            totalPriceElement.textContent = '0.00';
        } else {
            let totalPrice = 0;
            cart.forEach((item, index) => {
                const checkbox = document.querySelectorAll('.cart-checkbox')[index];
                if (checkbox && checkbox.checked) {
                    totalPrice += item.price;
                }
            });
            totalPriceElement.textContent = totalPrice.toFixed(2);
        }
    }
}

// 验证表单
function validateSellForm() {
    const grade = document.querySelector('#gradeOptions .option-tag.selected');
    const subject = document.querySelector('#subjectOptions .option-tag.selected');
    const major = document.querySelector('#majorOptions .option-tag.selected');
    const dormArea = document.getElementById('dormAreaInput') ? document.getElementById('dormAreaInput').value : '';
    const description = document.querySelector('.form-textarea').value;
    const price = document.querySelector('.form-input[type="number"]').value;
    const contact = document.querySelector('.form-input[type="text"]').value;
    
    if (!grade) {
        showToast('请选择年级');
        return false;
    }
    
    if (!subject) {
        showToast('请选择学科分类');
        return false;
    }
    
    if (!major) {
        showToast('请选择专业');
        return false;
    }
    
    if (!dormArea || dormArea.trim() === '') {
        showToast('请输入宿舍分区');
        return false;
    }
    
    if (!description.trim()) {
        showToast('请输入详情说明');
        return false;
    }
    
    if (!price || parseFloat(price) <= 0) {
        showToast('请输入正确的价格');
        return false;
    }
    
    if (!contact.trim()) {
        showToast('请输入联系方式');
        return false;
    }
    
    return true;
}

// 购物车相关函数
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = cart.length;
    });
}

// 初始化购物车显示
function initCart() {
    updateCartCount();
}

// 保存发布的书籍数据
function savePublishedBook(bookData) {
    let publishedBooks = JSON.parse(localStorage.getItem('publishedBooks')) || {};
    
    const subject = bookData.subject;
    if (!publishedBooks[subject]) {
        publishedBooks[subject] = [];
    }
    
    publishedBooks[subject].push(bookData);
    
    localStorage.setItem('publishedBooks', JSON.stringify(publishedBooks));
}

// 加载已发布的书籍
function loadPublishedBooks(subject) {
    const publishedBooks = JSON.parse(localStorage.getItem('publishedBooks')) || {};
    const books = publishedBooks[subject] || [];
    
    if (books.length === 0) {
        return;
    }
    
    const booksContainer = document.querySelector('.science-books');
    if (!booksContainer) {
        return;
    }
    
    // 只显示该分类的书籍
    books.forEach(book => {
        if (book.subject === subject) {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <div class="book-item-image" onclick="showPublishedBookDetail(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                    <img src="${book.image}" alt="${book.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik00MCA0MEM0My4zMTM3IDQwIDQ2IDM3LjMxMzcgNDYgMzRDNDYgMzAuNjg2MyA0My4zMTM3IDI4IDQwIDI4QzM2LjY4NjMgMjggMzQgMzAuNjg2MyAzNCAzNEMzNCAzNy4zMTM3IDM2LjY4NjMgNDAgNDAgNDBaTTQwIDQyQzM0LjQ3NzggNDIgMjYgNDQuMjM4OCAyNiA1MFY1Nkg1NFY1MEM1NCA0NC4yMzg4IDQ1LjUyMjIgNDIgNDAgNDJaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo='">
                </div>
                <div class="book-item-details">
                    <div class="book-item-title">${book.title}</div>
                    <div class="book-item-subtitle">
                        ${book.grade} | ${book.major}
                    </div>
                    <div class="book-item-price">¥${book.price.toFixed(2)}</div>
                    <div class="book-item-actions">
                        <button class="action-btn contact-btn" onclick="contactSeller('${book.contact}')">联系卖家</button>
                    </div>
                </div>
            `;
            booksContainer.appendChild(bookItem);
        }
    });
}

// 显示发布的书籍详情
function showPublishedBookDetail(book) {
    currentBook = book;
    
    document.getElementById('modalBookTitle').textContent = book.title;
    document.getElementById('modalBookPrice').textContent = `¥${book.price.toFixed(2)}`;
    document.getElementById('modalBookDescription').textContent = 
        `年级：${book.grade}\n专业：${book.major}\n宿舍：${book.dormArea}\n联系方式：${book.contact}\n\n${book.description}`;
    document.getElementById('modalBookImage').src = book.image;
    
    document.getElementById('bookDetailModal').classList.add('active');
}

// 联系卖家
function contactSeller(contact) {
    showToast(`联系方式：${contact}`);
}

// 页面加载时根据当前页面加载对应分类的书籍
function initPublishedBooks() {
    const pageTitle = document.querySelector('.title')?.textContent || document.title;
    let subject = '';
    
    if (pageTitle.includes('理工材料')) {
        subject = '理工材料';
    } else if (pageTitle.includes('经济科学')) {
        subject = '经济科学';
    } else if (pageTitle.includes('人文社科')) {
        subject = '人文社科';
    } else if (pageTitle.includes('上岸必备')) {
        subject = '上岸必备';
    }
    
    if (subject) {
        loadPublishedBooks(subject);
    }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    updateLoginState();
    initCategorySelectors();
    initCartBadge();
    initCart();
    
    // 底部导航激活状态
    const currentPage = window.location.pathname.split('/').pop() || window.location.href.split('/').pop();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 返回按钮事件
    const backButtons = document.querySelectorAll('.back-btn:not([style*="visibility: hidden"])');
    backButtons.forEach(btn => {
        if (!btn.getAttribute('onclick')) {
            btn.addEventListener('click', function() {
                window.history.back();
            });
        }
    });
    
    // 页面加载时初始化购物车显示
    if (window.location.pathname.includes('cart.html') || window.location.href.includes('cart.html')) {
        updateCartDisplay();
    }
    
    // 发布按钮事件
    const publishBtn = document.getElementById('publishBtn');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            if (!checkLoginStatus()) {
                showToast('请先登录');
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
                return;
            }
            
            if (!validateSellForm()) {
                return;
            }
            
            // 收集表单数据
            const bookData = {
                id: Date.now(),
                grade: document.querySelector('#gradeOptions .option-tag.selected').textContent,
                subject: document.querySelector('#subjectOptions .option-tag.selected').textContent,
                major: document.querySelector('#majorOptions .option-tag.selected').textContent,
                dormArea: document.getElementById('dormAreaInput') ? document.getElementById('dormAreaInput').value : '',
                description: document.querySelector('.form-textarea').value,
                price: parseFloat(document.querySelector('.form-input[type="number"]').value),
                contact: document.querySelector('.form-input[type="text"]').value,
                publishTime: new Date().toISOString(),
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik00MCA0MEM0My4zMTM3IDQwIDQ2IDM3LjMxMzcgNDYgMzRDNDYgMzAuNjg2MyA0My4zMTM3IDI4IDQwIDI4QzM2LjY4NjMgMjggMzQgMzAuNjg2MyAzNCAzNEMzNCAzNy4zMTM3IDM2LjY4NjMgNDAgNDAgNDBaTTQwIDQyQzM0LjQ3NzggNDIgMjYgNDQuMjM4OCAyNiA1MFY1Nkg1NFY1MEM1NCA0NC4yMzg4IDQ1LjUyMjIgNDIgNDAgNDJaIiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=',
                title: `用户发布的 ${document.querySelector('#majorOptions .option-tag.selected').textContent} 书籍`
            };
            
            // 保存到localStorage
            savePublishedBook(bookData);
            
            showToast('发布成功');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
    
    // 结算按钮事件
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showToast('购物车为空');
                return;
            }
            
            if (!checkLoginStatus()) {
                showToast('请先登录');
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
                return;
            }
            
            showToast('结算功能开发中');
        });
    }
    
    // 初始化发布的书籍
    initPublishedBooks();
});
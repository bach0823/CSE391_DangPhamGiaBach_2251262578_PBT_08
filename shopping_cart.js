function createCart() {
    // Dữ liệu giỏ hàng private
    let items = [];
    let activeDiscountCode = "";

    // Hàm định dạng số có dấu chấm
    function formatNumber(num) {
        return num.toLocaleString('vi-VN');
    }

    return {
        // Thêm sản phẩm
        addItem(product, quantity = 1) {
            const existing = items.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                items.push({ ...product, quantity });
            }
        },
        
        // Xóa sản phẩm theo id
        removeItem(productId) {
            items = items.filter(item => item.id !== productId);
        },
        
        // Cập nhật số lượng
        updateQuantity(productId, newQuantity) {
            const item = items.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
            }
        },
        
        // Tính tổng tiền
        getTotal() {
            let total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            if (activeDiscountCode === "SALE10") {
                total = total * 0.9;
            } else if (activeDiscountCode === "SALE20") {
                total = total * 0.8;
            } else if (activeDiscountCode === "FREESHIP") {
                total = Math.max(0, total - 30000);
            }
            return total;
        },
        
        // Áp dụng mã giảm giá
        applyDiscount(code) {
            activeDiscountCode = code;
        },
        
        // In giỏ hàng dạng bảng với độ rộng cố định là 60 ký tự
        printCart() {
            const width = 60;
            const borderLine = "─".repeat(width - 2);
            
            console.log(`┌${borderLine}┐`);
            
            // Header: Cột 2 rộng 21, cột 4 rộng 10, cột 5 rộng 10
            const colProductHeader = "Sản phẩm".padEnd(21);
            const colPriceHeader = "Đơn giá".padStart(10);
            const colTotalHeader = "Tổng".padStart(10);
            console.log(`│ # │ ${colProductHeader} │ SL │ ${colPriceHeader} │ ${colTotalHeader} │`);
            
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const num = String(i + 1);
                const name = item.name.padEnd(21).substring(0, 21);
                const qty = String(item.quantity).padStart(2);
                const price = formatNumber(item.price).padStart(10);
                const total = formatNumber(item.price * item.quantity).padStart(10);
                console.log(`│ ${num} │ ${name} │ ${qty} │ ${price} │ ${total} │`);
            }
            console.log(`├${borderLine}┤`);
            
            const totalVal = formatNumber(this.getTotal()) + "đ";
            const discountStr = activeDiscountCode ? ` (${activeDiscountCode})` : "";
            const totalLabel = `Tổng cộng${discountStr}:`;
            
            // Căn lề phải phần tiền cho dòng tổng cộng
            const spaceCount = width - 4 - totalLabel.length - totalVal.length;
            const spaces = " ".repeat(spaceCount > 0 ? spaceCount : 1);
            console.log(`│ ${totalLabel}${spaces}${totalVal} │`);
            console.log(`└${borderLine}┘`);
        },
        
        // Lấy tổng số lượng sản phẩm
        getItemCount() {
            return items.reduce((sum, item) => sum + item.quantity, 0);
        },
        
        // Xóa sạch giỏ hàng
        clearCart() {
            items = [];
            activeDiscountCode = "";
        }
    };
}

// Test
const cart = createCart();

cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 }, 2);
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);

cart.printCart();

cart.applyDiscount("SALE10");
cart.printCart();

console.log("Số SP:", cart.getItemCount());
cart.removeItem(3);
console.log("Sau xóa:", cart.getItemCount());

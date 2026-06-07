## PHẦN A — KIỂM TRA ĐỌC HIỂU (20 điểm)

### Câu A1 (5đ) — Function Declaration vs Expression vs Arrow

Viết cùng 1 hàm `tinhThueBaoHiem(luong)` theo 3 cách: Function Declaration, Function Expression, Arrow Function.
Hàm tính: Thuế = 10% nếu lương > 11 triệu, 0% nếu ≤ 11 triệu. Trả về object `{ thuong, thuc_nhan }`.
Giải thích 3 cách này có khác nhau về hoisting không.

1. Function Declaration:
```javascript
function tinhThueBaoHiem(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return { thuong: thue, thuc_nhan: luong - thue };
}
```

2. Function Expression:
```javascript
const tinhThueBaoHiem = function(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return { thuong: thue, thuc_nhan: luong - thue };
};
```

3. Arrow Function:
```javascript
const tinhThueBaoHiem = (luong) => {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return { thuong: thue, thuc_nhan: luong - thue };
};
```

Sự khác nhau về hoisting:
- Function Declaration có hoisting, có thể gọi hàm trước khi khai báo.
Ví dụ:
```javascript
console.log(tinhThueBaoHiem(12000000));
function tinhThueBaoHiem(luong) { return { thuong: 0, thuc_nhan: luong }; }
```
- Function Expression và Arrow Function không có hoisting do dùng const. Gọi trước khi khai báo sẽ báo lỗi ReferenceError.
Ví dụ:
```javascript
console.log(tinhThueBaoHiem(12000000)); // Lỗi ReferenceError
const tinhThueBaoHiem = (luong) => { return { thuong: 0, thuc_nhan: luong }; };
```

---

### Câu A2 (5đ) — Scope & Closure

Dự đoán output và giải thích tại sao var và let cho kết quả khác nhau trong vòng lặp setTimeout.

Dự đoán output:
Đoạn 1:
- c.increment() -> 1
- c.increment() -> 2
- c.increment() -> 3
- c.decrement() -> 2
- c.getCount() -> 2

Đoạn 2 (sau 200ms):
- var: 3 (in ra 3 lần)
- let: 0, 1, 2 (in ra lần lượt)

Giải thích:
- var không có block scope. Trong vòng lặp for, cả 3 hàm setTimeout đều dùng chung một biến i. Khi callback chạy thì vòng lặp đã chạy xong (i = 3), nên đều in ra 3.
- let có block scope. Mỗi vòng lặp JS tạo ra một biến j mới độc lập, các callback giữ được giá trị j riêng nên in ra đúng 0, 1, 2.

---

### Câu A3 (5đ) — Array Methods

Viết 1 dòng code cho mỗi yêu cầu:

1. Lấy các số chẵn:
`const chan = nums.filter(n => n % 2 === 0);`

2. Nhân mỗi số với 3:
`const nhanBa = nums.map(n => n * 3);`

3. Tính tổng tất cả:
`const tong = nums.reduce((acc, cur) => acc + cur, 0);`

4. Tìm số đầu tiên > 7:
`const timSo = nums.find(n => n > 7);`

5. Kiểm tra CÓ số > 10 không:
`const checkCo = nums.some(n => n > 10);`

6. Kiểm tra TẤT CẢ đều > 0:
`const checkAll = nums.every(n => n > 0);`

7. Tạo mảng "Số X là [chẵn/lẻ]":
`const chanLe = nums.map(n => `Số ${n} là ${n % 2 === 0 ? 'chẵn' : 'lẻ'}`);`

8. Đảo ngược mảng (không mutate gốc):
`const daoNguoc = [...nums].reverse();`

---

### Câu A4 (5đ) — Object Destructuring & Spread

Dự đoán output và giải thích lỗi spread gotcha.

Dự đoán output:
- console.log(name, price, ram, color) -> iPhone 16 25990000 8 Titan
- console.log(specs) -> Lỗi ReferenceError: specs is not defined (do giải nén sâu specs: { ram, color } nên specs không được tạo biến riêng).
- console.log(updated.price) -> 23990000
- console.log(updated.sale) -> true
- console.log(product.price) -> 25990000 (gốc không đổi).
- console.log(product.specs.ram) -> 16.

Giải thích spread gotcha:
- Toán tử spread chỉ sao chép nông (shallow copy). Nó sao chép tham chiếu của object specs chứ không nhân bản specs thành object mới. Nên khi sửa thuộc tính specs của copy thì specs của product gốc cũng thay đổi theo.

---

## PHẦN C — SUY LUẬN (20 điểm)

### Câu C1 (10đ) — Refactor Code

```javascript
function processOrders(orders) {
    return orders
        .filter(o => o.status === "completed" && o.total > 100000)
        .map(({ id, customer, total }) => {
            const discount = total * 0.1;
            return { id, customer, total, discount, finalTotal: total - discount };
        })
        .sort((a, b) => b.finalTotal - a.finalTotal);
}
```

### Câu C2 (10đ) — Thiết kế API  

```javascript
const miniArray = {
    map(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(fn(arr[i], i, arr));
        }
        return result;
    },
    filter(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    },
    reduce(arr, fn, initialValue) {
        let hasInitial = initialValue !== undefined;
        let acc = hasInitial ? initialValue : arr[0];
        let startIdx = hasInitial ? 0 : 1;
        for (let i = startIdx; i < arr.length; i++) {
            acc = fn(acc, arr[i], i, arr);
        }
        return acc;
    }
};
```
## 🎬 PHẦN D — VIDEO THỰC HÀNH OBS (25 điểm)

https://youtu.be/GWf_xRelVYs
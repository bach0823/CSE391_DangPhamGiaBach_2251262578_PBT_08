// 1. pipe() - Nối chuỗi các hàm
function pipe(...fns) {
    return function(initialValue) {
        return fns.reduce((acc, fn) => fn(acc), initialValue);
    };
}

// 2. memoize() - Cache kết quả của hàm
function memoize(fn) {
    const cache = {};
    return function(...args) {
        const key = JSON.stringify(args);
        if (key in cache) {
            return cache[key];
        }
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

// 3. debounce() - Chờ người dùng ngừng thao tác mới thực hiện
function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 4. retry() - Thử lại hàm async nếu có lỗi
async function retry(fn, maxAttempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.log(`Lần thử ${attempt}/${maxAttempts} thất bại...`);
        }
    }
    throw lastError;
}

// === TEST PIPE ===
console.log("=== TEST PIPE ===");
const processVal = pipe(
    x => x * 2,        // 5 -> 10
    x => x + 10,       // 10 -> 20
    x => x.toString(), // 20 -> "20"
    x => "Kết quả: " + x
);
console.log(processVal(5)); // → "Kết quả: 20"

// === TEST MEMOIZE ===
console.log("\n=== TEST MEMOIZE ===");
const expensiveCalc = memoize((n) => {
    console.log("Đang tính...");
    let result = 0;
    for (let i = 0; i < n; i++) result += i;
    return result;
});
console.log(expensiveCalc(1000000)); // → "Đang tính..." -> 499999500000
console.log(expensiveCalc(1000000)); // → lấy từ cache, không in "Đang tính..."

// === TEST DEBOUNCE ===
console.log("\n=== TEST DEBOUNCE ===");
const search = debounce((query) => {
    console.log("Searching:", query);
}, 500);
search("a");
search("ab");
search("abc"); // Chỉ lần cuối cùng được chạy sau 500ms

// === TEST RETRY ===
setTimeout(() => {
    console.log("\n=== TEST RETRY ===");
    let count = 0;
    const unstableFn = async () => {
        count++;
        if (count < 3) {
            throw new Error("Lỗi kết nối");
        }
        return "Thành công!";
    };

    retry(unstableFn, 3)
        .then(res => console.log("Kết quả retry:", res))
        .catch(err => console.error("Retry thất bại hoàn toàn:", err.message));
}, 1000);

// Helper to find the next prime number
const isPrime = num => {
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return num > 1;
};

const getNextPrime = num => {
    let nextNum = num + 1;
    while (true) {
        if (isPrime(nextNum)) {
            return nextNum;
        }
        nextNum++;
    }
};

export class HashSet {
    constructor(initialCapacity = 7, collisionResolution = 'linear') {
        this.capacity = initialCapacity;
        this.table = new Array(this.capacity).fill(null);
        this.size = 0;
        this.collisionResolution = collisionResolution; // 'linear', 'quadratic', 'chaining'
    }

    _hash(key) {
        const numericKey = parseInt(key, 10);
        if (!isNaN(numericKey)) {
            return numericKey % this.capacity;
        }

        let hash = 0;
        const stringKey = String(key);
        for (let i = 0; i < stringKey.length; i++) {
            hash = (hash * 31 + stringKey.charCodeAt(i)) % this.capacity;
        }
        return hash;
    }

    _getLoadFactor() {
        return this.size / this.capacity;
    }

    async _resize() {
        if (this._getLoadFactor() < 0.5) return;

        const oldTable = this.table;
        const newCapacity = getNextPrime(this.capacity * 2);
        this.capacity = newCapacity;
        this.table = new Array(newCapacity).fill(null);
        this.size = 0;

        for (const item of oldTable) {
            if (this.collisionResolution === 'chaining') {
                if (item) {
                    for (const chainedItem of item) {
                        await this.add(chainedItem.key, chainedItem.value);
                    }
                }
            } else {
                if (item && item.key !== undefined && item.key !== -1) {
                    await this.add(item.key, item.value);
                }
            }
        }
    }

    async add(key, value = true) { // value is a placeholder for Set-like behavior
        await this._resize();
        let index = this._hash(key);
        let i = 1;

        switch (this.collisionResolution) {
            case 'chaining':
                if (!this.table[index]) {
                    this.table[index] = [];
                }
                // Avoid duplicates
                if (!this.table[index].find(item => item.key === key)) {
                    this.table[index].push({ key, value });
                    this.size++;
                }
                break;

            case 'quadratic':
                while (this.table[index] !== null && this.table[index].key !== key && this.table[index].key !== -1) {
                    index = (this._hash(key) + i * i) % this.capacity;
                    i++;
                }
                if (this.table[index] === null || this.table[index].key === -1) {
                    this.table[index] = { key, value };
                    this.size++;
                }
                break;

            case 'linear':
            default:
                while (this.table[index] !== null && this.table[index].key !== key && this.table[index].key !== -1) {
                    index = (index + 1) % this.capacity;
                }
                if (this.table[index] === null || this.table[index].key === -1) {
                    this.table[index] = { key, value };
                    this.size++;
                }
                break;
        }
    }

    get(key) {
        let index = this._hash(key);
        let i = 1;

        switch (this.collisionResolution) {
            case 'chaining':
                if (this.table[index]) {
                    const found = this.table[index].find(item => item.key === key);
                    return found ? found.value : undefined;
                }
                return undefined;

            case 'quadratic':
                while (this.table[index] !== null) {
                    if (this.table[index].key === key) {
                        return this.table[index].value;
                    }
                    index = (this._hash(key) + i * i) % this.capacity;
                    i++;
                }
                return undefined;

            case 'linear':
            default:
                while (this.table[index] !== null) {
                    if (this.table[index].key === key) {
                        return this.table[index].value;
                    }
                    index = (index + 1) % this.capacity;
                }
                return undefined;
        }
    }

    search(key) {
        let index = this._hash(key);
        let i = 1;

        switch (this.collisionResolution) {
            case 'chaining':
                if (this.table[index]) {
                    const found = this.table[index].find(item => item.key === key);
                    return found ? index : -1;
                }
                return -1;

            case 'quadratic':
                while (this.table[index] !== null) {
                    if (this.table[index].key === key) {
                        return index;
                    }
                    index = (this._hash(key) + i * i) % this.capacity;
                    i++;
                }
                return -1;

            case 'linear':
            default:
                while (this.table[index] !== null) {
                    if (this.table[index].key === key) {
                        return index;
                    }
                    index = (index + 1) % this.capacity;
                }
                return -1;
        }
    }

    remove(key) {
        let index = this._hash(key);
        let i = 1;

        switch (this.collisionResolution) {
            case 'chaining':
                if (this.table[index]) {
                    const itemIndex = this.table[index].findIndex(item => item.key === key);
                    if (itemIndex > -1) {
                        this.table[index].splice(itemIndex, 1);
                        this.size--;
                        return true;
                    }
                }
                return false;

            case 'quadratic':
                while (this.table[index] !== null) {
                    if (this.table[index].key === key) {
                        this.table[index].key = -1; // Mark as deleted
                        this.size--;
                        return true;
                    }
                    index = (this._hash(key) + i * i) % this.capacity;
                    i++;
                }
                return false;

            case 'linear':
            default:
                while (this.table[index] !== null) {
                    if (this.table[index].key === key) {
                        this.table[index].key = -1; // Lazy deletion
                        this.size--;
                        return true;
                    }
                    index = (index + 1) % this.capacity;
                }
                return false;
        }
    }
}

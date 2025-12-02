export const RED = 'RED';
export const BLACK = 'BLACK';

class RBNode {
    constructor(value, color = RED, id = null) {
        this.value = value;
        this.color = color;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.id = id || Math.random().toString(36).substr(2, 9);
    }
}

export class RedBlackTree {
    constructor() {
        this.root = null;
        this.snapshots = [];
    }

    clone(node) {
        if (!node) return null;
        const newNode = new RBNode(node.value, node.color, node.id);
        newNode.left = this.clone(node.left);
        if (newNode.left) newNode.left.parent = newNode;
        newNode.right = this.clone(node.right);
        if (newNode.right) newNode.right.parent = newNode;
        return newNode;
    }

    takeSnapshot(message) {
        this.snapshots.push({
            root: this.clone(this.root),
            message: message
        });
    }

    insert(value) {
        this.snapshots = [];

        const newNode = new RBNode(value);
        if (!this.root) {
            this.root = newNode;
            this.root.color = BLACK;
            this.takeSnapshot(`Inserted ${value} as Root (Black)`);
            return this.snapshots;
        }

        this.takeSnapshot(`Inserting ${value} (Red)`);

        let current = this.root;
        let parent = null;

        while (current) {
            parent = current;
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        newNode.parent = parent;
        if (value < parent.value) {
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }

        this.takeSnapshot(`Placed ${value} as child of ${parent.value}`);
        this.fixInsert(newNode);

        // ✅ FIX 1: Final snapshot to ensure the user sees the completed, balanced tree
        this.takeSnapshot('Insertion Complete');
        return this.snapshots;
    }

    fixInsert(node) {
        while (node !== this.root && node.parent.color === RED) {
            let parent = node.parent;
            let grandparent = parent.parent;

            if (parent === grandparent.left) {
                let uncle = grandparent.right;

                if (uncle && uncle.color === RED) {
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandparent.color = RED;
                    this.takeSnapshot(`Recoloring: ${parent.value} & ${uncle.value} Black, ${grandparent.value} Red`);
                    node = grandparent;
                } else {
                    if (node === parent.right) {
                        this.takeSnapshot(`Triangle Case: Rotate Left on ${parent.value}`);
                        node = parent;
                        this.rotateLeft(node);
                        // ✅ FIX 2: Snapshot after rotation
                        this.takeSnapshot(`After Left Rotation`);
                        parent = node.parent;
                        grandparent = parent.parent;
                    }

                    this.takeSnapshot(`Line Case: Rotate Right on ${grandparent.value} and Recolor`);
                    parent.color = BLACK;
                    grandparent.color = RED;
                    this.rotateRight(grandparent);
                    // ✅ FIX 3: Snapshot after rotation
                    this.takeSnapshot(`After Right Rotation`);
                }
            } else {
                let uncle = grandparent.left;

                if (uncle && uncle.color === RED) {
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandparent.color = RED;
                    this.takeSnapshot(`Recoloring: ${parent.value} & ${uncle.value} Black, ${grandparent.value} Red`);
                    node = grandparent;
                } else {
                    if (node === parent.left) {
                        this.takeSnapshot(`Triangle Case: Rotate Right on ${parent.value}`);
                        node = parent;
                        this.rotateRight(node);
                        // ✅ FIX 4: Snapshot after rotation
                        this.takeSnapshot(`After Right Rotation`);
                        parent = node.parent;
                        grandparent = parent.parent;
                    }

                    this.takeSnapshot(`Line Case: Rotate Left on ${grandparent.value} and Recolor`);
                    parent.color = BLACK;
                    grandparent.color = RED;
                    this.rotateLeft(grandparent);
                    // ✅ FIX 5: Snapshot after rotation
                    this.takeSnapshot(`After Left Rotation`);
                }
            }
        }

        if (this.root.color === RED) {
            this.root.color = BLACK;
            // No snapshot needed here usually, but you can add one if you want to be explicit
        }
    }

    rotateLeft(node) {
        let rightChild = node.right;
        node.right = rightChild.left;
        if (rightChild.left) {
            rightChild.left.parent = node;
        }
        rightChild.parent = node.parent;
        if (!node.parent) {
            this.root = rightChild;
        } else if (node === node.parent.left) {
            node.parent.left = rightChild;
        } else {
            node.parent.right = rightChild;
        }
        rightChild.left = node;
        node.parent = rightChild;
    }

    rotateRight(node) {
        let leftChild = node.left;
        node.left = leftChild.right;
        if (leftChild.right) {
            leftChild.right.parent = node;
        }
        leftChild.parent = node.parent;
        if (!node.parent) {
            this.root = leftChild;
        } else if (node === node.parent.right) {
            node.parent.right = leftChild;
        } else {
            node.parent.left = leftChild;
        }
        leftChild.right = node;
        node.parent = leftChild;
    }
}
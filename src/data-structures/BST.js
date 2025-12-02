class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.color = 'red'; // Kept for future RB logic
    }
}

export class BST {
    constructor() {
        this.root = null;
    }

    add(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            this.root.color = 'black';
            return;
        }

        let currentNode = this.root;
        while (true) {
            if (value === currentNode.value) return; // Prevent duplicates
            if (value < currentNode.value) {
                if (!currentNode.left) {
                    currentNode.left = newNode;
                    break;
                }
                currentNode = currentNode.left;
            } else {
                if (!currentNode.right) {
                    currentNode.right = newNode;
                    break;
                }
                currentNode = currentNode.right;
            }
        }
    }

    remove(value) {
        this.root = this._removeNode(this.root, value);
    }

    _removeNode(node, value) {
        if (!node) return null;

        if (value < node.value) {
            node.left = this._removeNode(node.left, value);
            return node;
        } else if (value > node.value) {
            node.right = this._removeNode(node.right, value);
            return node;
        } else {
            // Node found

            // Case 1: Leaf node (no children)
            if (!node.left && !node.right) {
                return null;
            }

            // Case 2: One child
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            // Case 3: Two children
            // Find minimum node in right subtree (Successor)
            let temp = this._findMin(node.right);
            node.value = temp.value; // Copy value
            node.right = this._removeNode(node.right, temp.value); // Delete successor
            return node;
        }
    }

    _findMin(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    findNodeWithParent(value) {
        let currentNode = this.root;
        let parent = null;
        while (currentNode) {
            if (value === currentNode.value) {
                return { node: currentNode, parent: parent };
            }
            parent = currentNode;
            if (value < currentNode.value) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }
        return { node: null, parent: null }; // Not found
    }

    // --- Rotations ---
    rotateLeft(value) {
        const { node, parent } = this.findNodeWithParent(value);
        if (!node || !node.right) return; // Cannot rotate

        const newSubtreeRoot = this._rotateLeftNode(node);

        if (parent === null) {
            this.root = newSubtreeRoot;
        } else if (parent.left === node) {
            parent.left = newSubtreeRoot;
        } else {
            parent.right = newSubtreeRoot;
        }
    }

    rotateRight(value) {
        const { node, parent } = this.findNodeWithParent(value);
        if (!node || !node.left) return; // Cannot rotate

        const newSubtreeRoot = this._rotateRightNode(node);

        if (parent === null) {
            this.root = newSubtreeRoot;
        } else if (parent.left === node) {
            parent.left = newSubtreeRoot;
        } else {
            parent.right = newSubtreeRoot;
        }
    }

    _rotateLeftNode(node) {
        let newParent = node.right;
        node.right = newParent.left;
        newParent.left = node;
        return newParent;
    }

    _rotateRightNode(node) {
        let newParent = node.left;
        node.left = newParent.right;
        newParent.right = node;
        return newParent;
    }

    // --- Balancing ---
    // Instead of "convertToRedBlack" (which implies complex recoloring of an existing tree),
    // we will re-build the tree to be perfectly balanced.
    balance() {
        const nodes = this.inorder(); // Get sorted values
        this.root = this._buildBalancedTree(nodes, 0, nodes.length - 1);
    }

    _buildBalancedTree(nodes, start, end) {
        if (start > end) return null;

        const mid = Math.floor((start + end) / 2);
        const node = new Node(nodes[mid]);
        node.color = 'black'; // Reset colors if we are balancing

        node.left = this._buildBalancedTree(nodes, start, mid - 1);
        node.right = this._buildBalancedTree(nodes, mid + 1, end);

        return node;
    }

    // --- Traversals ---

    preorder() {
        const result = [];
        const traverse = (node) => {
            if (node) {
                result.push(node.value);
                traverse(node.left);
                traverse(node.right);
            }
        };
        traverse(this.root);
        return result;
    }

    inorder() {
        const result = [];
        const traverse = (node) => {
            if (node) {
                traverse(node.left);
                result.push(node.value);
                traverse(node.right);
            }
        };
        traverse(this.root);
        return result;
    }

    postorder() {
        const result = [];
        const traverse = (node) => {
            if (node) {
                traverse(node.left);
                traverse(node.right);
                result.push(node.value);
            }
        };
        traverse(this.root);
        return result;
    }
}

function Node(value, x, y) {
  this.value = value;
  this.x = x;
  this.y = y;
  this.left = null;
  this.right = null;
  this.parent = null;
  this.height = 0;
  this.step = 1;
  this.counter = 0;
  this.leftHeight = function() {
    return this.left?this.left.height:-1;
  }
  this.rightHeight = function() {
    return this.right?this.right.height:-1;
  }
  this.setLeft = function(node) {
    this.left = node;
  }
  this.setRight = function(node) {
    this.right = node;
  }
  this.walk = function(fn) {
    if(this.left)
      this.left.walk(fn);
    fn(this.value);
    if(this.right)
      this.right.walk(fn);
  }
  this.insert = function(newNode, node) {
    if(!node) {
      node = newNode;
    } else if(newNode.value < node.value) {
      newNode.parent = node;
      newNode.x = node.x - (50 + (node.height * 20));
      newNode.y = node.y + 50;
      node.left = node.insert(newNode, node.left);
      if(node.leftHeight() - node.rightHeight() == 2) {
        if(newNode.value < node.left.value) {
          node = node.rotateWithLeftChild(node);
        } else {
          node = node.doubleWithLeftChild(node);
        }
      }
    } else if(newNode.value > node.value) {
      newNode.parent = node;
      newNode.x = node.x + (50 + (node.height * 20));
      newNode.y = node.y + 50;
      node.right = node.insert(newNode, node.right);
      if(node.rightHeight() - node.leftHeight() == 2) {
        if(newNode.value > node.right.value) {
          node = node.rotateWithRightChild(node);
        } else {
          node = node.doubleWithRightChild(node);
        }
      }
    }
    node.height = Math.max(node.leftHeight(), node.rightHeight()) + 1;

    return node;
  };

  this.show = function(x, y) {
    this.x = x;
    this.y = y;
    if(this.left)
      this.left.show(this.x - (50 + (this.height * 20)), this.y + 50);
    if(this.counter >= 60) {
      this.step++;
      this.counter = 0;
    }
    this.render();
    if(this.step < 4) {
      this.counter++;
    }
    if(this.right)
      this.right.show(this.x + (50 + (this.height * 20)), this.y + 50);
  }
  this.search = function(val) {
    if(this.value == val)
      return this;
    if(this.value > val)
      return this.left.search(val);
    if(this.value < val)
      return this.right.search(val);
    return null;
  }
  this.render = function() {
    stroke(255);
    noFill();
    if(this.step >= 1){
      ellipse(this.x, this.y, 25);
      textAlign(CENTER);
      text(this.value, this.x, this.y);
    }
    if(this.step >= 2) {
      if(this.parent) {
        let x = this.x > this.parent.x?-12.5:12.5;
        line(this.x + x,this.y - 12.5,this.parent.x - x, this.parent.y + 12.5);
      }
    }
  }
  this.renderReverse = function() {
    stroke(255);
    noFill();
    if(this.left)
      this.left.renderReverse();
    if(this.parent) {
      let x = this.x > this.parent.x?-12.5:12.5;
      line(this.x + x,this.y - 12.5,this.parent.x - x, this.parent.y + 12.5);
    }
    ellipse(this.x, this.y, 25);
    textAlign(CENTER);
    text(this.value, this.x, this.y);
    if(this.right)
      this.right.renderReverse();
  }
  this.rotateWithLeftChild = function(node) {
    let leftChild = node.left;
    leftChild.parent = node.parent;
    node.left = leftChild.right;
    if(node.left != null)
      node.left.parent = node;
    leftChild.right = node;
    node.parent = leftChild;
    node.height = Math.max(node.leftHeight(), node.rightHeight()) + 1;
    leftChild.height = Math.max(leftChild.leftHeight(), node.height) + 1;
    return leftChild;
    // let leftChild = node.left;
    // //node.left.parent = node.parent;
    // //node.parent = node.left;
    // node.left = leftChild.right;
    // if(node.left)
    //   node.left.parent = node;
    // leftChild.right = node;
    // node.height = Math.max(node.leftHeight(), node.rightHeight()) + 1;
    // leftChild.height = Math.max(leftChild.leftHeight(), node.height) + 1;
    // return leftChild;
  }
  this.rotateWithRightChild = function(node) {
    let rightChild = node.right;
    rightChild.parent = node.parent;
    node.right = rightChild.left;
    if(node.right)
      node.right.parent = node;
    rightChild.left = node;
    node.parent = rightChild;
    node.height = Math.max(node.leftHeight(), node.rightHeight()) + 1;
    rightChild.height = Math.max(rightChild.rightHeight(), node.height) + 1;
    return rightChild;
    //node.right.parent = node.parent;
    //node.parent = node.right;
    // node.right = rightChild.left;
    // if(node.right)
    //   node.right.parent = node;
    // node.parent.left = node;
    // node.height = Math.max(node.leftHeight(), node.rightHeight()) + 1;
    // node.parent.height = Math.max(node.parent.rightHeight(), node.height) + 1;
    // return node.parent;
  }
  this.doubleWithLeftChild = function(node) {
    node.left = node.left.rotateWithRightChild(node.left);
    node.left.parent = node;
    return node.rotateWithLeftChild(node);
  }
  this.doubleWithRightChild = function(node) {
    node.right = node.right.rotateWithLeftChild(node.right);
    node.right.parent = node;
    return node.rotateWithRightChild(node);
  }
}

function BTree() {
  this.root = null;
  this.insert = function(value, node) {
    if(!node) {
      let newNode = new Node(value,width/2,50);
      if(!this.root)
        this.root = newNode;
      else
        this.insert(newNode, this.root);
    } else {
      this.root = this.root.insert(value, this.root);
    }
  };
  this.show = function() {
    if(this.root)
      this.root.show(width/2,50);
  }
  this.print = function() {
    this.root.walk(function(d) { console.log(d);});
  }
  this.search = function(val, callback) {
    let node = this.root.search(val);
    if(callback)
      callback(node);
    return node;
  }
}

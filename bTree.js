class Node {
  constructor(value, x, y) {
    this.value = value;
    this.pos= createVector(200, 50);
    this.vel= createVector();
    this.acc = createVector();
    this.targetPos = createVector(x, y);
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 0;
    this.step = 1;
    this.counter = 0;
    this.state = STATES.MOVE;
    this.maxSpeed = 5;
    this.maxForce = 3;
    this.insertable;
    this.playing = true;
  }
  steer() {
    let desired = p5.Vector.sub(this.targetPos, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if(d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let force = p5.Vector.sub(desired, this.vel);

    force.limit(this.maxForce);
    this.addForce(force);
  }
  addForce(force) {
    this.acc.add(force);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  update() {
    this.walk(function(d){
      if(d.state == STATES.MOVE) {
        d.steer();
        if(dist(d.pos.x,d.pos.y,d.targetPos.x,d.targetPos.y) <= 1) {
          d.playing = false;
          // d.state = STATES.IN_POS;
        //  current_state = STATES.INSERT;
        }
      }
    });
  }
  leftHeight() {
    return this.left?this.left.height:-1;
  }
  rightHeight() {
    return this.right?this.right.height:-1;
  }
  setLeft(node) {
    this.left = node;
  }
  setRight(node) {
    this.right = node;
  }
  walk(fn) {
    if(this.left)
      this.left.walk(fn);
    fn(this);
    if(this.right)
      this.right.walk(fn);
  }
  static insert(newNode, node) {
    if(!node) {
      node = newNode;
    } else if(newNode.value < node.value) {
      newNode.parent = node;
      // newNode.x = node.x - (50 + (node.height * 20));
      // newNode.y = node.y + 50;
      node.left = Node.insert(newNode, node.left);
      if(node.leftHeight() - node.rightHeight() == 2) {
        if(newNode.value < node.left.value) {
          node = Node.rotateWithLeftChild(node);
        } else {
          node = Node.doubleWithLeftChild(node);
        }
      }
    } else if(newNode.value > node.value) {
      newNode.parent = node;
      // newNode.x = node.x + (50 + (node.height * 20));
      // newNode.y = node.y + 50;
      node.right = Node.insert(newNode, node.right);
      if(node.rightHeight() - node.leftHeight() == 2) {
        if(newNode.value > node.right.value) {
          node = Node.rotateWithRightChild(node);
        } else {
          node = Node.doubleWithRightChild(node);

        }
      }
    }
    node.height = Math.max(node.leftHeight(), node.rightHeight()) + 1;
    node.recalcChildCoords();
    return node;
  }
  recalcChildCoords() {
    if(this.left) {
      this.left.targetPos.x = this.targetPos.x - (50 + (this.height * 20));
      this.left.targetPos.y = this.targetPos.y + 50;
      this.left.recalcChildCoords();
    }
    if(this.right) {
      this.right.targetPos.x = this.targetPos.x + (50 + (this.height * 20));
      this.right.targetPos.y = this.targetPos.y + 50;
      this.right.recalcChildCoords();
    }
  }
  show(x, y) {
    this.walk(function(d) {
      d.render();
    });
    // this.x = x;
    // this.y = y;
    // if(this.left)
    //   this.left.show(this.x - (50 + (this.height * 20)), this.y + 50);
    // if(this.counter >= 60) {
    //   this.step++;
    //   this.counter = 0;
    // }
    // this.render();
    // if(this.step < 4) {
    //   this.counter++;
    // }
    // if(this.right)
    //   this.right.show(this.x + (50 + (this.height * 20)), this.y + 50);
  }
  search(val) {
    if(this.value == val)
      return this;
    if(this.value > val)
      return this.left.search(val);
    if(this.value < val)
      return this.right.search(val);
    return null;
  }
  isPlaying() {
    let playing = false;
    if(this.left)
      playing |= this.left.isPlaying();
    playing |= this.playing;
    if(this.right)
      playing |= this.right.isPlaying();
    return playing;
  }
  render() {
    stroke(255);
    noFill();
    // if(this.step >= 1){
      ellipse(this.pos.x, this.pos.y, 25);
      textAlign(CENTER);
      text(this.value, this.pos.x, this.pos.y);
    // }
    // if(this.step >= 2) {
      if(this.parent) {
        let x = this.pos.x > this.parent.pos.x?-12.5:12.5;
        line(this.pos.x + x,this.pos.y - 12.5,this.parent.pos.x - x, this.parent.pos.y + 12.5);
      }
    // }
  }
  renderReverse() {
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
  swapCoords(node) {
    let x = this.targetPos.x;
    let y = this.targetPos.y;
    this.targetPos.x = node.targetPos.x;
    this.targetPos.y = node.targetPos.y;
    node.targetPos.x = x;
    node.targetPos.y = y;
  }
  static rotateWithLeftChild(node) {
    let leftChild = node.left;

    leftChild.parent = node.parent;
    node.left = leftChild.right;
    leftChild.right = node;
    node.parent = leftChild;
    node.height = Math.max(node.leftHeight(), node.rightHeight()) + 1;
    leftChild.height = Math.max(leftChild.leftHeight(), node.height) + 1;
    leftChild.swapCoords(node);
    if(node.left) {
      node.left.parent = node;
      node.left.targetPos.x = node.targetPos.x - (50 + (node.height * 20));
    }
    return leftChild;
  }
  static rotateWithRightChild(node) {
    let rightChild = node.right;

    rightChild.parent = node.parent;
    node.right = rightChild.left;
    rightChild.left = node;
    node.parent = rightChild;
    node.height = Math.max(node.leftHeight(), node.rightHeight()) + 1;
    rightChild.height = Math.max(rightChild.rightHeight(), node.height) + 1;
    rightChild.swapCoords(node);
    if(node.right) {
      node.right.parent = node;
      node.right.targetPos.x = node.targetPos.x + (50 + (node.height * 20));
    }
    return rightChild;
  }
  static doubleWithLeftChild(node) {
    node.left = Node.rotateWithRightChild(node.left);
    node.left.parent = node;
    return Node.rotateWithLeftChild(node);
  }
  static doubleWithRightChild(node) {
    node.right = Node.rotateWithLeftChild(node.right);
    node.right.parent = node;
    return Node.rotateWithRightChild(node);
  }
}

class BTree {
  constructor() {
    this.root = null;
  }
  insert(value) {
    let newNode = new Node(value,width/2,50);
    this.root = Node.insert(newNode, this.root);
  };
  show() {

    if(this.root){
      this.root.update();
      this.root.show();
    }
  }
  print() {
    this.root.walk(function(d) { console.log(d.value);});
  }
  isPlaying() {
    if(this.root)
      return this.root.isPlaying();
    return false;
  }
  search(val, callback) {
    let node = this.root.search(val);
    if(callback)
      callback(node);
    return node;
  }
}

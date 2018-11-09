let bTree = new BTree();
let arr = [];
let i = 0;
let current_state = STATES.INSERT;
function setup() {
  createCanvas(1600,800);
  for(let i = 0; i < 100; i++) {
    arr.push(floor(random(-200, 200)));
  }
  // for(let i = 0; i < arr.length; i++) {
  //   bTree.insert(arr[i]);
  // }

}
function draw() {
  background(0);
  if(!bTree.isPlaying()) {
    // current_state = STATES.INSERT_NODE;
    bTree.insert(arr[i]);
    i++;

  }
  bTree.show();
}

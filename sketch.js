let bTree = new BTree();
let arr = [];
let i = 0;
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
  if(frameCount %20 == 0 && i < arr.length -1) {

    bTree.insert(arr[i]);
    i++;
  }
  bTree.show();
}

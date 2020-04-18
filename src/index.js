import PriorityQueue from "./PriorityQueue";
import Haffman from "./Haffman";

(() => {
  // let que = new PriorityQueue();
  // que.addItem({ priority: 2, data: 10 });
  // que.addItem({ priority: 3, data: 30 });
  // que.addItem({ priority: 1, data: 40 });
  // console.log(que.toArray());
  let haf = new Haffman();
  console.log(haf.compress("Наша маша".split("")));
})();

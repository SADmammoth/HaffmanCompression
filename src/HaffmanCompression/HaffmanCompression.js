import PriorityQueue from "../PriorityQueue";
import HaffmanTreeDiagram from "../HaffmanTreeDiagram/HaffmanTreeDiagram";

let compare = (left, right) => {
  if (left === right) {
    return 0;
  }
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
};

function setCompareFunction(predicate) {
  compare = predicate;
}

function createPriorityQueue(message) {
  let counts = {};
  message.forEach(char => {
    if (!counts[char]) {
      counts[char] = 1;
    } else {
      counts[char]++;
    }
  });

  let priorityQueue = new PriorityQueue();
  Object.entries(counts).forEach(([char, count]) => {
    priorityQueue.addItem({ priority: count, data: char });
  });

  return priorityQueue;
}

function createTree(priorityQueue) {
  let tree = { ...priorityQueue };
  if (!tree.length) {
    return tree;
  }

  let left;
  let right;
  for (let i = 0; i < tree.length; i++) {
    left = { ...[...tree][0] };
    right = { ...[...tree][1] };

    tree.shift();
    tree.shift();
    let newItem = {
      priority: left.priority + right.priority,
      data: {
        left,
        right
      }
    };
    tree.addItem(newItem);
  }
  return tree.toArray()[0].data.left;
}

function depthFirstTreeTraversal(tree, showElement, onLeaf) {
  let root = { ...tree };
  let current = root;
  let result = [];
  let processStack = [root];
  do {
    if (current.data.left && result.indexOf(current.data.left) < 0) {
      processStack.push({ value: 0, current });
      current = current.data.left;
      continue;
    }
    if (current.data.right && result.indexOf(current.data.right) < 0) {
      processStack.push({ value: 1, current });
      current = current.data.right;
      continue;
    }

    result.push(current);
    showElement && showElement(current);
    if (!current.data.left && !current.data.right) {
      onLeaf(processStack.slice(1), current);
    }
    current = processStack.pop().current;
  } while (processStack.length);
  return result;
}

function breadthFirstTreeTraversal(tree, showElement, onNewLevel) {
  let root = { ...tree };
  let current = root;
  let result = [[]];
  let processStack = [root];
  let i = 0;
  while (processStack.length && i < 100) {
    result[i] = [];
    processStack = processStack
      .map(element => {
        showElement && showElement(element);
        result[i].push(element);
        let arr = [];
        if (element.data.left) {
          arr.push(element.data.left);
        }
        if (element.data.right) {
          arr.push(element.data.right);
        }
        return arr;
      })
      .flat();

    i++;
    // if (!current.data.left && !current.data.right && !processStack.length) {
    //   break;
    //   onLeaf(processStack.slice(1), current);
    // }

    // showElement(current);
    // if (
    //   current.data.left &&
    //   (!processStack.length || processStack.length === 1)
    // ) {
    //   processStack.push(current.data.left);
    // }
    // if (
    //   current.data.right &&
    //   (!processStack.length || processStack.length === 1)
    // ) {
    //   processStack.push(current.data.right);
    // }
    // current = processStack.pop();

    // if (!current.data.left && !current.data.right && !processStack.length) {
    //   break;
    //   //   onLeaf(processStack.slice(1), current);
    // }
  }
  return result;
}

function compression(message, alphabet) {
  const compressedMessage = [...message];
  Object.entries(alphabet).forEach(([char, code]) => {
    let index;
    while (true) {
      index = compressedMessage.findIndex(candidate => {
        return !compare(candidate, char);
      });
      if (index < 0) {
        break;
      }
      compressedMessage.splice(index, 1, code);
    }
  });
  return compressedMessage;
}

function createPath(root, leafValue, path) {
  let curr = root;
  for (let i = 0; i < path.length; i++) {
    if (path[i] === "0") {
      if (curr.data && curr.data.left) {
        curr = curr.data.left;
      } else {
        curr.data.left = { priority: "", data: {} };
        curr = curr.data.left;
      }
    }
    if (path[i] === "1") {
      if (curr.data && curr.data.right) {
        curr = curr.data.right;
      } else {
        curr.data.right = { priority: "", data: {} };
        curr = curr.data.right;
      }
    }
    if (i === path.length - 1) {
      curr.data = leafValue;
    }
  }
  return root;
}

function followPath(start, path) {
  let curr = start;
  for (let i = 0; i < path.length; i++) {
    if (typeof curr.data === "string") {
      break;
    }
    if (path[i] === "0") {
      curr = curr.data.left;
    }

    if (path[i] === "1") {
      curr = curr.data.right;
    }
  }
  return curr;
}

export default function HaffmanCompression(compareChars) {
  if (compareChars) setCompareFunction(compareChars);

  let sequences = {};
  let tree = {};

  return {
    compress: message => {
      let tree = createTree(createPriorityQueue(message));
      // console.log(tree);
      let diag = new HaffmanTreeDiagram();
      // console.log(diag);

      depthFirstTreeTraversal(
        tree,
        current => {
          // diag.addVertex(current.priority);
          // console.log(
          //   current.priority,
          //   typeof current.data === 'object' ? '' : current.data
          // );
        },
        (sequence, current) => {
          sequences[current.data] = sequence.map(el => el.value);
        }
      );
      console.log(tree);
      diag.drawTree(
        tree,
        Object.keys(sequences).length,
        breadthFirstTreeTraversal(tree).length
      );
      return {
        alphabet: sequences,
        compressedMessage: compression(message, sequences)
      };
    },
    emptyTree: () => {
      tree = { priority: "", data: {} };
    },
    addToTree: (char, path) => {
      createPath(tree, char, path);
    },
    drawTree: alphabet => {
      let diag = new HaffmanTreeDiagram();
      diag.drawTree(
        tree,
        Object.keys(alphabet).length,
        breadthFirstTreeTraversal(tree).length
      );
    },
    followPath: (path, start = tree) => followPath(start, path)
  };
}

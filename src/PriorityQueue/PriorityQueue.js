function PriorityQueue() {
  let array = [];

  return {
    addItem: ({ priority, data }) => {
      let nextIndex = array.findIndex(el => {
        return el.priority > priority;
      });

      if (nextIndex < 0) {
        array.push({ priority, data });
        return;
      }
      let arrayCopy = array.splice(0, nextIndex);
      if (arrayCopy.length) {
      }
      arrayCopy.push({ priority, data }, ...array);
      array = arrayCopy;
    },

    getItemsByPriority: priority => {
      return array.filter(el => {
        return el.priority === priority;
      });
    },

    toArray: () => {
      return array;
    },
    *[Symbol.iterator]() {
      for (let index in array) {
        yield array[index];
      }
    },
    get length() {
      return array.length;
    },
    shift: () => {
      return array.shift();
    }
  };
}

export default PriorityQueue;

// function PiorityQueue() {
//   let head = null;

//   return {
//     addItem: (priority, data) => {
//         if(!head){
//             head =
//         }
//     }
//   };
// }

// function PriorityQueueItem(priority, data, nextItem) {
//   return { priority, data, nextItem };
// }

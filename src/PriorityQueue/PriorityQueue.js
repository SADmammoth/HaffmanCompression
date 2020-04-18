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

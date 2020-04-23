let treeData = [];

let i = 0;

let line = d3.svg
  .line()
  .x(function(point) {
    return point.lx;
  })
  .y(function(point) {
    return point.ly;
  });

function update(source, alphabetLength, levelsCount, containerId) {
  const canvasWidth = alphabetLength * 25 + 500;
  const canvasHeight = levelsCount * 20 + 500;
  //Set new height ratio on new renders

  let tree = d3.layout.tree().size([canvasWidth, canvasHeight]);

  let svg = d3
    .select("#" + containerId)
    .append("svg")
    .attr("width", canvasWidth + 250)
    .attr("height", canvasHeight + 500)
    .append("g")
    .attr("transform", "translate(" + 20 + "," + 40 + ")");
  let nodes = tree.nodes(source).reverse(),
    links = tree.links(nodes);

  nodes.forEach(function(d) {
    if (d !== "null") {
      d.y = d.depth * 50;
      d.x = d.x * 1.1;
    }
  });

  let node = svg.selectAll("g.node").data(nodes, function(d) {
    if (d !== "null") {
      return d.id || (d.id = ++i);
    }
  });

  let nodeEnter = node
    .enter()
    .append("g")
    .attr("class", function(d) {
      if (d === "null") {
        return "hidden";
      }
      return "node";
    })
    .attr("transform", function(d) {
      if (d !== "null") {
        return "translate(" + d.x + "," + d.y + ")";
      }
    });

  nodeEnter
    .append("circle")
    .attr("r", 20)
    .style("fill", "#fff");

  nodeEnter
    .append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d.label;
    })
    .style("fill-opacity", 1);

  let link = svg.selectAll("path.link").data(links, function(d) {
    return d.target.id;
  });

  function lineData(d) {
    let points = [
      { lx: d.source.x, ly: d.source.y },
      { lx: d.target.x, ly: d.target.y }
    ];
    return line(points);
  }

  link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", lineData)
    .attr("shape-rendering", "auto");
  link.exit().remove();
  let linkLabelContainer = svg.selectAll(".linkLabel").data(links);
  let linkCont = linkLabelContainer
    .enter()
    .append("g")
    .attr("class", function(d) {
      if (!d.target.children || !d.target.children.length) {
        return "hidden";
      }
    });
  linkCont
    .append("circle")
    .attr("r", 10)
    .attr("class", "linkLabel");
  linkCont
    .append("text")
    .attr("class", "linkText")
    .attr("dy", 5)
    .text(function(d) {
      if (d.source.children[0].id === d.target.id) {
        return "0";
      }
      return "1";
    });
  linkLabelContainer.exit().remove();
  linkLabelContainer.attr("transform", function(d) {
    if (d !== "null") {
      return (
        "translate(" +
        [(d.source.x + d.target.x) / 2, (d.source.y + d.target.y) / 2] +
        ")"
      );
    }
  });
}

export default function HaffmanTreeDiagram() {
  return {
    drawTree(root, alphabetLength, levelsCount, containerId) {
      treeData.push({ label: root.priority });
      let curr = root;
      let currentNode = treeData[0];
      let processStack = [root];
      let currentNodes = [treeData[0]];
      while (processStack.length) {
        processStack = processStack.map(el => {
          if (el && el.data) {
            return [el.data.left, el.data.right];
          }
          return [null, null];
        });
        currentNodes = currentNodes
          .map((el, i) => {
            if (!processStack[i] || !processStack[i].filter(el => el).length) {
              return ["null", "null"];
            }
            if (el) {
              el.children = processStack[i].map(el => {
                if (el) {
                  if (!el.data.left && !el.data.right) {
                    return {
                      label: el.priority,
                      children: [{ label: '"' + el.data + '"' }]
                    };
                  }
                  return {
                    label: el.priority
                  };
                }
                return "null";
              });
              return el.children;
            }
            return ["null", "null"];
          })
          .flat();
        if (!currentNodes.filter(el => el !== "null").length) {
          break;
        }
        processStack = processStack.flat();
      }
      update(treeData[0], alphabetLength, levelsCount, containerId);
    }
  };
}

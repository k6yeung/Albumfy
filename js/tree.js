var currentArtist = treeData[14]['name'];

// Press enter to search
$("#searchBox").keyup(function(event) {
    if (event.keyCode == 13) {
        changeArtist($("#input").val());
    }
});

// msic var
var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
}
var width = 960 - margin.right - margin.left;
var height = 700 - margin.top - margin.bottom;

var i = 0;
var duration = 750;
var root;

// Construct a tree object
var tree = d3.layout.tree()
    .size([height, width]);

// Construct a diagonal object
var diagonal = d3.svg.diagonal()
    .projection(function(d) {
        return [d.y, d.x];
    });

// Zoom Listener
var zoomListener = d3.behavior.zoom().translate([width / 2, height / 2]).scaleExtent([0.5, 1.2]).on("zoom", function() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
});

var svg = d3.select("body").append("svg")
    .style("border", "1px solid black")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .call(zoomListener)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Default root is Drake
root = treeData[14];
root.x0 = height / 2;
root.y0 = 0;

update(root);

// Collapse all node
collapseAll();

function update(source) {
    // Compute new width
    var levelWidth = [1];
    var childCount = function(level, n) {
        if (n.children && n.children.length > 0) {
            if (levelWidth.length <= level + 1) levelWidth.push(0);
            levelWidth[level + 1] += n.children.length;
            n.children.forEach(function(d) {
                childCount(level + 1, d);
            });
        }
    };
    childCount(0, root);
    var newHeight = d3.max(levelWidth) * 30;
    tree = tree.size([newHeight, width]);

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
        d.y = d.depth * 230;
    });

    // Update the nodes
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            var x = source.x0 == undefined ? 0 : source.x0;
            var y = source.y0 == undefined ? 0 : source.y0;
            return "translate(" + y + "," + x + ")";
        }).attr("song", function(d){
            return d.href !== undefined;
        }).attr("title", function(d){
            if (d.href !== undefined){
                return '<div><img src="'+d.parent.image+'" style="width:180px;height:180px;"></div> <div><strong>'+d.parent.name+'</strong></div> <div>'+d.name+'</div>';
            }
        }).on("click", click);

    nodeEnter.append("circle")
        .attr("r", 1e-6).attr("song", function(d){
            return d.href !== undefined;
        })
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })

    nodeEnter.append("text")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
            return d.name;
        })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) {
            return d.target.id;
        });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {
                x: isNaN(source.x0) ? 0 : source.x0,
                y: isNaN(source.y0) ? 0 : source.y0
            };
            return diagonal({
                source: o,
                target: o
            });
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {
                x: source.x,
                y: source.y
            };
            return diagonal({
                source: o,
                target: o
            });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    centerNode(source)
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else if (!d.children) {
        d.children = d._children;
        d._children = null;
    }
    update(d);
    // Get to song link
    if (d.href !== undefined) {
        window.open(d.href, "_blank");
    }
    if (d.image !== undefined) {
        console.log(d.image);
    }
}

function expand(d) {
    var children = (d.children) ? d.children : d._children;
    if (d._children) {
        d.children = d._children;
        d._children = null;
    }
    if (children)
        children.forEach(expand);
}

function collapse(d) {
    var children = (d._children) ? d._children : d.children;
    if (d.children) {
        d._children = d.children;
        d.children = null;
    }
    if (children)
        children.forEach(collapse);
}

function expandAll() {
    expand(root);
    update(root);
}

function collapseAll() {
    if (root.children != undefined) {
        root.children.forEach(collapse);
        collapse(root);
        update(root);
    }
}

function centerNode(source) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + width / 2;
    y = y * scale + height / 2;
    d3.select("g").transition()
        .duration(duration)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
}

function changeArtist(artistName) {
    if (artistName != currentArtist) {
        currentArtist = artistName;
        root = treeData[lookup[artistName]];
        update(root);
        collapseAll();
    }
}
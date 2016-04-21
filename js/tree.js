var treeData = [{
    "name": "Drake",
    "parent": "null",
    "children": [{
        "name": "2011",
        "parent": "Drake",
        "children": [{
            "name": "Take Care",
            "parent": "2011",
            "children":[{
                "name": "Over My Dead Body",
                "parent": "Take Care",
                "href": "https://www.youtube.com/watch?v=kAMDVkK9nUE"
            }, {
                "name": "Shot for Me",
                "parent": "Take Care"
            }, {
                "name": "Headlines",
                "parent": "Take Care"
            }, {
                "name": "Crew Love",
                "parent": "Take Care"
            }, {
                "name": "Marvins Room",
                "parent": "Take Care"
            }, {
                "name": "Buried Alive Interlude",
                "parent": "Take Care"
            }, {
                "name": "Under Ground Kings",
                "parent": "Take Care"
            }, {
                "name": "We'll Be Fine",
                "parent": "Take Care"
            }, {
                "name": "Make Me Proud",
                "parent": "Take Care"
            }, {
                "name": "Lord Knows",
                "parent": "Take Care"
            }, {
                "name": "Cameras / Good Ones Go Interlude",
                "parent": "Take Care"
            }, {
                "name": "Doing It Wrong",
                "parent": "Take Care"
            }, {
                "name": "The Real Her",
                "parent": "Take Care"
            }, {
                "name": "Look What You’ve Done",
                "parent": "Take Care"
            }, {
                "name": "HYFR (Hell Ya Fucking Right)",
                "parent": "Take Care"
            }, {
                "name": "Practice",
                "parent": "Take Care"
            }, {
                "name": "The Ride",
                "parent": "Take Care"
            }]
        }]
    }, {
        "name": "2013",
        "parent": "Drake",
        "children": [{
            "name": "Nothing Was the Same",
            "parent": "2013",
            "children":[{
                "name": "Over My Dead Body",
                "parent": "Nothing Was the Same"
            }, {
                "name": "Furthest Thing",
                "parent": "Nothing Was the Same"
            }, {
                "name": "Started from the Bottom",
                "parent": "Nothing Was the Same"
            }, {
                "name": "Wu-Tang Forever",
                "parent": "Nothing Was the Same"
            }, {
                "name": "Own It",
                "parent": "Nothing Was the Same"
            }, {
                "name": "Worst Behavior",
                "parent": "Nothing Was the Same"
            }, {
                "name": "From Time",
                "parent": "Nothing Was the Same"
            }, {
                "name": "Hold On, We're Going Home",
                "parent": "Nothing Was the Same"
            }, {
                "name":	"Connect",
                "parent": "Nothing Was the Same"
            }, {
                "name": "The Language",
                "parent": "Nothing Was the Same"
            }, {
                "name": "305 to My City",
                "parent": "Nothing Was the Same"
            }, {
                "name": "Too Much",
                "parent": "Nothing Was the Same"
            }, {
                "name": "Pound Cake / Paris Morton Music 2",
                "parent": "Nothing Was the Same"
            }]
        }]
    }]
}];

var margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
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

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
root.x0 = height / 2;
root.y0 = 0;

update(root);

// Collapse all node
collapseAll();
d3.select(self.frameElement).style("height", "500px");

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
        d.y = d.depth * 180;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", click)
        .append("a")
        .attr("xlink:href", function(d) { return d.href; });

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

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
                x: source.x0,
                y: source.y0
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
}

function expand(d) {   
    var children = (d.children) ? d.children : d._children;
    if (d._children) {        
        d.children = d._children;
        d._children = null;       
    }
    if(children)
      children.forEach(expand);
}

function collapse(d) {
    var children = (d._children) ? d._children : d.children;
    if (d.children) {        
        d._children = d.children;
        d.children = null;       
    }
    if(children)
      children.forEach(collapse);
}

function expandAll(){
    expand(root); 
    update(root);
}

function collapseAll(){
    root.children.forEach(collapse);
    collapse(root);
    update(root);
}
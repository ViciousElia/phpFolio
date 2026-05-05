---
name: Graph Optimiser
description: A tool for optimising graphs under constraints of separation and connectedness. Code by Terra Macdonald.
summary: A tool for optimising graphs under constraints of separation and connectedness.
img: "/content/code/images/26Random.png"
icon: "/content/code/images/26RandomSmol.png"
supporting_scripts: ['/content/code/scripts/graphy.js','/content/code/scripts/graphy_late_load.js']
all_in_one: ""
---
## Graph Optimiser

This tool is designed to attempt to optimise a graph (like graph theory) with the aims of separating disconnected vertices as far as possible, bringing connected vertices within a limited distance, centre the graph with respect to weight, and compact the graph as much as possible under these constraints.

<div class="tool-intro">

### How to use this tool

*   Select a graph size. This is the number of vertices.
*   Add any edges, separated by commas, in the form v1-v2. Alternatively, turn on the table and select the edges directly.
*   Click the Update button to ensure the graph is showing the correct starting conditions.
*   Click the ANIMATE button and watch what happens.
*   The results can be saved as an image (right-click, save image as) if you want to use it later!
*   **NOTE:** This tool is not perfect. If you notice any stuck vertices (you'll know em when you see em), simply click and drag them out and the system will keep moving.
*   **NOTE:** This version of the tool only allows for a max of 33 vertices by default. This is because the table takes up entirely too much room if more vertices are included. Feel free to modify it in page source or download the tool and adjust it to your whim!
*   **Warning:** Using a random graph with more than 25 vertices will almost certainly result in chaotic behaviour, and as such it is advised against.
</div>

<div class="canvas" style="background-color:#000;width:80%;max-width:800px;margin:0 auto">
    <canvas id="graphCanvas" width="1000" height="1000" style="width:100%">It would appear you have JS disabled ... or maybe your browser doesn't support Canvas</canvas>
</div>

<div class="tool-controls">

### Controls

Vertex Count: <input type="number" min="2" max="33" value="4" id="graphSize">  
Edge String: <input type="text" value="1-2,1-3,1-4,3-4" id="graphString">  
<input type="button" value="Update!" id="graphButton" onClick="buildGraph();drawGraph()">
<input type="button" value="ANIMATE!" id="graphAnimate" onClick="animateGraph()">
<input type="button" value="STOP!" id="graphStop" onClick="animateGraph(false)">

### Quick Graphs

<input type="button" value="Empty" id="emptyButton" onClick="specialGraph('empty')">  
<input type="button" value="Path" id="pathButton" onClick="specialGraph('path')">  
<input type="button" value="Tree" id="treeButton" onClick="specialGraph('tree')">  
<input type="button" value="Cycle" id="cycleButton" onClick="specialGraph('cycle')">  
<input type="button" value="Square Decomp" id="squareButton" onClick="specialGraph('square')">  
<input type="button" value="Complete" id="completeButton" onClick="specialGraph('complete')">  
<input type="button" value="Binary Tree" id="binaryButton" onClick="specialGraph('binary')">  
<input type="button" value="Random" id="randomButton" onClick="specialGraph('random')">
 
</div>

---

### Discussion

#### How it works!

This tool works by applying three basic types of force to each vertex in the graph with respect to each other and their environment. Those forces are

*   Gravitational force toward the centre of the environment. Unlike standard gravitational force, this is proportional to the distance a vertex is from the centre. This causes the force to become stronger and draw in vertices that are closer to the boundaries of the canvas.
*   Hooke-like force along edges. This force attracts connected vertices when they are distant, but repels them when they are near. The rest distance is 160 units (pixels in a full-size canvas).
*   Coulomb-like force between disconnected vertices. This force treats disconnected vertices as though they are like-charged particles, causing them to repel each other as they draw closer to each other.

In addition to these forces, the vertices are confined to the canvas space, which by default is 1000 pixels wide (scaled down to 800 or 80% of the viewport, whichever is smaller). This guarantees that the graph will stay on screen. If the canvas is made larger, the results will largely be the same, but there is a lower bound at which they will become erratic.

Once all forces and constraints are applied, the position and velocity of the vertices are updated according to standard kinematics, assuming that acceleration is constant over a single frame.

#### What's it good for?

In two dimensions, the applications of this tool are limited to identifying lowest energy states of graphs, which is a fairly limited application. **But.** For planar graphs (except those containing a subgraph on 4 vertices that is complete), it will normally settle into the planar arrangement of the graph. If there are stuck points, you can always nudge them a bit to fix them.

A 3D analog of this tool (which I have implemented previously, but may or may not be live as you are reading this) is excellent for identifying optimal packings for structures analogous to protein chains. If I can figure out how to implement 3D graphics, I'll link the tool here: [Graph Optimiser 3D](/code/graphy3D/).

Of course, if you only want a tool because it's useful, then you're in the wrong dang place. I make things I think are nifty, and I consider the usefulness afterward. The coolest things I've ever made fit this description. So I'll keep doing exactly that.
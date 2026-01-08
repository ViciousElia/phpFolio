---
name: Graph Optimiser 3D
description: A tool for optimising graphs in 3D under constraints of separation and connectedness while under gravitation. Code by Terra Hyde.
summary: A tool for optimising graphs in 3D under constraints of separation and connectedness while under gravitation.
img: "/content/code/images/75Tree.png"
icon: "/content/code/images/75TreeSmol.png"
supporting_scripts: ['/content/code/scripts/graphy3D.js','/content/code/scripts/graphy3D_late_load.js']
all_in_one: ""
---
## Graph Optimiser 3D

This tool is designed to attempt to optimise a graph (like graph theory) in a 3D space with the aims of separating disconnected vertices as far as possible, bringing connected vertices within a limited distance, centre the graph with respect to weight, and compact the graph as much as possible under these constraints.

---

<div class="tool-intro">

### How to use this tool

*   Select a graph size. This is the number of vertices.
*   Add any edges, separated by commas, in the form v1-v2. Alternatively, turn on the table and select the edges directly.
*   Click the Update button to ensure the graph is showing the correct starting conditions.
*   Click the ANIMATE button and watch what happens.
*   The results can be saved as an image (right-click, save image as) if you want to use it later!
*   **NOTE:** This tool is not perfect. If you notice any stuck vertices (you'll know em when you see em), simply click and drag them out and the system will keep moving.
*   **NOTE:** This version of the tool only allows for a max of 75 vertices by default. This is because the table takes up entirely too much room if more vertices are included. Feel free to modify it in page source or download the tool and adjust it to your whim!

</div>
<div class="canvas" style="background-color:#000;width:80%;max-width:800px;margin:0 auto">
	<input type="button" value="<<" style="z-index:4;float:left;font-size:2em" onclick="rotateField(false,6)">
	<input type="button" value=">>" style="z-index:4;float:right;font-size:2em" onclick="rotateField(true,6)">
	<canvas id="graphCanvas" width="1000" height="1000" style="width:100%">It would appear you have JS disabled ... or maybe your browser doesn't support Canvas</canvas>
</div>
<div id="keyGroup" style="width:95%;max-width:950px;margin:10px auto;font-size:2em;color:white"></div>
<div class="tool-controls">

### Controls

Vertex Count: <input type="number" min="2" max="75" value="14" id="graphSize" onChange="">  
Edge String: <input type="text" value="1-2,2-3,3-4,4-5,5-6,6-7,7-8,8-9,10-11,11-12,12-13,13-14" id="graphString">  
<input type="button" value="Rotate!" id="rotateButton" onClick="toggleRotate()">
<input type="button" value="Update!" id="graphButton" onClick="init();clearFrame();drawGraph();edgeTable()">
<input type="button" value="ANIMATE!" id="graphAnimate" onClick="animateGraph()">
<input type="button" value="STOP!" id="graphStop" onClick="animateGraph(false)">

### Quick Graphs

<input type="button" value="Empty" id="emptyButton" onClick="specialGraph('empty')">  
<input type="button" value="Path" id="pathButton" onClick="specialGraph('path')">  
<input type="button" value="Cycle" id="cycleButton" onClick="specialGraph('cycle')">  
<input type="button" value="Tree" id="treeButton" onClick="specialGraph('tree')">  
<input type="button" value="Binary Tree" id="binaryButton" onClick="specialGraph('binary')">  
<input type="button" value="Square Decomp" id="squareButton" onClick="specialGraph('square')">  
<input type="button" value="Cube Decomp" id="cubeButton" onClick="specialGraph('cube')">  
<input type="button" value="Random" id="randomButton" onClick="specialGraph('random')">  
<input type="button" value="Complete" id="completeButton" onClick="specialGraph('complete')">
  
</div>

### Discussion

#### How it works!

This tool works very similarly to the 2D tool of the same sort. You can read about that here: [Graph Optimiser 2D](/code/graphy#discussion). If you're not interested in going to that tool, feel free to keep reading.

The specific mechanism of this tool works by applying three basic types of force to each vertex in the graph with respect to each other and their environment. Those forces are

*   Gravitational force toward the centre of the environment. Much like the 2D version of this tool, this force is proportional to distance from the centre rather than inversely proportional. The impact of this is that the gravitation much more quickly balances with the repulsion mentioned below. But it also prevents a singularity from forming in the centre of the space, which is essential in 3D.
*   Hooke-like force along edges. This force attracts connected vertices when they are distant, but repels them when they are near. Unlike the 2D version, this tool uses a different rest distance based on the number of edges incident with a given vertex. The impact of this is that when a vertex is highly connected, it gets more room within the space. The range of rest distances is between 1 and 4 times the minimum, which is dependent on the total size of the graph. More total vertices is consistent with smaller rest distances for lowly connected vertices.
*   Coulomb-like force between disconnected vertices. Similar to the 2D version of the tool, this force is much stronger than the gravitational and Hooke-like forces; however, in 3D it's necessary to weaken this force for reasons discussed below.

Once forces are applied, these constraints are enforced on every vertex.

*   Vertices are forced to have a depth (z-component) between 0 and the canvas width. This depth is enforced to assure that the perspective used keeps the vertices on canvas.
*   Vertices are held inside a subspace of the space in which they exist. The subspace is 100 units smaller horizontally and vertically (x- and y-components, respectively) than the canvas, which itself is 1000px by default but scaled down to 800px or 80% of the viewport width, whichever is smaller.

Once all forces and constraints are applied, the position and velocity of the vertices are updated according to standard kinematics, assuming that acceleration is constant over a single frame.

#### Display Tricks for 3D on a 2D Canvas

The display step here is managed by using two tricks. The first one is size-in-perspective, and the second is an artistic trick taught by Leonardo Da Vinci, which I'll take to calling the mist effect.

Size-in-perspective is pretty straightforward. We experience it every single day. The further something is from us, the smaller it appears to be. This is because they take up less of our field of view, due to an increased "back width". It's a bit more complicated than that to try to explain in full detail, but the actual application is simple enough. Far away? Scale down. Close up? Scale up. Cake. But this size-in-perspective is also managed in the positions of the points with two points close up being much farther away from each other than two points farther away but separated by the same amount.

The mist effect is one of two ideas that Leonardo Da Vinci shared so far as distance is portrayed in art. The second is the bluing effect, which I'll hit next even though it's necessary here. But the short version of the mist effect is that as something gets farther away, it becomes more and more desaturated. This has to do with the amount light spreads out the further you get from an object. It's implemented here by way of increasing transparency for points that are further away.

The bluing effect is summed up pretty simply as well: the further something is from the viewer, the bluer it becomes. More accurately, the colour we'd want to use is a colour close to [#0080ff](https://www.colorhexa.com/0080ff). By moving our colours closer to this shade, we imply distance because our eyes see the sky as being similar to this colour, and great enough distance will inevitably start seeing bleed-through of that sky colour.

Fun fact about me. I learned about the mist effect and the bluing effect from a computer literacy class when I was 13 years old. It's irrelevant to this conversation, but this anecdote AND this tool are reasons why it's important to have art included in science education.

#### Why's it weird?

It's not.

. . .

Okay. But sincerely. The weirdness we see in 3D comes from a couple of places. One of those places is the fact that a 3D space has a lot more "space" than a 2D space.<sup>\[citation needed\]</sup> Essentially, by adding the third dimension, we increase the number of points available by an exponent of 3/2. Of course that's only true in a discrete space, but that's irrelevant, since it's still true from [a certain perspective](https://en.wikipedia.org/wiki/Fractal_dimension).

So as we move into three dimensions, there's even more opportunity to push vertices into the empty space that exists. A very simple example of this is the difference between packing discs in a plane and packing spheres in a cube. A more mathematical example of this is the move from 3D to 4D in knot theory. Fun fact about that: because of how much more room exists in 4D, all standard knots in 3D are trivial in 4D.

So there's more opportunity then for vertices to sneak into spaces they couldn't have in 2D, allowing much smaller radii for 3D complete graphs than for 2D complete graphs. This phenomenon is also part of why the 3D tool uses a Hooke-like force that's relative to the number of connections of a vertex.

The second place we see weirdness originating here has to do with the way forces work in 3D. The short version (I might go into the long version at some point) is that 3D forces are weaker on average than 2D forces of the same "field strength". This has to do with the fact that distance according to the Euclidean metric is weird by its nature. If you want to know more about that, I'll have a demo up ... eventually.

#### What's it good for?

A tool such as this can be used to approximate the optimal packing of protein chains. To use it in that manner, it is strictly necessary to adjust several parameters. For example, vertices would need a size included (functionality is available built in and simply requires for accounting for it in some way \[possibly by adding a new field for vertex weight\]) to account for functional groups or atoms or other structures common to proteins. In addition, edges would need to be modified for strength of connection (increase Hooke force) and set with custom rest lengths. Several other details would need consideration, but the point is that it's possible.

A strictly mathematical application, which is the sort of thing I had in mind when I conceptualised the tool in 3D, is that it allows for identifying low-energy states as a starting point for research into such things so far as connectivity networks are concerned. In addition, several non-mathematical structures can be modelled by graphs and understood more completely using a tool such as this.

And as before. I don't build things because they're useful inherently. I build them because I think it will be interesting. Or educational. Or a challenge. Or all of the above. And I hope you can do the same with your own endeavours.

---
name: Cave Generator
description: A tool for generating a randomised cave using the Togetherness algorithm. Code by Terra Macdonald.
img: "/content/code/images/1337Cave.png"
icon: "/content/code/images/1337CaveSmall.png"
supporting_scripts: ['/content/code/scripts/together.js','/content/code/scripts/cavey_late_load.js']
all_in_one: ""
---

## Cave Generator

In this page, you can set specific start parameters, and get a procedurally generated cave map using the togetherness algorithm.

<div class="tool-intro">

### How to use this tool

*   Select a wall density. This determines how many pixels are counted as walls in the finished product.
*   Select a cell size. This determines both the grid scale and the number of pixels in the image.
*   Select a number of passes. This determines how many times the algorithm will attempt to swap pixels around per pixel.
*   Select a swap distance. This determines how far out a pixel can be swapped from its current position.
*   Select a seed value. This determines the map almost completely. The other parameters can have extreme effects on the outcome.
*   Click the button to generate a map! This can be saved (right-click, save image as) if you want to use it later. The time it takes will depend on your browser and your computer. In testing, we saw about 5 seconds on average without smoothing and 10 seconds with.
*   **NOTE:** The option to use or not use a grid is for the purposes of seeing the sectioning of the result. The ability to change this position allows you to find the optimal grid layout for your needs. If you want to download the map, you must turn off the grid to do so.
*   **NOTE:** By default, this generator allows for an exit (south edge) to the cave, but it is not required by the algorithm. In addition, there is no guarantee of connectedness.
*   **WARNING!** If you are on mobile and use the max settings, it may brick your browser window. Set to 500 passes, 50 cell size MAX. **WARNING!**

</div>
<div class="scaleCanvas" style="width: 80%;max-width: 800px;margin: 10px auto;display:grid">
	<canvas height="321" id="imageCanvas" style="padding: 20px;border: 1px solid #808080;width:100%;margin:0 -20px;z-index:1;grid-area:1/1" width="321">Your browser does not support the canvas tag.</canvas>
	<canvas height="321" id="gridCanvas" style="padding: 20px;border: 1px solid #808080;width:100%;margin:0 -20px;z-index:2;grid-area:1/1" width="321">Your browser does not support the canvas tag.</canvas>
</div>
<input onclick="comeTogether()" type="button" value="Generate!" />
<div class="tool-controls">

### Controls

Wall Density (Out of 100): <input default="40" id="multNum" max="100" min="1" step="1" type="number" value="40" />  
Cell Size: <input default="10" id="sizeNum" max="100" min="10" step="1" type="number" value="10" onchange="newCanv()" />

Number of Passes: <input default="200" id="passNum" min="0" max="1000" step="1" type="number" value="200" />  
Swap Distance: <input default="40" id="distNum" min="0" max="100" step="1" type="number" value="40" />

Display Grid? <input id="showGrid" type="checkbox" onChange="dispGrid()" />

Grid X Position: <input default="0" id="xgridPos" min="0" max="50" onChange="syncVals('xgridPos','xgridSlide');transGrid()" step="1" type="number" value="0" />  
<input default="0" id="xgridSlide" min="0" max="50" onChange="syncVals('xgridSlide','xgridPos');transGrid()" step="1" type="range" value="0" />

Grid Y Position: <input default="0" id="ygridPos" min="0" max="50" onChange="syncVals('ygridPos','ygridSlide');transGrid()" step="1" type="number" value="0" />  
<input default="0" id="ygridSlide" min="0" max="50" onChange="syncVals('ygridSlide','ygridPos');transGrid()" step="1" type="range" value="0" />

Seed Value: <input default="1337" id="seedNum" max="4294967295" min="0" step="1" type="number" value="1337" />  
<input type="button" onclick="newSeed()" value="Randomise Seed!" />

</div>

init();newSeed();dispGrid()


### Discussion

#### What is it?

This tool is a procedural content generator using a version of the algorithm called "togetherness". It takes a pseudo-randomly<sup>[\[1\]](#note-1)</sup> generated collection of cells and allows them to move pseudo-randomly within a restricted field in ways that allow them to clump together into a particular general form. By "general form" I mean that the specific shape is somewhat unpredictable<sup>[\[2\]](#note-2)</sup> at the outset. The general form in question is that of a series of amorphous curved structures resembling tunnels, caves, or similar features.

Depending on the starting density of the cells and the distance they are allowed to move, they will over time work their way into a stable or pseudo-stable configuration that either does not change or changes very little. The long-term stability of the system is demonstrable via some very basic rules, but I'll save that for later. For now, let's talk about ...

#### What is it NOT?

As with all of my PCGs (procedural content generators), I have to make clear the difference between PCG and GML<sup>[\[3\]](#note-3)</sup> (generative machine learning). While both generate content by applying some algorithm to some starting data, one of them allows the user to see and understand the algorithm so that they might implement it or improve upon it. PCG is equal parts content generation and learning opportunity, while GML is explicitly abstraction and prevents learning while generating content.

In addition to the missing learning oppotunities, GML produces actually unpredictable results in the form of never returning the same result, regardless of initial settings. If I go to a GML tool and type "write an essay about the famed philosopher [Fievel Mousekewitz](https://en.wikipedia.org/wiki/An_American_Tail)", it will spit out an essay about Fievel as though he's a real person, which itself isn't a problem. But if I do that multiple times repeatedly using the same exact "prompt", the result will be different every single time. And there is almost no way to prevent that behaviour.

Meanwhile, I _can_ make a PCG behave that way, but it's not a prerequisite of the system. I surface every aspect of the process so that the results are repeatable without any effort.

#### Why is Repeatable Good?

Repeatability is important for a lot of reasons, but I'll list three here that are hopefully very clean examples of the issue.

*   **Troubleshooting**
    
    If you cannot repeat results, there is no way to track the errors that are happening, identify those errors, and patch them out. The most you can do is scrub the processes that would generate them, and that will never be full proof.
    
*   **Consistency**
    
    If you cannot repeat results, then you can not track for consistency of behaviour in any way. To be more explicit, I can test (if I have the time<sup>[\[4\]](#note-4)</sup>) all 4,294,967,295 possible seeds with all 929,219,291 possible other parameters and identify the various ways the system works or does not work and verify that it lines up with what I believe to be the goal of the system. Without repeatability, there's no way to do that.
    
*   **Accuracy**
    
    Anyone with enough exposure to the results put out by GML tools will know that they do one thing really well, and it's the only thing they do well. The thing they do well is make mistakes. Hands, faces, words, backgrounds, and fine details are all things that will likely always fail when using GML to create images. Facts and details about the real world will not only be made up, but will also often be harmful when GML tools write them. There is no way to assure accuracy inside a system that has no capacity for repeatability.
    

Okay. Maybe that's not good enough. Maybe you don't care about those three things. Oh well. You would rather have those tools than to not have them. Good on you, I guess.

But if any of those things matter to you, then you kind of have to reject GML. Period.

#### Notes:

1.  Pseudo-random is a term that refers to a difficult to predict behaviour usually powered by well-applied modular arithmetic. In particular, modular exponentiation on prime moduli is often at the heart of such a system. The PRNG<sup>[\[5\]](#note-5)</sup> that powers this tool generates a 128-bit hash at the beginning, then it combines the four 32-bit sections of the hash in a predictable way.
2.  The term "unpredictable" is a bit misleading here. If we started our random number generator with an 8-bit hash instead of a 128-bit hash, we could quickly map out the exact sequence of numbers it generates and the order in which it does so. Unfortunately, 128 bits is enough data for more than 1036 numbers. Though practically, we only get about 109 so as to allow for a slightly more random appearance.
3.  Some common GML tools include ChatGPT, MidJourney, OpenAI, BardAI, et c. GML refers to the way the tools are built. Mass amounts of data, usually stolen, are fed into the system with proper labelling, usually done by underpaid workers, and the system builds an enormous neural-network-like multi-dimensional matrix that can identify content using text. These models are then reversed so that text can be input, and content can be spit out the other end.
4.  I certainly do not...and definitely by hand. But oh if I did.
5.  PRNG is the abbreviation used to refer generally to Pseudo-Random Number Generators among technical communities. This distinction is made to distinguish them from true random number generators.

---

### The Algorithm

Illustrations to come ... in time.

Here's a brief overview of the steps of the algorithm.

1.  Set up a 2d array. For best results, length and width should be greater than 20.
2.  Identify a total number of equivalence classes to be used and an expected relative concentration for each (whose total is 1) as well as an expected absolute concentration overall (between 0 and 1).
3.  Fill the array with numbers from 0 (empty) to the total number of equivalence classes using this heuristic
    *   for each element of the array, generate a random number between 0 and 1
    *   if the number is greater than the absolute concentration, mark the element zero
    *   if the number is less than the absolute concentration, generate a second random number between 0 and 1.
    *   with a known order of equivalence classes, identify where the number lies and assign that value to the element
4.  Perform the following loop a predetermined number of times\*:
    1.  Select an element from the array
    2.  If the element is 0, loop without calculation
    3.  Calculate the surround number (how many similar elements are in the eight positions around it) for the element
    4.  If the surround number is 8, loop without futher calculation
    5.  Identify a target element within the allowable swap distance
        1.  If the target has the same value, loop without further calculation
        2.  Calculate the possible total surround number change if the positions were swapped (if the target is empty, this is just the difference between the new surround and the old surround)
        3.  If the change is positive, swap the positions
        4.  If the change is less than -1, do not swap
        5.  Otherwise swap with some probability

**NOTE:** \*\*\*Some versions of this algorithm allow for it to continue until an iteration is completed with no swaps. As this is not guaranteed with some starting conditions, it is not advised. As a way to avoid potential infinite loops, one can loop until a given threshold of swaps is no longer happening. My original version of this tool would execute until 10 iterations proceeded with fewer than 1% elements swapped. This still resulted in unpredictable/undesirable end behaviour, so do so cautiously.\*\*\*

\-----

This overview is much clearer than the one for the [Diamond-Square Algorithm](/code/dsIsland/#algorithm), but it may still benefit from clarity in terms of what I've done on this page, so just like before, let's go ahead and give a breakdown of the process in a slightly cleaner manner.

#### Step 1: Initialise

Initialise a 2d array of length m>20 and width n>20. This allows for effectively infinite allowable sizes. Above, we're working with m=n=321 by default.

In this version, we're setting the outer edges to be walls by default. Otherwise, the algorithm proceeds as laid out above.

Set a swap length L&lt;min(m,n)/2 to make sure swaps happen only in a finite area of the array.

Set a concentration to know how many elements to set as walls (or other details).

Fill the array randomly according to the concentration.

### Step 2: Loops

Begin a loop that closes after a given number of iterations or after there are no more swaps.

Begin an inner loop at position 0 vertically. (This implementation starts at 1 for reasons I won't disclose). At the end of each loop, move down by 1. Don't go past the edge of the array.

Begin a nested inner loop at position 0 horizontally. (This implementation starts at 1 for reasons I won't disclose). At the end of each loop, move right by 1. Don't go past the edge of the array.

Inside the nested loop: If the current element is empty, loop the nested loop. If not, count the number of adjacent elements that match the current position. If that number is 8 (5 for edges, 3 for corners), loop the nested loop.

Inside the nested loop: Pick a cell within distance L (snapping to edges as necessary). If its value is the same, loop the nested loop. In this implementation, all nonempty cells have the same value, so you skip this check!

Inside the nested loop: If the target cell has 8 adjacent matching neighbours, loop the nested loop.

Inside the nested loop: check the potential increase in matching adjacent elements from swapping positions. (Check the adjacent numbers for the potential swap. If the target cell is empty, this just means finding the difference between the new value and the old value. For nonempty cells, this means checking the total pre-swap and the total post-swap and subtracting).

Inside the nested loop: If the result is a loss by more than 1, loop the nested loop. If the result is a gain, swap. Otherwise swap with a given likelihood.

Loop the nested loop.

Loop the inner loop.

Loop the outer loop.

#### Step 3. Post Processing

This one has very simple post-processing. For each element in the array, if it's empty it gets coloured black. If it's not empty, it gets the colour associated with its value. Display the result!

---
name: Digger Dungeon
description: A tool for generating a randomised dungeon map using a digging algorithm. Code and algorithm by Terra Hyde.
img: "/content/code/images/diggerMap.png"
icon: "/content/code/images/diggerMapSmol.png"
supporting_scripts: ['/content/code/scripts/diggerMap.js','/content/code/scripts/diggerMap_late_load.js']
all_in_one: ""
---

## Digger the Dungeon Map Randomiser

Based on an idea I've always thought would be cool, this dungeon map generator starts in the centre and "digs" it's way through all the rooms, assigning exit and size information along the way. This guarantees that exits between rooms are consistent, but it does not guarantee connectedness.

---

<div class="tool-intro">

### How to use this tool

*   Select the number of rooms wide the map will generate. NOTE: More rooms means lower quality output.
*   Select whether to use natural rooms (more rounded, pseudorandom bounds).
*   Select whether to use sparser connectivity (exits are carried over, but there are fewer, and parallel spaces are less likely), connected search (search path only follows existing doors), or neither.
*   Select a seed value. This determines the map almost completely. The other parameters can have effects on the outcome.
*   Click the button to generate a map! This can be saved (right-click, save image as) if you want to use it later. The time it takes will depend on your browser and your computer.
*   **NOTE:** The option to use or not use a grid is for the purposes of seeing the sectioning of the result. The ability to change this position allows you to find the optimal grid layout for your needs. If you want to download the map, you must turn off the grid to do so.

</div>
<div class="scaleCanvas" style="width: 80%;max-width: 800px;margin: 10px auto;display:grid">
	<canvas height="1000px" id="myCanvas" style="padding: 20px;border: 1px solid #808080;width:100%;margin:0 -20px;z-index:1;grid-area:1/1" width="1000px">BROKEN!</canvas>
	<canvas height="1000px" id="gridCanvas" style="padding: 20px;border: 1px solid #808080;width:100%;margin:0 -20px;z-index:1;grid-area:1/1" width="1000px">BROKEN!</canvas>
</div>
<input onclick="restart();" type="button" value="Generate!" />
<div class="tool-controls">

### Controls

Width in Rooms: <input type="number" value="15" min="3" max="50" id="cellWidth"/>  
Natural Style Rooms: <input type="checkbox" id="natSelect" />  

<input type="radio" id="spaSelect" name="digSelect" value="sparse"> Sparser Connectivity
<input type="radio" id="conSelect" name="digSelect" value="connect"> Connected Search  
<input type="radio" id="nonSelect" name="digSelect" value="none" checked> Neither

Display Grid? <input id="showGrid" type="checkbox" onChange="dispGrid()" checked />

Seed Value: <input default="1337" id="seedNum" max="4294967295" min="0" step="1" type="number" value="1337" />  
<input type="button" onclick="newSeed()" value="Randomise Seed!" />

</div>

### Discussion

#### What is it?

This tool is a procedural content generator using an algorithm of my own make.<sup>[\[1\]](#note-1)</sup> It's not particularly novel, necessarily.<sup>[\[2\]](#note-2)</sup> It's also absolutely not efficient. But it does the job, and it does it quick.<sup>[\[3\]](#note-3)</sup>

A brief description of the process can be summed up as:

1.  Create a grid of empty cells
2.  Add exits to the middle cell
3.  Recursively<sup>[\[4\]](#note-4)</sup> move through all the rooms and add exits, making sure to copy exits into adjacent rooms.
4.  Draw it!

If you want more detail about that, jump to [the algorithm section](#algorithm).

As a quick reminder, procedural content generation (PCG) is a branch of algorithmic design where the goal is to create consistent, repeatable results of some particular type. That could be a tileable pattern of noise or an image of a certain type. That could even be text or music, provided that the proper algorithm is designed to make it happen!

The case of "consistent" in this tool is that it creates the same sort of output (floor maps), regardless of input (type, density, room size, and seed). And the case of "repeatable" is guaranteed by the seeded random number generator<sup>[\[5\]](#note-5)</sup> as can be verified by setting the seed and hitting the generate button to your heart's content.

One thing that is different about this particular PCG compared to the other ones I've implemented to date (this may change) is that the output is almost certainly not unique. How do I know this? The [pigeonhole principle](https://en.wikipedia.org/wiki/Pigeonhole_principle)! In layperson's terms, the pigeonhole priciple says that if you have more items than positions, at least one position must have more than one item.

Why does that mean there are guaranteed repeats? Because every room has at most 4 exits, 3 for the edges, 2 for the corners (unless you make it tileable). If we used a 3x3 grid, that would give us at most 24x25x24\=213\=8192 door arrangements<sup>[\[6\]](#note-6)</sup> (many of which are not realisable)<sup>[\[7\]](#note-7)</sup>. If the possible outcomes stopped there, we'd be guaranteed at least 500,000 repeats for every arrangement on average!

But it doesn't stop there. Each door can come in one of 7 possible styles. Including "empty", that brings the new total to 84x4x83x4x82\=2x810\=231 possible outcomes.<sup>[\[8\]](#note-8)</sup> But importantly, that includes a lot of impossible scenarios. Even with all of those impossibilities, there are at least 2 copies of at least one seed's result!<sup>[\[9\]](#note-9)</sup><sup>[\[10\]](#note-10)</sup>

Now to be entirely fair, this does not account for the "natural style" rooms, but that requires more information from [the algorithm section](#algorithm)!

Even with all of that guaranteed repetition, I'd say this algorithm does some pretty fancy work!

#### What is it NOT?

This is not generative machine learning. Why do I care? I've already laid that out in at least two places<sup>[\[11\]](#note-11)</sup> that you can read for yourself. But there's something else important to say here.

This tool is not built with an algorithm of someone else's design. It's not built by using generative machine learning to code a page or the functions or anything. It's built strictly by using my own skills and my own time. And it drives me batty that people think that is somehow a waste.

Am I fortunate to be able to do the kind of work I did here? Yes. Does that make me, to some extent, privileged? Probably. But my ability to make something like this came from years of learning and practice. My first ever computer programmes were barely functional slapdash bundles of code.<sup>[\[12\]](#note-12)</sup> And as I got better, and as I understood more, I developed an understanding of what works and what doesn't.

And believe it or not, ALMOST ANYONE can learn how to do it.

It's commonly stated that science and mathematics are like foreign languages. This is, in my experience, largely spot on. A large part of the reason for that is the exceptionally technical jargon that is employed in each subject. And the same thing is true for computer science. As a result, simply starting to learn and doing it repeatedly is the best way to learn it!

A common argument these days is that generative machine learning is going to make my well-honed (if clunky) skill become irrelevant, so why bother? The short answer is that people like me are going to be essential as those generative machine learning tools start eating themselves. And they will. They already [produce bad results](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)). They already struggle to parse the information in a way that they can correct those errors. And pretty soon, those errors are going to be included in the training sets that power the models.

An [ouroboros](https://en.wikipedia.org/wiki/Ouroboros) of bad code used to make bad code used to make ...

So I'll keep coding. I'll keep building. I'll keep creating. And you should too.

#### Why did I make this?

A fully procedural map generator is kind of a [white whale](https://en.wikipedia.org/wiki/Moby-Dick) for me. I've had tonnes of ideas for possible games and stories that are just lacking one important thing to actually get off the ground: a map. It's not necessarily that a map is essential to me doing the work, but it's much easier for me to process the parts of the story if they have _places_ to reference as I develop what I'm doing. That goes double for games, since it's hard to test mechanics or verify what sorts of mechanics should exist if you don't have a space to do that in.

My first successful dip into map generation was back in 2010 or 2011 when I first learned about the [Midpoint Displacement algorithm](http://pcg.wikidot.com/pcg-algorithm:midpoint-displacement-algorithm) as well as [Perlin noise](http://pcg.wikidot.com/pcg-algorithm:perlin-noise). Both of these can be used for all sorts of procedural content setups, but neither one really felt to me like the sort of thing I was looking for.

Eventually I found the [Diamond-Square algorithm](http://pcg.wikidot.com/pcg-algorithm:diamond-square-algorithm), which improved the work I could do with midpoint displacement. It was a huge improvement for a lot of reasons, but mostly, it allowed me to create a map of an island or a world or even just a tileable set of clouds! But I was no closer to the general notion I was looking for: a map that could actively be used in a story or in a game development environment.

The next step in the journey was the [Togetherness cellular automaton](https://www.hermetic.ch/pca/tg.htm). I could feel myself getting closer to the type of thing I was hoping to do, but it didn't quite have the flavour of completeness I was looking for in the work I was doing.

To make matters much worse, all of these algorithms were SLOW.

I've long been a user of the [DonJon RPG Tools](https://donjon.bin.sh) for my tabletop rpgs, and I've always loved the various things they made available. I could quickly build towns, regions, countries, worlds, encounters, characters, and so much more with a few clicks. But all of those tools had starting conditions not in line with the kind of thing I was hoping to do. That is to say, they were entirely fueled by TTRPG style constraints.

So that brings us here. This is the first version of a tool intended to fulfill my need to procedurally generate maps! I've learned a lot from this experience, and I look forward to doing even more!

#### Notes:

1.  Have I mentioned I do algorithm design as a hobby? Cause I do.
2.  It's almost certainly not novel, but I've never read of it on the [procedural content generation wiki](http://pcg.wikidot.com), so I did have to come up with it myself. If it's on there, I haven't seen it. If you spot it, do tell!
3.  For some definitions of "quick". If we were considering the algorithmic complexity, it's at most [_O(n)_](https://en.wikipedia.org/wiki/Big_O_notation) (where n is the number of cells total) since for each cell, at most 16 calculations have to be made.<sup>[\[n-3\]](#note-13)</sup> It may well be much lower than _O(n)_, but I'm not putting in the work to confirm.
4.  You can go in whatever order works for your needs, but I chose the recursion order
    1.  Calculate self
    2.  Check up if uncalculated
    3.  Check down if uncalculated
    4.  Check left if uncalculated
    5.  Check right if uncalculated
    
    which results in a sort of extended zig-zag pattern across the grid. If you want to know more, check [the algorithm section](#algorithm).
5.  I've discussed [pseudorandom number generators](/code/tools/cavey/#note-1) AND seeded randomness in other code tools' discussion section. Go read about em there.
6.  The reason that particular expression is the number of door selections is that, essentially, every door can be "on" or "off" (there or not there), so for every possible door, we multiply by the number of choices (it's 2) over and over until we run out. This is done with exponents. Some of those exponents have been collapsed for space.
7.  The reason there are a lot of unrealisable outcomes is because the algorithm doesn't just randomly assign every single door. It checks if a room has any existing connections, copies those connections, THEN adds the remaining possible doors. The exception is the "sparse" algorithm, but that's fairly similar. For more info on door assignment, check out [the algorithm section](#algorithm).
8.  The expression here comes from the fact that every door can be off, left small, left big, mid small, mid big, right small, right big, or full. That comes to 8 choices. This time, the exponents are not collapsed straightaway.
9.  The total number of possible seeds is 232. This was chosen for a lot of reasons. But if this tool were implemented in certain languages (C, Java, PHP, and others) the limit would be dependent on the system used to compile or interpret the code. In most cases, it would either be 231 or 263.
10.  While the pigeonhole principle only guarantees at least 1 repeat, we can be fairly certain, given the dataset, that more repeats do occur. Notably, due to the calculations given, there are necessarily 2 on average for the final case covered, assuming all those possibile outcomes were allowed.
11.  You can see one of those in the [discussion section for the Cavey generator](/code/tools/cavey/#discussion) if you're interested.
12.  A big part of the reason for that is covered in the [discussion section for the synth piano](/code/tools/keys/#discussion) if you're interested.
13.  For some definitions of "calculations". But seriously, it's pretty limited. And for large enough values of n, it's basically zero calculations, regardless.

---

### The Algorithm

Illustrations to come ... in time.

Here's a brief overview of the steps of the algorithm.

1.  Set up a rectangular grid of m x n cells
    * m and n can be equal
    * each cell will contain two numbers
    * each cell represents a room in the map
2.  Pick a cell from the interior (not on an edge)
    *   the two numbers will be randomly assigned to the chosen cell
    *   NOTE: in the sparse modification of the algorithm, there is a reduced chance for numbers with the high bits set in each nibble (for simple versions) or each byte (for more complex versions)
    *   NOTE: one of the two numbers represents the sizes, positions, and instancing of doors around the room, while the other number represents the shape or size of the space in the room.
3.  Define a recursion with the following steps:
    1.  Given a room, check whether the room has had it's doors set. If so, return to caller.
    2.  Check the room below.
        1.  If the room below is unset, skip it.
        2.  If the room below is set, copy the flags for its "up" door to the current room
    3.  Check the room left.
        1.  If the room left is unset, skip it.
        2.  If the room left is set, copy the flags for its "right" door to the current room
    4.  Check the room above.
        1.  If the room above is unset, skip it.
        2.  If the room above is set, copy the flags for its "down" door to the current room
    5.  Check the room right.
        1.  If the room right is unset, skip it.
        2.  If the room right is set, copy the flags for its "left" door to the current room
    6.  Randomly assign the unassigned door flags of the current room.
    7.  Move to the room above and recurse.
    8.  Move to the room below and recurse.
    9.  Move to the room left and recurse.
    10.  Move to the room right and recurse.
4.  Execute the defined recursion starting with the cell we set in step 2, ignoring the exit command for the initial call.
    *   The recursion defined is limited by the recursion stack of your system, so the size of your space may be smaller or larger than this implementation
    *   The recursion defined is guaranteed to terminate because set cells are exited immediately without calculation, and the space is finite.
    *   The recursion defined is guaranteed to hit every room and follows essentially a zig-zagged spiral.
    *   The sparse implementation includes an extra step that discourages parallel segment development in disconnected rooms.
    *   The order of the directions used in the recursion is at the discretion of the coder, but it will affect the outcome due to the difference in path travelled.
    *   If space is not an issue, the cells can be configured with all door flags as separate integers

Once this process has executed, the drawing step executes. In the drawing step, 1-d midpoint displacement is used for "natural style" rooms and applied to the radius function for each segment being drawn. There are plenty of other ways to make this system work, but this is the method I chose.

There are many ways this algorithm can be improved. For example, it would be greatly improved by using a flag for door size for each door, a flag for door position for each door, a flag for room shape, and a flag for room size. By including all of those, a more detailed view could be taken. Another way this could be improved so far as execution time is concerned is to serialise the recursion, since serial execution is almost always faster than recursive execution.

Unlike the work I did for Diamond-Square, I won't provide an in-depth view of what's happening, because this one is MUCH simpler.

#### PseudoCode

Below, you will find pseudo-code for the algorithm but not the output, in case you need it for your own implementation.

```pseudo
/********************************************************************
 *                Digger Dungeon Generation                         *
 ********************************************************************/
instance the following:
    array - roomsGrid - int - 2d - m x n - initialise -1
    const - upDoor    - intFlag - initialise 0xff000000 or 0xf000
    const - downDoor  - intFlag - initialise 0x00ff0000 or 0x0f00
    const - leftDoor  - intFlag - initialise 0x0000ff00 or 0x00f0
    const - rightDoor - intFlag - initialise 0x000000ff or 0x000f
/*         specific constants will depend on implementation         */

function dig (xPos,yPos)
    if roomsGrid at (xPos,yPos) is -1
        check cardinal directions' doors for connections using flags
        if connections exist
            apply to int of roomsGrid (xPos,yPos)
        set remaining doors randomly and apply to int
        set int of roomsGrid (xPos,yPos) to random
        recurse dig (xPos-1,yPos)
        recurse dig (xPos+1,yPos)
        recurse dig (xPos,yPos-1)
        recurse dig (xPos,yPos+1)
    else return to caller

select an interior cell (midX,midY)
set doors randomly and apply to roomsGrid at (midX,midY)
perform dig at the cardnials from (midX,midY)
```


<style>
p span:nth-child(even) {
    display : none;
}
@media screen and (max-aspect-ratio: 3 / 4) {
    p span:nth-child(even) {
        display : block;
    }
}
</style>

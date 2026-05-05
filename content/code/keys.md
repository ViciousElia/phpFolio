---
name: Synth Piano
description: A tool for exploring various waveforms (approximated with Fourier Analysis) and various musical temperaments, presented as a single octave on a keyboard. Code by Terra Macdonald.
summary: A tool for exploring various waveforms (approximated with Fourier Analysis) and various musical temperaments, presented as a single octave on a keyboard.
img: "/content/code/images/12keys.png"
icon: "/content/code/images/12keysSmol.png"
supporting_scripts: ['/content/code/scripts/keys.js','/content/code/scripts/keys_late_load.js']
all_in_one: ""
---

## Synth Piano

This tool allows you to build a custom waveform that you can use as the approximate waveform for the keys on the keyboard below. If you use one of the default types, this is exact. In addition to custom waveforms, this tool allows you to explore temperaments other than the western default 12-tone equal. You can download a standalone here: [Synth Piano Zip File](/code/docs/SynthPiano.zip)

---

<div class="tool-intro">

### How to use this tool

*   Select a waveform. If you select Custom, select the number of points and move the points inside the grey area up and down.
*   Select a gain style. This determines how the notes play when keys are pressed on the keyboard. If the keys are clicked, they only use the Strike style.
*   Select a temperament. This determines the frequency difference between keys.
*   Start playing notes! In the current version, the keyboard can only control 18 of the keys, covering just over an octave for 12-, 15-, and 17-tone temperament.
*   **NOTE:** Due to the way in which this keyboard was built, some keys may stay on after release. If this happens, simply hit the Emergency Stop to return the audio generator to default.

</div>
<div style="width:100%;margin:10px auto;background-color:#ffffff;border:1px #808080 solid;padding:10px">
	<div style="display:grid;grid-auto-columns: calc(100%/3);width:100%">
		<canvas class="sideCanvas" width="200" height="100" style="grid-area:1/1;z-index:1;width: 100%;">Left Side Canvas. Your browser may have JS disabled.</canvas>
		<canvas id="middleCanvas" width="200" height="100" style="grid-area:1/2;z-index:1;width: 100%;">Your browser may have JS disabled.</canvas>
		<canvas id="waveCanvas" width="200" height="100" style="grid-area:1/2;z-index:2;width: 100%;">Your browser may have JS disabled.</canvas>
		<canvas id="dotsCanvas" width="200" height="100" style="grid-area:1/2;z-index:3;width: 100%;">Your browser may have JS disabled.</canvas>
		<canvas class="sideCanvas" width="200" height="100" style="grid-area:1/3;z-index:1;width: 100%;">Right Side Canvas. Your browser may have JS disabled.</canvas>
	</div>
</div>
<div id="keyGroup" style="width:95%;max-width:950px;margin:10px auto;font-size:2em;color:white"></div>
<div class="tool-controls">

### Controls

Waveform:  
<input type="radio" id="sineWave" name="waveForm" value="sine" onChange="setWave();copyCanv('sideCanvas','waveCanvas')" /><label for="sineWave">Sine</label>
<input type="radio" id="squaWave" name="waveForm" value="square" onChange="setWave();copyCanv('sideCanvas','waveCanvas')" /><label for="squaWave">Square</label>
<input type="radio" id="triaWave" name="waveForm" value="triangle" onChange="setWave();copyCanv('sideCanvas','waveCanvas')" /><label for="triaWave">Triangle</label>
<input type="radio" id="sawtWave" name="waveForm" value="sawtooth" onChange="setWave();copyCanv('sideCanvas','waveCanvas')" /><label for="sawtWave">Sawtooth</label>
<input type="radio" id="custWave" name="waveForm" value="custWave" onChange="setWave();copyCanv('sideCanvas','waveCanvas')" checked /><label for="custWave">Custom with </label><input type="number" min="3" max="20" value="5" id="numPoints" onChange="initPoints();"/><label for="numPoints"> Points</label>

Note Style:  
<input type="radio" id="sustainNote" name="playStyle" value="sustain" onChange="setStyle()" checked /><label for="sustainNote">Sustain</label>
<input type="radio" id="dampNote" name="playStyle" value="damp" onChange="setStyle()" /><label for="dampNote">Dampen (like a piano)</label>
<input type="radio" id="strikeNote" name="playStyle" value="strike" onChange="setStyle()" /><label for="strikeNote">Strike (like a marimba)</label>

Temperament:  
<input type="radio" id="twelveNote" name="noteCount" value="12" onChange="buildKeys()" checked /><label for="twelveNote">12-Tone</label>
<input type="radio" id="fifteenNote" name="noteCount" value="15" onChange="buildKeys()" /><label for="fifteenNote">15-Tone</label>
<input type="radio" id="seventeenNote" name="noteCount" value="17" onChange="buildKeys()" /><label for="seventeenNote">17-Tone</label>
<input type="radio" id="nineteenNote" name="noteCount" value="19" onChange="buildKeys()" /><label for="nineteenNote">19-Tone</label>
<input type="radio" id="twentytwoNote" name="noteCount" value="22" onChange="buildKeys()" /><label for="twentytwoNote">22-Tone</label>
<input type="radio" id="thirtyoneNote" name="noteCount" value="31" onChange="buildKeys()" /><label for="thirtyoneNote">31-Tone</label>
<input type="radio" id="thirtyfourNote" name="noteCount" value="34" onChange="buildKeys()" /><label for="thirtyfourNote">34-Tone</label>

</div>

---

### Discussion

#### Background and Motivation

I have to start this out by sharing a brief story that will explain, hopefully, just what it is that made me want to do this. The story will take us far into the past, where a young Terra had her first exciting moment in making a computer work. In doing so, it'll will explain three big things about me, and I just want to have those three things somewhere on the internet.

The very first computer that ever made its way into my home was an old Tandy Computer i386 compatible desktop station. If you don't know what those words mean, don't worry! Little tiny Terra didn't know either! The computer was an old workstation my grandad used until he upgraded. It had enough space to run such incredible titles as ... Windows Entertainment Pack 3! And Wolfenstein 3D! And Boppin!

But the games it could play were only one small facet of what made that computer special. It marked the moment my home moved from the radio-television age into the computer age and had near unlimited<sup>[\[1\]](#note-1)</sup> power to make all our wildest imaginings become all our wildest realities! It represented knowledge. It represented access.

And it had literally no internet.

But what it did have was a strange blue programme called QBasic.<sup>[\[2\]](#note-2)</sup> QBasic was one of the most fascinating things I had ever seen! It put the power of programming into the hands of anyone in the family (their words, not mine) and laid the groundwork for my obsession with coding.

QBasic came with several ready-made programmes, from Money Manager to Gorillas to Nibbles. I mean ... MONEY.BAS,<sup>[\[3\]](#note-3)</sup> GORILLAS.BAS,<sup>[\[4\]](#note-4)</sup> and NIBBLES.BAS.<sup>[\[5\]](#note-5)</sup> While an 8-year-old Terra didn't much care for Money Manager, she found a world of possibilities hiding within Nibbles and Gorillas, and who could possibly blame her? They came with well-commented code about how to make them work!

So like any reasonably technically savvy kid, I ignored all of that and decided I should learn how it all works by starting from scratch. It couldn't possibly be that difficult to ... implement? ... a game? ... a simple bit of code? ... something? ANYTHING? PLEASE DEAR GODDESS MAKE IT WORK!<sup>[\[6\]](#note-6)</sup>

I eventually learned how it all worked. It wasn't pleasant. And it wasn't easy, but around age 9, I got my first programme to work. It played a simple jingle, it displayed text, and it exited. Not exactly a game, but it did SOMETHING.

I didn't learn how good I had it by learning to code in QBasic until later ... when I decided to learn to code in C.

What's the difference in what coding language I use? It can't be that hard, right? It's all basically the same thing, isn't it?

What's a ... function? What's a ... struct? What's a ... datatype? What's a ... return value? What's a ... parameter? What's a ... library? When did books get involved?

Wait ... where's the audio function? Where's the graphics? Oh no. What am I getting into?

Well it can't be that hard, can it?<sup>[\[7\]](#note-7)</sup>

The point of all this is to say that I knew I wanted to write code before I knew how. And at every turn, I wish things were as easy in other languages as they were in QBasic. It's honestly no wonder that when I took my very first coding class in college (all my prior coding skills were built from trial and error), my very first non-homework programme in that class was to implement Nibbles in C, which helped me to come to terms with the hard truth that sound and graphics are not as easy as simply typing "play A B C B B B" or "draw circle 0 0 1".

Learning the perils didn't deter me, so here I am. Finding ways to make music with code. Still relying on simple tools, but getting more and more complex as I go.

#### How it works!

This piano uses relatively few ideas to make it work, but the implementation at its heart relies on framework that's provided natively in JS. First: all finite-periodic waves can be approximated by sine and cosine waves of varying frequency. Second: given a discrete function on a finite interval, you can extend that to a finite-periodic wave. Third: approximations of finite-periodic waves can be found by using a Discrete Fourier Transform. Fourth: equal temperament frequencies can be found by simple multiplication by a tempering constant.

Most of the preceding paragraph will have a terribly small audience of understanding, and that's okay, so I'm going to break that all down a bit here.

First. Finite-periodic is just fancy maths talk for saying that a small bit of area can be looked at, then copied over and over and over and ... eventually by "copying infinitely", you can recreate the whol picture from that small area. The small area in question is called the period of the wave. So if something is like that, we can approximate it with sine and cosine waves (which are really the same thing, but who's counting) ... somehow. If you don't know what a sine wave is, hit the radio button up top to see it on the graph!

Second. A discrete function is just a set of points that aren't connected for which there's only one y-value (sorta). They can be connected (like we've done) to make a continuous function, but the key here is that we're starting with them NOT connected for the sake of understanding the process. The finite interval part just means all we're looking at is a small area. How do we take those points and turn em into a finite-periodic function? We connect the dots, then do the copying we just mentioned.

Third. We can use something called a Discrete Fourier Transform ... which I'll cover below ... but what kind of approximation do we get from that? Well, it's a bunch of sine and cosine functions. We get 0, 1, sine(t), cosine(t), sine(2t), cosine(2t), ..., sine(nt), cosine(nt). Which, as luck would have it, are the sine and cosine functions of varying frequency we talked about above! Unfortunately, we need a LOT of these functions to fully approximate the wave we're looking at.

Fourth. Equal temperament refers to the difference in pitch between, for example, A and B on a keyboard. There are other temperaments that we could consider, but they are much harder to work with. The most common one for modern, western instruments is equal temperament, since it guarantees that all notes played will have the appropriate harmonics under consideration. The way it works in practice is that you assume an octave is double the frequency (because it is), then you find the nth-root of 2, where n is the number of tones you want in your temperament. All notes above your start (root) can be reached by repeatedly multiplying by that value!

An astute observer will notice that I have not made clear where the sound is coming from. Short version is that Javascript has a tool built in that takes the coefficients of a Discrete Fourier Transform and tries to recreate a wave from it that can be played through its oscillators!

#### About DFT!

To give it its full justice, I need to briefly explain first what a Fourier Transform is, then I can explain the discrete version. Then we'll go from there.

Put simply, a Fourier Transform rewrites a function on a finite interval as an infinite series of exponentials of complex numbers. Infinite series provide two very important and useful analytic tools. The first is the ability to truncate for the sake of approximating functions. The second is the ability to quickly do calculus on functions that may not normally be amenable to calculus. Exponentials, specifically, allow us to quickly do derivatives and integrals, since we need only perform a chain rule<sup>[\[8\]](#note-8)</sup> for our calculation!

The following statement is for the uninitiated into complex analysis. Exponentials on complex numbers break down as simple cosine and sine functions. Specifically ...

_e<sup>ix</sup> = cos(x) + i sin(x)_

This identity is called Euler's identity for complex exponentials. And together with analysis, it tells us that as long as Fourier's fancy little trick behaves nicely, the exponentials in the series are just the key we need to do fancy calculus things ... and also to approximate as a bunch of sines and cosines!

The discrete version of Fourier's little trick is pretty cool. Instead of doing calculus outright, we just have to add up a bunch of individual numbers ... which becomes calculus as we get to the infinite, but we're ignoring that detail.

Discrete Fourier Transforms are slow. For a system that can't do calculus or at least not natively, they're the only option. But for a system that can, they're slower than a Fourier Transform once you reach a certain data size. So if they're slow, why do we use them? Short answer is that it's often easier to do a discrete transform on real-world data to better understand it, and it's often unnecessary to have the full complete Fourier Transform for those kinds of problems anyway. If you can fairly accurately calculate something with 6 terms of precision, why would you use infinite precision?

The way we calculate a discrete Fourier transform is essentially to set up a continuous one, and then ... just stop. One term instead of a function. And it works. And then we add that up for all the important bits of the sine and cosine functions we can afford<sup>[\[9\]](#note-9)</sup> while keeping speed in mind.

The results of a DFT? The "real and imaginary parts" of the first few (in this case, "few" is used to mean "as many points as you feed in") exponential functions that we would've found from the continuous version. That's right! It's exactly what we've been aiming for!

#### Possible Improvements!

This tool works! But it could be improved.<sup>\[citation needed\]</sup>

What follows is a short list of some ways it could be made better, some of which are easy, and might make good projects for later. If I do, then I'll link the updates here!

*   Allow for splines instead of only linear segments. This would provide more interesting wave profiles. It wasn't implemented because the process wasn't worth the effort for a proof of concept. Also, it would've required ...
*   Allow for continuous Fourier Transform instead of discrete. This would provide a more accurate translation from the points to the waves played. The only custom waves that can successfully be implemented with full accuracy in this tool are triangle and skewed sawtooth waves. There's room for truncated triangle waves to approximate square waves, but it's not perfect.
*   Allow for assignment of all four keyboard rows to the playing of keys. This would make it easier to use the tool for more than a proof of concept.
*   Implement other temperaments. I only did equal temperament in this tool. That was to save effort over Pythagorean temperament or other, more complex options that do exist. But by allowing for equal temperament in more tones than just 12-tone, I hope it inspires someone to play around some!
*   Write a better discussion section! ... maybe.

#### Notes!

1.  "Near unlimited" was apparently nowhere near unlimited, but I had a huge advantage because the games I liked were all pretty small. For an idea of how small "near unlimited" was for me at the time, the i386 ran at a whopping 33MHz in the later generations, and the RAM was a staggering 24MB, and the hard drive was a monster weighing in at 360 MB. We could do ANYTHING with that kind of power, right?!?!?!
2.  Based on the QuickBasic language, [QBasic](https://en.wikipedia.org/wiki/QBasic) served as an interpreter for Basic-like syntax code. It supported both Functions and Subroutines. It had built-in sound support through PC Beep (not impressive, but not shabby either) and also provided basic graphical primitives for drawing! Well, provided you were using the correct screen mode.
3.  Money Manager was an early, DOS-friendly implementation of Microsoft Money. It was ... not bad, considering.
4.  Gorillas was your basic artillery launcher game. Together with Artillery Simulator on the Apple II, Gorillas was likely the motivation by games like Worms and Tanks, as well as all their clones and knock-offs.
5.  Nibbles was the basic snake game. Instead of collecting apples or similar objects, Nibbles used the numbers 1 through 9 as targets, each of which was worth more points than the lower numbers, but they also increased the snake's length by larger and larger amounts. Nibbles only had 15 levels, with the last two repeating after completion.
6.  Anyone who has ever coded and continued doing it has likely had this experience of certainty and confidence followed by complete despair as they discovered how complex the field actually is. It is truly one of the most difficult skills I have ever built up.
7.  It can, and in fact was, that difficult.
8.  Chain rule is a calculus thing. It's neat. It says if you have a function inside a function, you do the outside, leaving the inside, then multiply by the derivative of the inside.
9.  In this tool, we can afford up to 21 calculations. More than that if you cheat. But we only do as many as necessary.

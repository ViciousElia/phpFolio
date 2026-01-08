document.getElementById("seedNum").value = Math.floor(Math.random()*4294967295);
let canvas = document.getElementById("imageCanvas");
let ctx = canvas.getContext("2d");
ctx.fillStyle = "#00325a";
ctx.fillRect(0, 0, 1025, 1025);

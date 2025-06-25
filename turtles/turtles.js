const player = document.getElementById("player");

let position = 0;
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") position += 10;
  if (e.key === "ArrowLeft") position -= 10;
  player.style.left = position + "px";
});

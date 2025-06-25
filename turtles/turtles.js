const player = document.getElementById("player");
const playBtn = document.getElementById("playBtn");
const message = document.getElementById("message");

let position = window.innerWidth / 2 - 25;
player.style.left = position + "px";

// Move player with arrows
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") position += 20;
  if (e.key === "ArrowLeft") position -= 20;
  player.style.left = position + "px";
});

// Create turtles at random positions and move them up
function createTurtle() {
  const turtle = document.createElement("img");
  turtle.src = "turtle.png"; // replace with your image file name
  turtle.classList.add("turtle");
  turtle.style.left = Math.random() * (window.innerWidth - 40) + "px";
  turtle.style.top = window.innerHeight + "px";
  document.body.appendChild(turtle);

  let turtleTop = window.innerHeight;
  const move = setInterval(() => {
    turtleTop -= 2;
    turtle.style.top = turtleTop + "px";

    if (turtleTop < -40) {
      clearInterval(move);
      turtle.remove();
    }

    // Collision detection
    const pRect = player.getBoundingClientRect();
    const tRect = turtle.getBoundingClientRect();
    if (
      pRect.left < tRect.right &&
      pRect.right > tRect.left &&
      pRect.top < tRect.bottom &&
      pRect.bottom > tRect.top
    ) {
      message.textContent = "Collision with a turtle!";
      clearInterval(move);
      turtle.remove();
    }
  }, 10);
}

playBtn.onclick = () => {
  message.textContent = "";
  for (let i = 0; i < 5; i++) {
    setTimeout(createTurtle, i * 500);
  }
};

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

// Create turtles at random positions and move them up with one caption each

const turtleTexts = [
  "We are video game turtles !",
  "Let us present our many ancestors:",
  "Bunch'of user functions",
  "Library functions",
  "System call functions",
  "Assembly instructions",
  "Binary instructions",
  "CPU executing them",
  "ALU",
  "Circuits",
  "Logic gates",
  "Transistors",
  "Silicon",
  "Crystal structure",
  "Silicon atoms",
  "Silicon nucleus",
  "Nucleons",
  "Quarks",
  "Wavefunctions",
  "Quantum fields",
  "Field of quantum operators",
  "Quantum operators",
  "Complex vectors",
  "Complex numbers",
  "Real numbers",
  "Dedekind cuts",
  "Rational numbers",
  "This is becoming long",
  "Integers",
  "Natural numbers",
  "Von Neumann ordinals",
  "3 = {2,1,0}",
  "2 = {1,0}",
  "1 = {0}",
  "0 = {}",
  "Nothing",
  
];
let textIndex = 0;

function createTurtle() {
  const turtle = document.createElement("img");
  turtle.src = "turtle.png"; // replace with your image file name
  turtle.classList.add("turtle");
  turtle.style.left = Math.random() * (window.innerWidth - 40) + "px";
  turtle.style.top = window.innerHeight + "px";
  document.body.appendChild(turtle);

  const caption = document.createElement("div");
  caption.textContent = turtleTexts[textIndex % turtleTexts.length];
  caption.style.position = "absolute";
  caption.style.fontSize = "14px";
  caption.style.color = "lightblue";
  caption.style.top = turtle.style.top;
  caption.style.left = turtle.style.left;
  document.body.appendChild(caption);
  textIndex++;

  let turtleTop = window.innerHeight;
  const move = setInterval(() => {
    turtleTop -= 1;
    turtle.style.top = turtleTop + "px";
    caption.style.top = turtleTop - 20 + "px";
    caption.style.left = turtle.style.left;


    if (turtleTop < -100) {
      clearInterval(move);
      turtle.remove();
      caption.remove();
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
  for (let i = 0; i < 36; i++) {
    setTimeout(createTurtle, i * 1000);
  }
};





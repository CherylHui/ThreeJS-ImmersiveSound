/* PDM Course: Sound Unit

Building and using a basic synthesizer

Code by Anthony T. Marasco [2018]
*/
//basic example
let synth;

function setup() {
  startContext()

  createCanvas(500,100);
  background(200);
  synth = new Tone.Synth({
    oscillator: {
      type: "sine"
    }
  }).toDestination();
}

function draw() {
  background("lightBlue");
  fill(255);
  textAlign(CENTER);
  textSize(25);
  text("Press Any Key to Play a Note!", width / 2, height / 2);
}

function keyPressed() {
  /*.triggerAttackRelease() method tells the oscillator to
    to set its frequency to the pitch passed in as the first argument,
    and to open its envelope for the duration passed in as the
    second argument. The envelope closes after that.
  */
  synth.triggerAttackRelease("A3", 1);
}

function startContext() {
   console.log("Tone is: ", Tone.context.state)
  document.body.addEventListener("click", () => {
    Tone.context.resume();
    console.log("Tone is: ", Tone.context.state);
  });
}
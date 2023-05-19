import "./style.scss";

import { Bodies, Composite, Engine, Mouse, MouseConstraint, Render, Runner } from 'matter-js';

const engine = Engine.create();
const render = Render.create({
  element: document.body,
  engine: engine
});

const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

/**
 * Creating 100 random boxes WITH RANDOM MESS and add them to the world
 */
Composite.add(engine.world, [ground]);

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

/**
 * Creating a new box everytime user click on a button
 *   creating the button
 *   adding event listener
 */
const button = document.createElement("button");
button.innerText = "Add box";
document.body.appendChild(button);
button.addEventListener("click", () => {
  /** Random box in random position with random width, height */
  const box = Bodies.rectangle(
    Math.random() * 800,
    Math.random() * 600,
    Math.random() * 200,
    Math.random() * 200
  );
  Composite.add(engine.world, [box]);
});

/**
 * Make it possible to drag matterjs objects
 */
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false
    }
  }
});
Composite.add(engine.world, mouseConstraint);

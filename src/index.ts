import { Bodies, Composite, Constraint, Engine, Events, Mouse, MouseConstraint, Render, Runner } from 'matter-js';
import galaxyImagePath from './assets/blackhole.jpg';

const engine = Engine.create();
engine.world.gravity.y = 0; // disable gravity

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    background: '#060b1f',
  }
});

const ground = Bodies.rectangle(400, 630, 810, 60, { isStatic: true });
const ceiling = Bodies.rectangle(400, -30, 810, 60, { isStatic: true });
const leftWall = Bodies.rectangle(-30, 300, 60, 610, { isStatic: true });
const rightWall = Bodies.rectangle(830, 300, 60, 610, { isStatic: true });
/**
 * Creating a fixed central circle
 */
const circle = Bodies.circle(400, 300, 50, {
  isStatic: true,
  render: {
    sprite: {
      texture: galaxyImagePath,  // Replace with the path to your image
      xScale: 0.5,  // Adjust as needed
      yScale: 0.5   // Adjust as needed
    }
  }
});
Composite.add(engine.world, [ground, ceiling, leftWall, rightWall, circle]);

/**
 * Creating 10 rectangles with fixed random positions around the circle
 */
for (let i = 0; i < 12; i++) {
  const angle = Math.random() * Math.PI * 2; // random angle
  const distance = Math.random() * 150 + 100; // distance from the center of the circle
  const x = 400 + distance * Math.cos(angle);
  const y = 300 + distance * Math.sin(angle);
  const width = 120;
  const height = 60;

  const rectangle = Bodies.rectangle(x, y, width, height, { restitution: 0, inertia: Infinity });
  Composite.add(engine.world, rectangle);
}

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

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

let tempConstraint: any = null;
let linePoint: any = null;

Events.on(mouseConstraint, "startdrag", (event) => {
  const dx = event.body.position.x - circle.position.x;
  const dy = event.body.position.y - circle.position.y;
  const angle = Math.atan2(dy, dx);

  // Create a point on the border of the circle
  linePoint = {
    x: circle.position.x + 50 * Math.cos(angle),
    y: circle.position.y + 50 * Math.sin(angle),
  };

  tempConstraint = Constraint.create({
    pointA: linePoint,
    bodyB: event.body,
    length: Math.hypot(event.body.position.x - linePoint.x, event.body.position.y - linePoint.y),
    stiffness: 1,
  });
  Composite.add(engine.world, tempConstraint);
});

Events.on(mouseConstraint, "mousemove", (event) => {
  if (tempConstraint) {
    const dx = mouse.position.x - circle.position.x;
    const dy = mouse.position.y - circle.position.y;
    const angle = Math.atan2(dy, dx);

    // Update the position of the linePoint
    linePoint.x = circle.position.x + 50 * Math.cos(angle);
    linePoint.y = circle.position.y + 50 * Math.sin(angle);

    tempConstraint.length = Math.hypot(mouse.position.x - linePoint.x, mouse.position.y - linePoint.y);
  }
});

Events.on(mouseConstraint, "enddrag", (event) => {
  Composite.remove(engine.world, tempConstraint);
  tempConstraint = null;
});

Composite.add(engine.world, mouseConstraint);

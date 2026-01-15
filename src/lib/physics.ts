import Matter from 'matter-js';

export const triggerSudoDestroy = () => {
  const { Engine, Runner, Bodies, Composite } = Matter;
  
  const engine = Engine.create();
  const world = engine.world;

  // Targeted elements for destruction
  const elements = document.querySelectorAll(
    '.project-card, .bento-card, h1, h2, p, button, .terminal, .nav-link, span, .status-bar'
  );
  
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const { x, y, width, height } = rect;

    const body = Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
      restitution: 0.5,
      friction: 0.1,
    });

    Composite.add(world, body);

    const update = () => {
      const pos = body.position;
      const angle = body.angle;
      (el as HTMLElement).style.position = 'fixed';
      (el as HTMLElement).style.top = '0';
      (el as HTMLElement).style.left = '0';
      (el as HTMLElement).style.width = `${width}px`;
      (el as HTMLElement).style.zIndex = '9999';
      (el as HTMLElement).style.pointerEvents = 'none';
      (el as HTMLElement).style.transform = `translate(${pos.x - width / 2}px, ${pos.y - height / 2}px) rotate(${angle}rad)`;
      requestAnimationFrame(update);
    };
    update();
  });

  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 60, { isStatic: true });
  Composite.add(world, ground);

  const runner = Runner.create();
  Runner.run(runner, engine);
};
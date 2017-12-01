function Vertex(x, y, z) {
  this.x = parseFloat(x);
  this.y = parseFloat(y);
  this.z = parseFloat(z);
}

function Cube(center, size) {
  const d = size / 2;

  this.vertices = [
    new Vertex(center.x - d, center.y - d, center.z + d),
    new Vertex(center.x - d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z + d)
  ];

  this.faces = [
    [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
    [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
    [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
    [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
    [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
    [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
  ];
}

function render(objects, ctx, dx, dy) {
  // Clear the previous frame
  ctx.clearRect(0, 0, 2 * dx, 2 * dy);

  // for each object
  for (let i = 0; i < objects.length; i++) {
    // for each face
    for (let j = 0; j < objects[i].faces.length; j++) {
      // current face
      const face = objects[i].faces[j];

      // Draw the first vertex
      let P = project(face[0]);
      ctx.beginPath();
      ctx.moveTo(P.x + dx, -P.y + dy);

      // Draw the other verticies
      for (let k = 1; k < face.length; k++) {
        P = project(face[k]);
        ctx.lineTo(P.x + dx, -P.y + dy);
      }

      // Close the path and draw the face
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }
}

function Vertex2D(x, y) {
  this.x = parseFloat(x);
  this.y = parseFloat(y);
}

function project(M) {
  return new Vertex2D(M.x, M.z);
}

(function () {
  const canvas = document.getElementById('cnv');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const dx = canvas.offsetWidth / 2;
  const dy = canvas.offsetHeight / 2;

  // Object style
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';

  // Create the cube
  const cube_center = new Vertex(0, 11 * dy / 10, 0);
  const cube = new Cube(cube_center, dy);
  const objects = [cube];

  // First render
  render(objects, ctx, dx, dy);

  // Events
  let mousedown = false;
  let mx = 0;
  let my = 0;

  canvas.addEventListener('mousedown', initMove);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', stopMove);

  // Rotate a vertice
  function rotate(M, center, theta, phi) {
    // Rotation matrix coeffieients
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const cp = Math.cos(phi);
    const sp = Math.sin(phi);

    // Rotation
    const x = M.x - center.x;
    const y = M.y - center.y;
    const z = M.z - center.z;

    M.x = ct * x - st * cp * y + st * sp * z + center.x;
    M.y = st * x + ct * cp * y - ct * sp * z + center.y;
    M.z = sp * y + cp * z + center.z;
  }

  // Initialize the movement
  function initMove(evt) {
    clearTimeout(autorotate_timeout);
    mousedown = true;
    mx = evt.clientX;
    my = evt.clientY;
  }

  function move(evt) {
    if (mousedown) {
      const theta = (evt.clientX - mx) * Math.PI / 360;
      const phi = (evt.clientY - my) * Math.PI / 360;

      for (let i = 0; i < 8; i++) {
        rotate(cube.vertices[i], cube_center, theta, phi);
      }

      mx = evt.clientX;
      my = evt.clientY;

      render(objects, ctx, dx, dy);
    }
  }

  function stopMove() {
    mousedown = false;
    autorotate_timeout = setTimeout(autorotate, 2000);
  }

  function autorotate() {
    for (let i = 0; i < 8; i++) {
      rotate(cube.vertices[i], cube_center, -Math.PI / 720, Math.PI / 720);
    }

    render(objects, ctx, dx, dy);

    autorotate_timeout = setTimeout(autorotate, 30);
  }
  autorotate_timeout = setTimeout(autorotate, 2000);
})();

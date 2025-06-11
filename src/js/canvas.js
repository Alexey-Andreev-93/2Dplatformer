import platform from "../img/platform.png";
import hills from "../img/hills.png";
import background from "../img/background.png";
import platformSmallTall from "../img/platformSmallTall.png";
import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";
import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteStandRight from "../img/spriteStandRight.png";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;
class PLayer {
  constructor() {
    this.speed = 12;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 66;
    this.height = 150;
    this.image = createimage(spriteStandRight);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createimage(spriteStandRight),
        left: createimage(spriteStandLeft),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createimage(spriteRunRight),
        left: createimage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = this.sprites.stand.cropWidth;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (this.frames > 59 && this.currentSprite === this.sprites.stand.right)
      this.frames = 0;
    else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    )
      this.frames = 0;
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createimage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

function init() {
  player = new PLayer();
  platformImage = createimage(platform);
  platforms = [
    new Platform({
      x: platformImage.width * 5 + 1300,
      y: 370,
      image: createimage(platformSmallTall),
    }),
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({
      x: platformImage.width * 2 + 200,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 3 + 400,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 4 + 700,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 5 + 1010,
      y: 470,
      image: platformImage,
    }),
    new Platform({
      x: platformImage.width * 6 + 1500,
      y: 470,
      image: platformImage,
    }),
  ];

  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: createimage(background) }),
    new GenericObject({ x: -1, y: -1, image: createimage(hills) }),
    new GenericObject({ x: 1000, y: -1, image: createimage(hills) }),
  ];

  scrollOfSet = 0;
}

let player = new PLayer();
let platformImage = createimage(platform);
let platforms = [];

let genericObjects = [];

let keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

let scrollOfSet = 0;
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.d.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.a.pressed && player.position.x > 100) ||
    (keys.a.pressed && scrollOfSet === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.d.pressed) {
      scrollOfSet += 5;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.a.pressed && scrollOfSet > 0) {
      scrollOfSet -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed / 2;
      });
    }
  }

  //platform collision
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  if (player.position.y < 0) {
    player.velocity.y = 1;
  }

  //win cindition
  if (scrollOfSet > 2000) {
    console.log("You win!");
  }

  //lose condition
  if (player.position.y > canvas.height) {
    init();
  }
}

init();
animate();

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      if (player.velocity.y === 0) player.velocity.y = -10;
      break;
    case "d":
      keys.d.pressed = true;
      player.currentSprite = player.sprites.run.right;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;
      break;
    case "a":
      keys.a.pressed = true;
      player.currentSprite = player.sprites.run.left;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.width = player.sprites.stand.width;
      break;
    case "a":
      keys.a.pressed = false;
      player.currentSprite = player.sprites.stand.left;
      player.currentCropWidth = player.sprites.stand.cropWidth;
      player.width = player.sprites.stand.width;
      break;
  }
});

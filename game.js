(function () {
  let isPause = false;
  let animationId = null;

  console.log(window);

  const speed = 3;
  const car = document.querySelector(".car");
  const carWidth = car.clientWidth / 2;
  const carHeight = car.clientHeight;
  const road = document.querySelector(".road");
  const roadHeight = road.clientHeight;
  const roadWidth = road.clientWidth / 2;

  const coin = document.querySelector(".coin");
  const coinCoord = getCoords(coin);
  const coinWidth = coin.clientWidth / 2;

  console.log(coinWidth)

  const trees = document.querySelectorAll(".tree");

  //Получаем координаты машины
  const carCoods = getCoords(car);
  //Движение машины
  //Сделали обьект где будем хранить идентификаторы наших анимаций
  const carMoveInfo = {
    top: null,
    bottom: null,
    left: null,
    right: null,
  };

  const treesCoords = [];

  //Цикл для получение координат деревьев
  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i];
    const coordsTree = getCoords(tree);

    treesCoords.push(coordsTree);
  }

  //Логика для анимации нашей машины
  //keydown keyup
  //Отслеживаем клавиши
  document.addEventListener("keydown", (event) => {
    if (isPause) {
      return;
    }
    const code = event.code;

    if (code === "ArrowUp" && carMoveInfo.top === null) {
      if (carMoveInfo.bottom) {
        return;
      }
      carMoveInfo.top = requestAnimationFrame(carMoveToTop);
    } else if (code === "ArrowDown" && carMoveInfo.bottom === null) {
      if (carMoveInfo.top) {
        return;
      }
      carMoveInfo.bottom = requestAnimationFrame(carMoveToBottom);
    } else if (code === "ArrowLeft" && carMoveInfo.left === null) {
      if (carMoveInfo.left) {
        return;
      }
      carMoveInfo.left = requestAnimationFrame(carMoveToLeft);
    } else if (code === "ArrowRight" && carMoveInfo.right === null) {
      if (carMoveInfo.right) {
        return;
      }
      carMoveInfo.right = requestAnimationFrame(carMoveToRight);
    }
  });

  document.addEventListener("keyup", (event) => {
    const code = event.code;

    if (code === "ArrowUp") {
      cancelAnimationFrame(carMoveInfo.top);
      carMoveInfo.top = null;
    } else if (code === "ArrowDown") {
      cancelAnimationFrame(carMoveInfo.bottom);
      carMoveInfo.bottom = null;
    } else if (code === "ArrowLeft") {
      cancelAnimationFrame(carMoveInfo.left);
      carMoveInfo.left = null;
    } else if (code === "ArrowRight") {
      cancelAnimationFrame(carMoveInfo.right);
      carMoveInfo.right = null;
    }
  });

  function carMoveToTop() {
    //Высчитываем новую координату по оси Y
    const newY = carCoods.y - 5;
    carCoods.y = newY;

    if (newY < 0) {
      return;
    }

    //Имея новые координаты мы передвинули нашу машину
    carMove(carCoods.x, newY);

    //Зациклили нашу функцию
    carMoveInfo.top = requestAnimationFrame(carMoveToTop);
  }
  function carMoveToBottom() {
    const newY = carCoods.y + 5;
    if (newY + carHeight > roadHeight) {
      return;
    }
    carCoods.y = newY;
    carMove(carCoods.x, newY);
    carMoveInfo.bottom = requestAnimationFrame(carMoveToBottom);
  }
  function carMoveToLeft() {
    const newX = carCoods.x - 5;
    if (newX < -roadWidth + carWidth) {
      return;
    }
    carCoods.x = newX;
    carMove(newX, carCoods.y);
    carMoveInfo.left = requestAnimationFrame(carMoveToLeft);
  }
  function carMoveToRight() {
    const newX = carCoods.x + 5;
    if (newX > roadWidth - carWidth) {
      return;
    }
    carCoods.x = newX;
    carMove(newX, carCoods.y);
    carMoveInfo.right = requestAnimationFrame(carMoveToRight);
  }

  //Передвижение
  function carMove(x, y) {
    car.style.transform = `translate(${x}px, ${y}px)`;
  }

  const tree1 = trees[0];
  const coordsTree1 = getCoords(tree1);

  animationId = requestAnimationFrame(startGame);

  function startGame() {
    treesAnimation();
    coinAnimation();
    animationId = requestAnimationFrame(startGame);
  }

  function treesAnimation() {
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i];
      const coords = treesCoords[i];

      let newYCoord = coords.y + speed;

      if (newYCoord > window.innerHeight) {
        newYCoord = -370;
      }

      treesCoords[i].y = newYCoord;
      tree.style.transform = `translate(${coords.x}px, ${newYCoord}px)`;
    }
  }

  function coinAnimation() {
    let newYCoord = coinCoord.y + speed;
    let newXCoord = coinCoord.x;

    if(newYCoord > window.innerHeight) {
      newYCoord = -100;

      const direction = parseInt(Math.random() * 2);
      const maxXCoord = (roadWidth + 1 - coinWidth);
      const randomXCoord = parseInt(Math.random() * maxXCoord);
  
    
      // if (direction === 0) {
      //   //Двигаем влево
      //   roadWidth;
      //   newXCoord = -randomXCoord;
      // } else if (direction === 1) {
      //   //Двигаем вправо
      //   newXCoord = randomXCoord;
      // }
  
      //Можно тернарным
  
      newXCoord = direction === 0 
      ? -randomXCoord 
      : randomXCoord;
    };


   

    coinCoord.y = newYCoord;
    coinCoord.x = newXCoord;
    coin.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
  }

  function getCoords(element) {
    const matrix = window.getComputedStyle(element).transform;
    const array = matrix.split(",");
    const y = array[array.length - 1];
    const x = array[array.length - 2];
    const numericY = parseFloat(y);
    const numericX = parseFloat(x);

    return { x: numericX, y: numericY };
  }

  const gameButton = document.querySelector(".game-button");

  gameButton.addEventListener("click", () => {
    isPause = !isPause;
    if (isPause) {
      cancelAnimationFrame(animationId);
      cancelAnimationFrame(carMoveInfo.top);
      cancelAnimationFrame(carMoveInfo.bottom);
      cancelAnimationFrame(carMoveInfo.left);
      cancelAnimationFrame(carMoveInfo.right);
      gameButton.children[0].style.display = "none";
      gameButton.children[1].style.display = "initial";
    } else {
      animationId = requestAnimationFrame(startGame);
      gameButton.children[0].style.display = "initial";
      gameButton.children[1].style.display = "none";
    }
  });
})();

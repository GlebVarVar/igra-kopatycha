import { Matrix4 } from "three";

function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

export const controls = {
  w: false,
  s: false,
  a: false,
  d: false,
  r: false,
  shift: false,
  n: false,  // добавляем новые клавиши
  m: false,
  v: false, // добавляем клавишу v
};

// В существующем обработчике событий добавим новые клавиши
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() in controls) {
    controls[e.key.toLowerCase()] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() in controls) {
    controls[e.key.toLowerCase()] = false;
  }
});

let maxVelocity = 0.04;
let jawVelocity = 0;
let pitchVelocity = 0;
let planeSpeed = 0.006;
export let turbo = 0;
export let cameraDistance = 0.3;

// Добавляем определение матрицы
export const delayedRotMatrix = new Matrix4();

// Добавляем глобальную переменную для отслеживания Shift
window.isShiftPressed = false;

// Добавляем слушатели для Shift
window.addEventListener("keydown", (e) => {
  if (e.key === "Shift") {
    window.isShiftPressed = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Shift") {
    window.isShiftPressed = false;
  }
});

export let isFirstPerson = false;

export function updatePlaneAxis(x, y, z, planePosition, camera) {
  jawVelocity *= 0.95;
  pitchVelocity *= 0.95;

  if (Math.abs(jawVelocity) > maxVelocity)
    jawVelocity = Math.sign(jawVelocity) * maxVelocity;

  if (Math.abs(pitchVelocity) > maxVelocity)
    pitchVelocity = Math.sign(pitchVelocity) * maxVelocity;

  if (controls["a"]) {
    jawVelocity += 0.0025;
  }

  if (controls["d"]) {
    jawVelocity -= 0.0025;
  }

  if (controls["w"]) {
    pitchVelocity -= 0.0025;
  }

  if (controls["s"]) {
    pitchVelocity += 0.0025;
  }

  if (controls["r"]) {
    jawVelocity = 0;
    pitchVelocity = 0;
    turbo = 0;
    x.set(1, 0, 0);
    y.set(0, 1, 0);
    z.set(0, 0, 1);
    planePosition.set(0, 3, 7);
  }

  x.applyAxisAngle(z, jawVelocity);
  y.applyAxisAngle(z, jawVelocity);

  y.applyAxisAngle(x, pitchVelocity);
  z.applyAxisAngle(x, pitchVelocity);

  x.normalize();
  y.normalize();
  z.normalize();

  // plane position & velocity
  if (controls.shift) {
    turbo += 0.025;
  } else {
    turbo *= 0.95;
  }
  turbo = Math.min(Math.max(turbo, 0), 1);

  let turboSpeed = easeOutQuad(turbo) * 0.02;

  camera.fov = 45 + turboSpeed * 900;
  camera.updateProjectionMatrix();

  planePosition.add(z.clone().multiplyScalar(-planeSpeed - turboSpeed));

  // Управление зумом камеры
 if (controls["n"]) {
    cameraDistance = Math.max(0.1, cameraDistance - 0.01); // приближение
  }
  if (controls["m"]) {
    cameraDistance = Math.min(1.0, cameraDistance + 0.01); // отдаление
  }

  // Переключение вида от первого лица
  if (controls["v"]) {
    isFirstPerson = !isFirstPerson;
    controls["v"] = false; // сбрасываем состояние клавиши
  }

  // Обновляем матрицу камеры с учетом вида от первого лица
  const cameraMatrix = new Matrix4()
    .multiply(
      new Matrix4().makeTranslation(
        planePosition.x,
        planePosition.y,
        planePosition.z
      )
    )
    .multiply(delayedRotMatrix);

  if (isFirstPerson) {
    // Вид от первого лица
    cameraMatrix.multiply(new Matrix4().makeTranslation(0, 0.1, 0));
  } else {
    // Обычный вид от третьего лица
    cameraMatrix
      .multiply(new Matrix4().makeRotationX(-0.2))
      .multiply(new Matrix4().makeTranslation(0, 0.015, cameraDistance));
  }

  camera.matrixAutoUpdate = false;
  camera.matrix.copy(cameraMatrix);
  camera.matrixWorldNeedsUpdate = true;
}

// Экспортируем cameraDistance длявозможности сброса при рестарте
export const resetCameraDistance = () => {
  cameraDistance = 0.3;
};

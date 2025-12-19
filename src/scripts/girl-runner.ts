// Girl Runner - 小人跟随引导角色
// 轻微跟随 + 朝向变化 + 跑步 bounce

const el = document.getElementById('girl-runner') as HTMLElement;

if (!el) {
  console.warn('Girl runner element not found');
} else {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let x = mouseX;
  let y = mouseY;

  const MAX_OFFSET = 20; // 小人距离鼠标的偏移量（20px）
  const LERP = 0.15; // 插值平滑度

  let isMoving = false;
  let bounceT = 0;
  let lastMouseX = mouseX;
  let lastMouseY = mouseY;

  // 跑步动画：定期翻转
  let runningFlipT = 0;
  let currentFacingDirection = 1; // 当前朝向（1 = 右，-1 = 左）
  const FLIP_INTERVAL = 6; // 每6帧翻转一次（约每0.1秒）

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // 计算鼠标移动方向
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    const mouseDist = Math.hypot(dx, dy);

    // 判断是否在移动
    if (mouseDist > 1) {
      isMoving = true;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    } else {
      isMoving = false;
    }

    // 计算目标位置（鼠标位置 - 偏移）
    let targetX = mouseX;
    let targetY = mouseY;

    if (MAX_OFFSET > 0 && isMoving) {
      const angle = Math.atan2(dy, dx);
      targetX = mouseX - Math.cos(angle) * MAX_OFFSET;
      targetY = mouseY - Math.sin(angle) * MAX_OFFSET;
    }

    // 平滑插值
    x += (targetX - x) * LERP;
    y += (targetY - y) * LERP;

    // 跑步上下 bounce
    if (isMoving) {
      bounceT += 0.15;

      // 跑步时定期翻转（模拟迈步）
      runningFlipT++;
      if (runningFlipT >= FLIP_INTERVAL) {
        runningFlipT = 0;
        currentFacingDirection *= -1; // 翻转朝向
      }
    } else {
      bounceT *= 0.9;
      runningFlipT = 0;

      // 静止时根据鼠标位置决定朝向
      currentFacingDirection = (mouseX - x) > 0 ? 1 : -1;
    }

    const bounce = Math.sin(bounceT) * 6;

    el.style.transform = `
      translate(${x}px, ${y}px)
      translate(-50%, -50%)
      translateY(${bounce}px)
      scaleX(${currentFacingDirection})
    `;

    requestAnimationFrame(animate);
  }

  animate();
}

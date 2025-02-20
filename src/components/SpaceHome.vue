<template>
  <!-- 主容器 -->
  <div class="space-container">
    <!-- 星空背景 -->
    <div class="stars">
      <!-- 使用 v-for 渲染星星 -->
      <div
        v-for="(star, index) in stars"
        :key="index"
        class="star"
        :style="{
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.opacity
        }"
      ></div>
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <!-- 标题和副标题 -->
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>
      <!-- 航天机构按钮组 -->
      <div class="space-buttons">
        <!-- 中国航天局按钮组 -->
        <div class="button-group" data-spacecraft="cnsa">
          <button 
            class="space-button cnsa" 
            @click="openLink('http://www.cnsa.gov.cn')"
          >
            中国航天局
            <div class="button-glow"></div>
          </button>
          <img 
            src="../assets/cnsa-logo.svg" 
            alt="CNSA Logo" 
            class="agency-logo cnsa-logo"
          />
        </div>
        <!-- NASA按钮组 -->
        <div class="button-group" data-spacecraft="nasa">
          <button 
            class="space-button nasa" 
            @click="openLink('https://www.nasa.gov')"
          >
            NASA
            <div class="button-glow"></div>
          </button>
          <img 
            src="https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg" 
            alt="NASA Logo" 
            class="agency-logo nasa-logo"
          />
        </div>
        <!-- SpaceX按钮组 -->
        <div class="button-group" data-spacecraft="spacex">
          <button 
            class="space-button spacex" 
            @click="openLink('https://www.spacex.com')"
          >
            SpaceX
            <div class="button-glow"></div>
          </button>
          <img 
            src="https://www.spacex.com/static/images/share.jpg" 
            alt="SpaceX Logo" 
            class="agency-logo spacex-logo"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 主容器样式 */
.space-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #0B0B1F 0%, #1A1A3A 100%);  /* 深空渐变背景 */
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

/* 星空容器样式 */
.stars {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

/* 单个星星样式 */
.star {
  position: absolute;
  background-color: #ffffff;
  border-radius: 50%;
  animation: twinkle 1s infinite alternate;  /* 星星闪烁动画 */
}

/* 星星闪烁动画关键帧 */
@keyframes twinkle {
  from { opacity: 0.2; }
  to { opacity: 1; }
}

/* 内容区域基础样式 */
.content {
  position: relative;
  z-index: 2;
}

/* 按钮区域样式 */
.space-buttons {
  position: relative;
  z-index: 3;
}

/* 内容区域布局样式 */
.content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ffffff;
  text-align: center;
}

/* 标题样式 */
.title {
  font-size: clamp(2.5rem, 6vw, 5rem);  /* 响应式字体大小 */
  margin-bottom: clamp(1.5rem, 3vw, 3rem);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);  /* 发光效果 */
  animation: fadeIn 2s ease-out;
}

/* 副标题样式 */
.subtitle {
  font-size: clamp(1.2rem, 3vw, 2rem);
  color: #8E8EFF;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
  animation: fadeIn 2s ease-out 0.5s backwards;
}

/* 淡入动画关键帧 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 按钮组容器样式 */
.space-buttons {
  display: flex;
  gap: clamp(1rem, 2vw, 2rem);  /* 响应式间距 */
  margin-bottom: clamp(2rem, 4vw, 4rem);
  z-index: 2;
}

/* 单个按钮组样式 */
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* 机构logo样式 */
.agency-logo {
  width: clamp(80px, 10vw, 120px);  /* 响应式宽度 */
  height: auto;
  border-radius: 8px;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.5s ease-out forwards;
}

/* 各机构logo动画延迟 */
.cnsa-logo {
  animation-delay: 0.3s;
}

.nasa-logo {
  animation-delay: 0.4s;
}

.spacex-logo {
  animation-delay: 0.5s;
}

/* logo淡入动画关键帧 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮基础样式 */
.space-button {
  position: relative;
  padding: clamp(0.8rem, 1.5vw, 1.2rem) clamp(1.5rem, 3vw, 2.5rem);  /* 响应式内边距 */
  font-size: clamp(1rem, 1.5vw, 1.3rem);  /* 响应式字体大小 */
  color: #ffffff;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 按钮光效装饰 */
.space-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

/* 按钮悬停光效动画 */
.space-button:hover::before {
  left: 100%;
}

/* 中国航天局按钮样式 */
.space-button.cnsa {
  border-color: #FF4D4D;
  box-shadow: 0 0 15px rgba(255, 77, 77, 0.3);
}

.space-button.cnsa:hover {
  background: rgba(255, 77, 77, 0.2);
  box-shadow: 0 0 20px rgba(255, 77, 77, 0.5);
}

/* NASA按钮样式 */
.space-button.nasa {
  border-color: #4D79FF;
  box-shadow: 0 0 15px rgba(77, 121, 255, 0.3);
}

.space-button.nasa:hover {
  background: rgba(77, 121, 255, 0.2);
  box-shadow: 0 0 20px rgba(77, 121, 255, 0.5);
}

/* SpaceX按钮样式 */
.space-button.spacex {
  border-color: #005288;
  box-shadow: 0 0 15px rgba(0, 82, 136, 0.3);
}

.space-button.spacex:hover {
  background: rgba(0, 82, 136, 0.2);
  box-shadow: 0 0 20px rgba(0, 82, 136, 0.5);
}

/* 按钮发光效果容器 */
.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

</style>
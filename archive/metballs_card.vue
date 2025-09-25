<template>
  <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-md mx-auto">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-medium text-gray-900">Metaballs</h3>
      <div class="text-xs text-gray-400 text-right leading-tight">
        <div>Click: Add</div>
        <div>Right: Remove</div>
        <div>Ctrl: Move</div>
      </div>
    </div>
    
    <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-inner">
      <canvas
        ref="canvas"
        class="w-full h-full cursor-crosshair transition-all duration-200"
        @click="handleClick"
        @contextmenu="handleRightClick"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
      />
      
      <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
    </div>
    
    <div class="mt-3 text-center">
      <span class="text-xs text-gray-500">{{ balls.length }} ball{{ balls.length !== 1 ? 's' : '' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const success = ref(false)
let webglContext = null
let vertexShader = null;
let fragmentShader = null;
let shaderProgram = null
let animationId = null
let isDragging = false
let dragIndex = -1

const balls = ref([
  { x: 0.25, y: 0.4, radius: 0.012, vx: 0.003, vy: 0.002 },
  { x: 0.75, y: 0.6, radius: 0.015, vx: -0.002, vy: 0.003 },
  { x: 0.5, y: 0.3, radius: 0.01, vx: 0.001, vy: -0.002 }
])

const shaders = {
  vertex: `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `,
  fragment: `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_balls[20];
    uniform int u_ballCount;
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      float sum = 0.0;
      
      for(int i = 0; i < 20; i++) {
        if(i >= u_ballCount) break;
        
        vec2 ballPos = u_balls[i].xy;
        float radius = u_balls[i].z;
        float dist = distance(uv, ballPos);
        sum += radius / (dist * dist + 0.005);
      }
      
      float threshold = 1.2;
      float alpha = smoothstep(threshold - 0.3, threshold + 0.1, sum);
      
      vec3 color1 = vec3(0.2, 0.8, 1.0);
      vec3 color2 = vec3(1.0, 0.3, 0.8);
      vec3 color3 = vec3(0.8, 0.2, 1.0);
      
      float colorMix1 = sin(u_time * 0.5 + uv.x * 3.14159) * 0.5 + 0.5;
      float colorMix2 = cos(u_time * 0.3 + uv.y * 3.14159) * 0.5 + 0.5;
      
      vec3 color = mix(mix(color1, color2, colorMix1), color3, colorMix2);
      
      float glow = smoothstep(threshold - 0.5, threshold - 0.2, sum) * 0.3;
      alpha = max(alpha, glow);
      
      gl_FragColor = vec4(color, alpha);
    }
  `
}

function initWebGL() {
  const canvasEl = canvas.value
  if (!canvasEl) return false
  
  webglContext = canvasEl.getContext('webgl')
  if (!webglContext) return false
  
  // Create and compile shaders
  vertexShader = webglContext.createShader(webglContext.VERTEX_SHADER)
  webglContext.shaderSource(vertexShader, shaders.vertex)
  webglContext.compileShader(vertexShader)
  
  fragmentShader = webglContext.createShader(webglContext.FRAGMENT_SHADER)
  webglContext.shaderSource(fragmentShader, shaders.fragment)
  webglContext.compileShader(fragmentShader)
  
  // Create program
  shaderProgram = webglContext.createProgram()
  webglContext.attachShader(shaderProgram, vertexShader)
  webglContext.attachShader(shaderProgram, fragmentShader)
  webglContext.linkProgram(shaderProgram)
  
  // Setup geometry
  const vertices = [-1, -1, 1, -1, -1, 1, 1, 1]
  const buffer = webglContext.createBuffer()
  webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffer)
  webglContext.bufferData(webglContext.ARRAY_BUFFER, new Float32Array(vertices), webglContext.STATIC_DRAW)
  
  // Setup blending
  webglContext.enable(webglContext.BLEND)
  webglContext.blendFunc(webglContext.SRC_ALPHA, webglContext.ONE_MINUS_SRC_ALPHA)
  
  return true
}

function animate() {
  if (!webglContext || !shaderProgram) return
  
  // Update ball positions
  balls.value.forEach(ball => {
    ball.x += ball.vx
    ball.y += ball.vy
    
    if (ball.x <= 0 || ball.x >= 1) ball.vx *= -1
    if (ball.y <= 0 || ball.y >= 1) ball.vy *= -1
    
    ball.x = Math.max(0, Math.min(1, ball.x))
    ball.y = Math.max(0, Math.min(1, ball.y))
  })
  
  // Render
  webglContext.viewport(0, 0, canvas.value.width, canvas.value.height)
  webglContext.clearColor(0, 0, 0, 0)
  webglContext.clear(webglContext.COLOR_BUFFER_BIT)
  
  webglContext.useProgram(shaderProgram)
  
  // Set uniforms
  const resolutionUniform = webglContext.getUniformLocation(shaderProgram, 'u_resolution')
  webglContext.uniform2f(resolutionUniform, canvas.value.width, canvas.value.height)
  
  const timeUniform = webglContext.getUniformLocation(shaderProgram, 'u_time')
  webglContext.uniform1f(timeUniform, Date.now() * 0.001)
  
  const ballCountUniform = webglContext.getUniformLocation(shaderProgram, 'u_ballCount')
  webglContext.uniform1i(ballCountUniform, balls.value.length)
  
  // Pass ball data
  for (let i = 0; i < Math.min(balls.value.length, 20); i++) {
    const ball = balls.value[i]
    const ballUniform = webglContext.getUniformLocation(shaderProgram, `u_balls[${i}]`)
    webglContext.uniform3f(ballUniform, ball.x, 1.0 - ball.y, ball.radius)
  }
  
  // Setup vertex attributes and draw
  const positionAttribute = webglContext.getAttribLocation(shaderProgram, 'a_position')
  webglContext.enableVertexAttribArray(positionAttribute)
  webglContext.vertexAttribPointer(positionAttribute, 2, webglContext.FLOAT, false, 0, 0)
  webglContext.drawArrays(webglContext.TRIANGLE_STRIP, 0, 4)
  
  animationId = requestAnimationFrame(animate)
}

function getMousePos(event) {
  const rect = canvas.value.getBoundingClientRect()
  return {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height
  }
}

function findBallAt(pos) {
  return balls.value.findIndex(ball => {
    const dist = Math.sqrt((ball.x - pos.x) ** 2 + (ball.y - pos.y) ** 2)
    return dist < ball.radius
  })
}

function handleClick(event) {
  if (event.ctrlKey) return
  
  const pos = getMousePos(event)
  balls.value.push({
    x: pos.x,
    y: pos.y,
    radius: 0.08 + Math.random() * 0.08,
    vx: (Math.random() - 0.5) * 0.004,
    vy: (Math.random() - 0.5) * 0.004
  })
}

function handleRightClick(event) {
  event.preventDefault()
  const pos = getMousePos(event)
  const ballIndex = findBallAt(pos)
  if (ballIndex !== -1) {
    balls.value.splice(ballIndex, 1)
  }
}

function handleMouseDown(event) {
  if (!event.ctrlKey) return
  const pos = getMousePos(event)
  const ballIndex = findBallAt(pos)
  if (ballIndex !== -1) {
    isDragging = true
    dragIndex = ballIndex
    canvas.value.style.cursor = 'grabbing'
  }
}

function handleMouseMove(event) {
  if (!isDragging || dragIndex === -1) return
  const pos = getMousePos(event)
  balls.value[dragIndex].x = pos.x
  balls.value[dragIndex].y = pos.y
  balls.value[dragIndex].vx = 0
  balls.value[dragIndex].vy = 0
}

function handleMouseUp() {
  if (isDragging && dragIndex !== -1) {
    balls.value[dragIndex].vx = (Math.random() - 0.5) * 0.004
    balls.value[dragIndex].vy = (Math.random() - 0.5) * 0.004
  }
  isDragging = false
  dragIndex = -1
  canvas.value.style.cursor = 'crosshair'
}

function resizeCanvas() {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  canvas.value.width = rect.width * window.devicePixelRatio
  canvas.value.height = rect.height * window.devicePixelRatio
}

onMounted(() => {
  resizeCanvas()
  success.value = initWebGL()
  if (success.value) {
    animate()
  }
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

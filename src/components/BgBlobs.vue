<template>
  <div class="absolute inset-0 pointer-events-none">
    <div class="blob blob-1 w-96 h-96 bg-primary/40 rounded-full -top-20 -left-20"></div>
    <div class="blob blob-2 w-80 h-80 bg-secondary/30 rounded-full top-40 right-20"></div>
    <div class="blob blob-3 w-72 h-72 bg-accent/30 rounded-full bottom-20 left-40"></div>
  </div>
</template>

<style scoped>
@keyframes blob1 {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(100px, -50px) scale(1.2); }
  66% { transform: translate(-50px, 50px) scale(0.8); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes blob2 {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-80px, 60px) scale(1.1); }
  66% { transform: translate(50px, -70px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes blob3 {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(60px, 80px) scale(1.3); }
  66% { transform: translate(-70px, -60px) scale(0.7); }
  100% { transform: translate(0, 0) scale(1); }
}
.blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.7;
  z-index: 10;
}
.blob-1 { animation: blob1 20s infinite ease-in-out; }
.blob-2 { animation: blob2 18s infinite ease-in-out; }
.blob-3 { animation: blob3 22s infinite ease-in-out; }
</style>
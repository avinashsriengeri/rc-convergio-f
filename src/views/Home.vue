<template>
  <main class="pt-12 min-h-screen w-full flex flex-col items-center bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500">
    <!-- Hero / Welcome Section -->
    <section class="flex flex-col items-center text-center py-16 w-full">
      <h1 class="text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
        Reliance Convergio
      </h1>
      <h2 class="text-xl md:text-2xl mb-6 text-gray-600 font-medium">
        Empowering Your Business
      </h2>
      <p class="text-gray-500 max-w-2xl px-6 leading-relaxed">
        We provide innovative solutions and strategies to help your business scale, transform, 
        and thrive in the modern digital landscape.
      </p>
    </section>

    <!-- Services Slideshow Section -->
    <section class="relative w-full max-w-4xl h-80 overflow-hidden rounded-2xl shadow-xl bg-white">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="absolute inset-0 flex flex-col justify-center items-center text-center px-6 py-8 transition-all duration-1000"
        :class="{
          'opacity-100 translate-x-0': currentSlide === index,
          'opacity-0 translate-x-12': currentSlide !== index
        }"
      >
        <img 
          :src="slide.image" 
          alt="Service" 
          class="w-24 h-24 object-cover mb-6 rounded-full shadow-md border border-gray-200" 
        />
        <h3 class="text-2xl font-semibold text-gray-800 mb-3">
          {{ slide.title }}
        </h3>
        <p class="text-gray-500 max-w-md leading-relaxed">
          {{ slide.description }}
        </p>
      </div>
    </section>

    <!-- Footer -->
    <Footer class="mt-16" />
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Footer from '../components/Footer.vue'

// Refined Slides
const slides = ref([
  {
    title: "Junior Minds",
    description: "Empowering the next generation with creative and scalable digital learning platforms.",
    image: "https://via.placeholder.com/120x120.png?text=Learning"
  },
  {
    title: "RC Book",
    description: "A smarter way to manage records with a secure and intuitive digital system.",
    image: "https://via.placeholder.com/120x120.png?text=Records"
  },
  {
    title: "Cybersecurity",
    description: "Comprehensive protection to safeguard your business from evolving threats.",
    image: "https://via.placeholder.com/120x120.png?text=Security"
  },
  {
    title: "Consulting Services",
    description: "Trusted experts offering guidance to innovate and drive business growth.",
    image: "https://via.placeholder.com/120x120.png?text=Consulting"
  }
])

const currentSlide = ref(0)
let slideInterval

onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
  }, 5000) // smoother, slower rotation (5s)
})

onUnmounted(() => {
  clearInterval(slideInterval)
})
</script>

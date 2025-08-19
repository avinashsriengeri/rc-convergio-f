<template>
  <main class="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#3c0b3c]">
    <!-- Animated Background Blobs -->
    <BgBlobs />

    <!-- Fullscreen Section -->
    <section
      class="pt-10 relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-12 bg-[#3c0b3c] backdrop-blur-2xl border border-gray-200 shadow-xl z-20"
    >
      <!-- Hero Text -->
      <div class="mb-1">
        <h1
          class="pt-6 text-3xl md:text-6xl font-extrabold mb-4 text-white tracking-tight drop-shadow-lg animate-hero-in"
        >
          RC Convergio
        </h1>
        <h2
          class="text-xl md:text-3xl mb-6 text-white font-semibold animate-subfade"
        >
          Empowering Your Business
        </h2>
        <p class="max-w-3xl mx-auto text-white text-lg leading-relaxed">
          We provide innovative solutions and strategies to help your business
          scale, transform, and thrive in the modern digital landscape.
        </p>
      </div>

      <!-- Slideshow -->
      <div class="relative mb-8 w-full  max-w-4xl h-96 rounded-3xl shadow-2xl bg-transparent overflow-hidden">
  <div
    v-for="(slide, index) in slides"
    :key="slide.title"
    class="absolute inset-0 flex flex-col justify-end items-center text-center transition-opacity duration-700"
    :class="{
      'opacity-100 pointer-events-auto': currentSlide === index,
      'opacity-0 pointer-events-none': currentSlide !== index
    }"
  >
    <!-- Background Image -->
    <img
      :src="slide.image"
      :alt="slide.title"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Overlay (optional for readability) -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- Text Content -->
    <div class="relative z-10 p-6">
      <h3 class="text-3xl font-semibold text-white mb-3 drop-shadow-lg">
        {{ slide.title }}
      </h3>
      <p class="text-white max-w-xl mx-auto leading-relaxed text-base drop-shadow-md">
        {{ slide.description }}
      </p>
    </div>
  </div>



        <!-- Navigation dots -->
        <div class="absolute bottom-2  left-0 right-0 flex justify-center gap-3">
          <button
            v-for="(slide, i) in slides"
            :key="i"
            class="h-3 w-3 rounded-full transition-all scale-50"
            :class="currentSlide === i ? 'bg-indigo-500 scale-60 shadow' : 'bg-gray-300'"
            @click="currentSlide = i"
            :aria-label="`Go to slide ${i + 1}`"
          ></button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer class="absolute bottom-4 z-30" />
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Footer from '../components/Footer.vue'
import BgBlobs from '../components/BgBlobs.vue'
import juniorMindsImg from "@/assets/junior-minds.png";

const slides = ref([
  {
    title: "Junior Minds",
    description: "Empowering the next generation with creative and scalable digital learning platforms.",
    image: juniorMindsImg
  },
  {
    title: "RC Book",
    description: "A smarter way to manage records with a secure and intuitive digital system.",
    image: "https://placehold.co/120x120?text=Records"
  },
  {
    title: "Cybersecurity",
    description: "Comprehensive protection to safeguard your business from evolving threats.",
    image: "https://placehold.co/120x120?text=Security"
  },
  {
    title: "Consulting Services",
    description: "Trusted experts offering guidance to innovate and drive business growth.",
    image: "https://placehold.co/120x120?text=Consulting"
  }
])

const currentSlide = ref(0)
let slideInterval

onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
  }, 5000)
})

onUnmounted(() => {
  clearInterval(slideInterval)
})
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes subfadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-hero-in {
  animation: fadeInUp 0.8s ease-out forwards;
}
.animate-subfade {
  animation: subfadeIn 1s ease-out 0.3s forwards;
  opacity: 0;
}
</style>
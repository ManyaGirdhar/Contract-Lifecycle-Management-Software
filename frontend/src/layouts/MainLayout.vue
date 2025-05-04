<template>
  <div>
    <Navbar />
    

    <!-- Main page content will be injected here -->
    <main>
      <router-view />
      <Footer />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>
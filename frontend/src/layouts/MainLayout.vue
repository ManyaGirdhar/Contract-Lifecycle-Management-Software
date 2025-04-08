<template>
  <div>
    <Navbar />

    <!-- Main page content will be injected here -->
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>
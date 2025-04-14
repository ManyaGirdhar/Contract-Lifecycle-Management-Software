<template>
    <nav class="bg-[#264e36] text-[#eafaf1] px-8 py-4 shadow-md flex justify-between items-center">
      <h1 class="text-2xl font-bold tracking-wide text-[#c8f7dc]">SMARTContract</h1>
      <div class="flex space-x-8">
        <RouterLink to="/" class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-[#b2f5cb]">Home</RouterLink>
        <RouterLink to="/request-contract" class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-[#b2f5cb]">Request Contract</RouterLink>
        <RouterLink to="/counterpartycontracts" class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-[#b2f5cb]">Contracts</RouterLink>
  
        <template v-if="!isLoggedIn">
          <RouterLink to="/account/login" class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-[#b2f5cb]">Login</RouterLink>
          <a href="https://three-korecent.frappe.cloud/register" class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-[#b2f5cb]">Register</a>
        </template>
  
        <template v-else>
          <button @click="handleLogout" class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-[#b2f5cb]">Logout</button>
        </template>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { session } from '@/data/session'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const isLoggedIn = computed(() => !!session.user)
  
  function handleLogout() {
    session.user = null
    session.logout.fetch()
    router.push({ name: 'Home' })
  }
  </script>  
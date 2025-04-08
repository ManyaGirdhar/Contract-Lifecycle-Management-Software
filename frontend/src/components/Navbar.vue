<template>
    <nav class="bg-[#1F2937] text-white px-8 py-4 shadow-lg flex justify-between items-center">
      <h1 class="text-2xl font-bold tracking-wide">SMARTContract</h1>
      <div class="flex space-x-8">
        <RouterLink
          to="/"
          class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-gray-300"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/request-contract"
          class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-gray-300"
        >
          Request Contract
        </RouterLink>
        <RouterLink
          to="/counterpartycontracts"
          class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-gray-300"
        >
          Contracts
        </RouterLink>
      </div>
    </nav>
  </template>
  
  <script setup>
  // Simple and elegant navbar with smooth button transitions on hover
  </script>  
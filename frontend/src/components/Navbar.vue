<template>
  <nav class="bg-[#fef9ef] px-20 py-1 shadow-md flex justify-between items-center">
    
    <!-- Logo wrapped in link with transition -->
    <RouterLink to="/" class="transform transition duration-300 hover:scale-110">
      <img
        src="@/assets/Inter/smartcontract_logo.png"
        
        alt="Smart Contract Logo"
        width="110"
        height="20"
        class="cursor-pointer"
      />
    </RouterLink>

    <!-- Navigation Links -->
    <div class="flex items-center space-x-8">
      <RouterLink to="/" class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-[#8B4513]">
        Home
      </RouterLink>
      <RouterLink to="https://three-korecent.frappe.cloud/request-contract" class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-[#8B4513]">
        Request Contract
      </RouterLink>
      <RouterLink to="/counterpartycontracts" class="transform transition duration-200 hover:-translate-y-1 hover:scale-105 hover:text-[#8B4513]">
        Contracts
      </RouterLink>

      <template v-if="!isLoggedIn">
        <!-- Login Button -->
        <RouterLink to="/account/login">
          <button
            class="px-4 py-1 border border-[#8B4513] rounded-md text-[#8B4513] font-semibold transition duration-200 hover:bg-[#8B4513] hover:text-white"
          >
            Login
          </button>
        </RouterLink>

        <!-- Register Button -->
        <a href="https://three-korecent.frappe.cloud/register" target="_blank">
          <button
            class="px-4 py-1 border border-[#8B4513] rounded-md text-[#8B4513] font-semibold transition duration-200 hover:bg-[#8B4513] hover:text-white"
          >
            Register
          </button>
        </a>
      </template>

      <template v-else>
        <button
          @click="handleLogout"
          class="px-4 py-1 border border-[#8B4513] rounded-md text-[#8B4513] font-semibold transition duration-200 hover:bg-[#8B4513] hover:text-white"
        >
          Logout
        </button>
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
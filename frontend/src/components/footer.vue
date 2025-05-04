<template>
  <footer class="bg-[#fef9ef] shadow-lg mt-24 border-t border-gray-300">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 items-start">
        
        <!-- Branding -->
        <div class="md:col-span-1 flex flex-col items-start space-y-3">
          <RouterLink to="/" class="transform transition duration-300 hover:scale-105">
            <img
              src="@/assets/Inter/smartcontract_logo.png"
              alt="Smart Contract Logo"
              class="h-14 w-auto"
            />
          </RouterLink>
          <h3 class="text-lg font-bold text-black">SMARTContract</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Contracts Anytime Anywhere.
          </p>
        </div>

        <!-- Company -->
        <div>
          <h4 class="text-sm font-semibold text-gray-800 uppercase tracking-wider">Company</h4>
          <ul class="mt-4 space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-gray-800 transition">About Us</a></li>
          </ul>
        </div>

        <!-- Product -->
        <div>
          <h4 class="text-sm font-semibold text-gray-800 uppercase tracking-wider">Product</h4>
          <ul class="mt-4 space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-gray-800 transition">Features</a></li>
            <li><a href="#" class="hover:text-gray-800 transition">Pricing</a></li>
            <li><a href="#" class="hover:text-gray-800 transition">Security</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="text-sm font-semibold text-gray-800 uppercase tracking-wider">Support</h4>
          <ul class="mt-4 space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-gray-800 transition">Help Center</a></li>
            <li><a href="#" class="hover:text-gray-800 transition">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="mt-12 border-t border-gray-300 pt-6 text-sm text-gray-500 text-center">
        &copy; 2025 SMARTContract. All rights reserved.
      </div>
    </div>
  </footer>
</template>


  
  <style scoped>
  html, body {
    height: 100%;
  }
  body {
    display: flex;
    flex-direction: column;
  }
  #app {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  footer {
    margin-top: auto;
  }
  </style>
  
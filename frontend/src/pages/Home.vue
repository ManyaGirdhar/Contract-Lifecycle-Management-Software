<template>
  <div class="bg-yellow-50 min-h-screen px-4 py-12">
    <!-- Hero Section -->
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        SMARTContract: 
        <span class="text-red-500">Contract Anytime, Anywhere</span>
      </h1>
      <p class="mt-4 text-gray-600 text-md">
        Manage your contract lifecycle from authoring to signature with precision and ease.
      </p>

      <div class="mt-8">
        <Button
          size="xl"
          theme="primary"
          class="px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition"
          @click="requestContract"
        >
          Request Contract
        </Button>
      </div>
    </div>

    <!-- Features Section -->
    <div class="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center max-w-6xl mx-auto">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="flex flex-col items-center group"
      >
        <div class="w-full overflow-hidden rounded-xl shadow hover:shadow-lg transition">
          <img
            :src="feature.image"
            class="w-full aspect-video object-cover transform group-hover:scale-105 transition duration-300"
            alt="feature image"
          />
        </div>
        <h3 class="mt-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {{ feature.title }}
        </h3>
      </div>
    </div>

    <!-- Why Section -->
    <div class="bg-white rounded-xl shadow-md p-8 mt-20 max-w-3xl mx-auto text-center">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">
        Why modern businesses need contract management software
      </h2>
      <p class="text-gray-600 text-base leading-relaxed">
        As businesses evolve, contract processes get complex. SMARTContract helps streamline the process from drafting to execution, ensuring compliance and reducing risks. With insightful dashboards and seamless collaboration, it's your all-in-one contract management solution.
      </p>
    </div>
  </div>
</template>

<script setup>
import { Button } from 'frappe-ui'

const features = [
  {
    title: "Authoring",
    image: "https://plus.unsplash.com/premium_photo-1661763119491-c0c6205a2163?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "Approval",
    image: "https://images.unsplash.com/photo-1636292651325-026a1b4cb23d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFwcHJvdmFsfGVufDB8fDB8fHww"
  },
  {
    title: "Negotiation",
    image: "https://plus.unsplash.com/premium_photo-1681995453325-455f7084888d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG5lZ290aWF0aW9ufGVufDB8fDB8fHww"
  },
  {
    title: "Signature",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMHNpZ25hdHVyZXxlbnwwfHwwfHx8MA%3D%3D"
  }
]

const requestContract = () => {
  window.open('request-contract', '_self') // or use router.push if using Vue Router
}
</script>

<style scoped>
/* Clean hover transform effect already handled via Tailwind in template */
</style>

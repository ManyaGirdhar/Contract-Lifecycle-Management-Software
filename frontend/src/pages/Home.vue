<template>
  <div class="bg-white min-h-screen">
    <!-- Hero Section -->
    <section class="h-screen flex flex-col justify-center px-4 max-w-6xl mx-auto text-center">
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
        Intelligent Contract 
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Lifecycle Management</span>
      </h1>
      <p class="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
        From request to signature - automated workflows, AI-powered insights, and seamless collaboration for legal teams.
      </p>
      
      <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
       <template v-if="!isLoggedIn">
        <RouterLink to="/account/login">
          <Button
            size="xl"
            class="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-xl transition-all"
          >
            Login
          </Button>
        </RouterLink>
        <a href="https://three-korecent.frappe.cloud/register" target="_blank">
          <Button
            size="xl"
            theme="secondary"
            class="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-blue-400 text-gray-800 hover:text-blue-600"
            @click="registerOrganization"
          >
            Register
          </Button>
        </a>
       </template>
        <template v-else>
          <Button
            size="xl"
            class="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-xl transition-all"
            @click="goToRequestForm"
          >
            Request Contract
          </Button>
        </template>
        <Button
          size="xl"
          theme="secondary"
          class="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-blue-400 text-gray-800 hover:text-blue-600"
          @click="showDemo"
        >
          Watch Demo
        </Button>
      </div>
      
      <div class="mt-16">
        <img src="@/assets/Inter/hero.jpeg" 
             alt="Contract workflow dashboard" 
             class="rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto">
      </div>
    </section>

    <!-- Workflow Visualization -->
    <section class="py-20 bg-gray-50 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">End-to-End Contract Lifecycle</h2>
          <p class="text-xl text-gray-600">Automated stages with intelligent notifications</p>
        </div>
        
        <div class="relative">
          <!-- Desktop workflow -->
          <div class="hidden md:flex justify-between items-center mb-12">
            <div v-for="(stage, index) in workflowStages" :key="index" 
                 class="text-center flex-1 relative">
              <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-md"
                   :class="getStageColor(stage)">
                <span class="text-white font-bold">{{ index + 1 }}</span>
              </div>
              <h4 class="mt-4 font-medium text-gray-800">{{ stage }}</h4>
              <div v-if="index < workflowStages.length - 1" class="absolute top-8 left-3/4 w-1/2 h-1 bg-gray-300"></div>
            </div>
          </div>
          
          <!-- Mobile workflow -->
          <div class="md:hidden space-y-8">
            <div v-for="(stage, index) in workflowStages" :key="index" 
                 class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center shadow-md"
                   :class="getStageColor(stage)">
                <span class="text-white font-bold">{{ index + 1 }}</span>
              </div>
              <div>
                <h4 class="font-medium text-gray-800">{{ stage }}</h4>
                <p class="mt-1 text-sm text-gray-600">{{ getStageDescription(stage) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Section -->
    <section class="py-20 px-4 max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Contract Management Features</h2>
        <p class="text-xl text-gray-600">Everything you need to streamline contract workflows</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
          <div class="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Smart Templates</h3>
          <p class="text-gray-600">Pre-built contract templates with customizable clauses for common agreements.</p>
        </div>
        
        <!-- Feature 2 -->
        <div class="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
          <div class="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">AI Summarization</h3>
          <p class="text-gray-600">Gemini-powered contract summaries highlighting key terms and obligations.</p>
        </div>
        
        <!-- Feature 3 -->
        <div class="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
          <div class="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Real-time Collaboration</h3>
          <p class="text-gray-600">Comment, negotiate, and track changes with counterparties in real-time.</p>
        </div>
        
        <!-- Feature 4 -->
        <div class="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
          <div class="bg-yellow-50 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Version Tracking</h3>
          <p class="text-gray-600">Complete redlining and version history with visual diff comparisons.</p>
        </div>
        
        <!-- Feature 5 -->
        <div class="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
          <div class="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Automated Approvals</h3>
          <p class="text-gray-600">Custom approval workflows with conditional routing for each contract type.</p>
        </div>
        
        <!-- Feature 6 - Documenso Integration -->
        <div class="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100">
          <div class="bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center mb-5">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-3">eSignatures with Documenso</h3>
          <p class="text-gray-600">Legally-binding signatures with full audit trail and identity verification.</p>
        </div>
      </div>
    </section>

    <!-- Documenso Integration Section -->
    <section class="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2">
            <img src="@/assets/Inter/documenso.webp" 
                 alt="Documenso eSignature integration" 
                 class="rounded-2xl shadow-xl border border-gray-200 w-full">
          </div>
          <div class="md:w-1/2">
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium">Documenso Integration</span>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Seamless eSignatures Built In</h2>
            <p class="text-lg text-gray-600 mb-6">
              Our native integration with Documenso provides legally-binding electronic signatures with full audit trails, identity verification, and automatic document storage.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">One-click signature requests</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">Multi-party signing workflows</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">Automatic contract activation</span>
              </li>
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">Compliant with global eSignature laws</span>
              </li>
            </ul>
            <Button
              size="lg"
              class="px-6 py-3 font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-md"
              @click="showSigningDemo"
            >
              See Signing Demo
            </Button>
          </div>
        </div>
      </div>
    </section>


    <!-- Final CTA -->
<section class="py-20 bg-gradient-to-br from-gray-900 to-gray-800 px-4">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Revolutionize Your Contract Workflow</h2>
    <p class="text-xl text-gray-300 mb-8">Discover how streamlined contract management can save time and reduce complexity for your team.</p>
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <Button
        size="xl"
        class="px-8 py-4 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 shadow-md"
        @click="registerOrganization"
      >
        Start Your Journey
      </Button>
      <Button
        size="xl"
        theme="secondary"
        class="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:bg-opacity-10"
        @click="showDemo"
      >
        Request Demo
      </Button>
    </div>
    <p class="mt-6 text-sm text-gray-400">No commitment required. Explore at your own pace.</p>
  </div>
</section>

  </div>
</template>

<script setup>
import { Button } from 'frappe-ui'
import { ref } from 'vue'
import { computed } from 'vue'
import { session } from '@/data/session'

const goToRequestForm = () => {
  window.location.href = "https://three-korecent.frappe.cloud/request-contract"
}

const isLoggedIn = computed(() => !!session.user)


const workflowStages = ref([
  'Request',
  'Draft',
  'Approval',
  'Negotiation',
  'Legal Review',
  'Modified',
  'Final Approval',
  'Awaiting Sign.',
  'Active',
  'Expired'
])

const getStageColor = (stage) => {
  const colors = {
    'Request': 'bg-blue-500',
    'Draft': 'bg-purple-500',
    'Approval': 'bg-yellow-500',
    'Negotiation': 'bg-orange-500',
    'Legal Review': 'bg-violet-500',
    'Modified': 'bg-pink-500',
    'Final Approval': 'bg-green-500',
    'Awaiting Sign.': 'bg-red-500',
    'Active': 'bg-teal-500',
    'Expired': 'bg-gray-500'
  }
  return colors[stage] || 'bg-gray-500'
}

const getStageDescription = (stage) => {
  const descriptions = {
    'Request': 'Counterparty submits contract request',
    'Draft': 'Contract manager creates initial draft',
    'Approval': 'Internal stakeholders review',
    'Negotiation': 'Parties discuss terms',
    'Legal Review': 'Legal team examines clauses',
    'Modified': 'Contract updated based on feedback',
    'Final Approval': 'Last internal sign-off',
    'Awaiting Signature': 'Sent for external signing',
    'Active': 'Contract is now executed',
    'Expired/Archived': 'Contract completed or terminated'
  }
  return descriptions[stage] || ''
}

const registerOrganization = () => {
  // Implement registration logic
  console.log("Redirect to registration")
}

const showDemo = () => {
  // Implement demo modal logic
  console.log("Show demo modal")
}

const showSigningDemo = () => {
  // Implement signing demo logic
  console.log("Show signing demo")
}


</script>

<style scoped>
/* Smooth hover animations */
.hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-scale:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Gradient text animation */
.bg-gradient-to-r {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}
@keyframes gradient {
  0% { background-position: 0% center; }
  50% { background-position: 100% center; }
  100% { background-position: 0% center; }
}

/* Ensure hero section takes full viewport height */
section.h-screen {
  min-height: 100vh;
  padding-top: 80px; /* Adjust if you have a fixed header */
  padding-bottom: 80px;
}
</style>
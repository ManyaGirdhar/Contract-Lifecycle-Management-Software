<template>
    <div class="min-h-screen bg-gray-100 flex justify-center p-6">
      <div class="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 relative">
        <h1 class="text-3xl font-bold text-gray-800 text-center mb-4">
          Contract Version Details
        </h1>
  
        <div v-if="contractVersion">
          <p class="text-gray-600 mt-2">
            <strong>Version:</strong> {{ contractVersion.name }}
          </p>
          <p class="text-gray-600 mt-2">
            <strong>Created:</strong> {{ contractVersion.created_on }}
          </p>
  
          <!-- Display Redlined Content -->
          <div
            v-html="contractVersion.redlined_contract || 'No redlined content available.'"
            class="prose max-w-none mt-4"
          ></div>
        </div>
        <div v-else class="text-center text-gray-500">
          Loading contract version details...
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ContractVersionDetails',
    data() {
      return {
        contractVersion: null
      };
    },
    mounted() {
      this.fetchContractVersionDetails();
    },
    methods: {
      async fetchContractVersionDetails() {
        const versionId = this.$route.params.versionId;
        try {
          const response = await fetch(`/api/resource/Contract Version/${versionId}`, {
            credentials: 'include'
          });
  
          const data = await response.json();
  
          if (data.data) {
            this.contractVersion = data.data;
          }
        } catch (error) {
          console.error('Error fetching contract version details:', error);
        }
      }
    }
  };
  </script>  
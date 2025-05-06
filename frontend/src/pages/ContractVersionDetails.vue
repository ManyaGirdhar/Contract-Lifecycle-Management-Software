<template>
  <div class="min-h-screen bg-gray-100 flex justify-center p-6">
    <div class="w-full max-w-9xl bg-white shadow-lg rounded-lg p-6 relative">
      <button
        class="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition"
        @click="goBack"
        title="Back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

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
        <p class="text-gray-600 mt-2">
          <strong>Change Log:</strong> {{ contractVersion.change_log }}
        </p>

        
          <div class="text-gray-600 mt-2">
            <strong>Content:</strong>
        <div
          v-html="contractVersion.redlined_contract || 'No redlined content available.'"
          class="prose max-w-none mt-4"
        ></div>
      </div>
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
  props: {
    name: String,
    versionId: String,
  },
  data() {
    return {
      contractVersion: null,
    };
  },
  mounted() {
    this.fetchContractVersionDetails();
  },
  methods: {
    async fetchContractVersionDetails() {
      try {
        const response = await fetch(
          `/api/resource/Contract Version/${this.versionId}`,
          { credentials: 'include' }
        );
        const data = await response.json();
        if (data.data) {
          this.contractVersion = data.data;
        }
      } catch (error) {
        console.error('Error fetching contract version details:', error);
      }
    },
    goBack() {
      const contractName = this.$route.params.name;
      this.$router.push({
        name: 'ContractDetails',
        params: { name: contractName }
      });
    }
  },
};
</script>

<template>
  <div class="container mx-auto max-w-2xl p-6 bg-white shadow-xl rounded-2xl mt-10">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">📝 Submit a Contract Request</h2>
    <form @submit.prevent="submitRequest" class="space-y-6">

      <!-- Contract Type -->
      <div>
        <label class="block mb-2 text-sm font-semibold text-gray-700">Contract Type</label>
        <select v-model="contract.contract_type" required class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option disabled value="">Select contract type</option>
          <option>Fixed Term</option>
          <option>Permanent</option>
          <option>Freelancer</option>
          <option>Other</option>
        </select>
      </div>

      <!-- Title -->
      <div>
        <label class="block mb-2 text-sm font-semibold text-gray-700">Title</label>
        <input
          v-model="contract.title"
          type="text"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter contract title"
        />
      </div>

      <!-- Contract Duration -->
      <div>
        <label class="block mb-2 text-sm font-semibold text-gray-700">Contract Duration (in months)</label>
        <input
          v-model.number="contract.contract_duration"
          type="number"
          required
          min="1"
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Requester Type -->
      <div>
        <label class="block mb-2 text-sm font-semibold text-gray-700">Requester Type</label>
        <select v-model="contract.requester_type" required class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option disabled value="">Select type</option>
          <option>Individual</option>
          <option>Organization</option>
        </select>
      </div>

      <!-- Requester Name -->
      <div v-if="contract.requester_type">
        <label class="block mb-2 text-sm font-semibold text-gray-700">
          {{ contract.requester_type === 'Organization' ? 'Organization Name' : 'Name' }}
        </label>
        <input
          v-model="contract.requester_name"
          type="text"
          required
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter name"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block mb-2 text-sm font-semibold text-gray-700">Description</label>
        <textarea
          v-model="contract.description"
          required
          rows="4"
          class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description of the contract"
        ></textarea>
      </div>

      <!-- Submit -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const contract = ref({
  contract_type: '',
  title: '',
  contract_duration: null,
  requester_type: '',
  requester_name: '',
  description: '',
  requester_email: ''
});

// Fetch current user's email
const fetchCurrentUserEmail = async () => {
  try {
    const res = await fetch('/api/method/frappe.auth.get_logged_user');
    const { message: user } = await res.json();

    const userRes = await fetch(`/api/resource/User/${user}`);
    const { data: userDoc } = await userRes.json();

    contract.value.requester_email = userDoc.email;
  } catch (err) {
    alert("❌ Couldn't fetch current user");
    console.error(err);
  }
};

onMounted(() => {
  fetchCurrentUserEmail();
});

const submitRequest = async () => {
  try {
    const res = await fetch('/api/resource/Contract Request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contract.value)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create Contract Request');
    }

    const data = await res.json();
    alert(`✅ Contract Request created: ${data.data.name}`);
    router.push('/counterpartycontracts');
  } catch (err) {
    alert(`❌ Error: ${err.message}`);
  }
};
</script>
<template>
  <div class="container mx-auto max-w-4xl p-8 bg-[#8B4513] shadow-2xl rounded-2xl mt-10 text-slate-100 font-inter">
    <h2 class="text-3xl font-bold text-white mb-8 text-center">📄 Submit a Contract Request</h2>

    <form @submit.prevent="submitRequest" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Contract Type -->
        <div>
          <label class="block mb-2 text-sm font-medium text-white">Contract Type</label>
          <select v-model="contract.contract_type" required class="form-control w-full bg-slate-900 text-slate-100 rounded-lg">
            <option disabled value="">Select contract type</option>
            <option>Employment Contract</option>
            <option>Business & Commercial Contract</option>
            <option>Service Contract</option>
            <option>Real Estate Contract</option>
            <option>Financial Contract</option>
            <option>Confidentiality & Non-Disclosure Contract</option>
            <option>Sales & Marketing Contract</option>
            <option>Intellectual Property Contract</option>
            <option>Investment & Partnership Contract</option>
            <option>Legal & Government Contract</option>
          </select>
        </div>

        <!-- Title -->
        <div>
          <label class="block mb-2 text-sm font-medium text-white">Title</label>
          <input v-model="contract.title" type="text" required class="form-control w-full bg-slate-900 text-slate-100 rounded-lg" placeholder="Enter contract title" />
        </div>

        <!-- Description -->
        <div>
          <label class="block mb-2 text-sm font-medium text-white">Description</label>
          <textarea v-model="contract.description" required rows="8" class="form-control w-full bg-slate-900 text-slate-100 rounded-lg resize-none" placeholder="Enter description of the contract"></textarea>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Contract Term -->
        <div>
          <label class="block mb-2 text-sm font-medium text-white">Contract Term</label>
          <select v-model="contract.contract_term" required class="form-control w-full bg-slate-900 text-slate-100 rounded-lg">
            <option disabled value="">Select contract term</option>
            <option>Definite</option>
            <option>Indefinite</option>
          </select>
        </div>

        <!-- Contract Duration -->
        <div v-if="contract.contract_term === 'Definite'">
          <label class="block mb-2 text-sm font-medium text-white">Contract Duration (in months)</label>
          <input v-model.number="contract.contract_duration" type="number" min="1" required class="form-control w-full bg-slate-900 text-slate-100 rounded-lg" />
        </div>

        <!-- Contract Effective Date -->
        <div>
          <label class="block mb-2 text-sm font-medium text-white">Contract Effective Date</label>
          <input v-model="contract.contract_effective_date" type="date" required class="form-control w-full bg-slate-900 text-slate-100 rounded-lg" />
        </div>

        <!-- Termination Clause Summary -->
        <div v-if="contract.contract_term === 'Indefinite'">
          <label class="block mb-2 text-sm font-medium text-white">Termination Clause Summary</label>
          <textarea v-model="contract.termination_clause_summary" rows="4" required class="form-control w-full bg-slate-900 text-slate-100 rounded-lg resize-none" placeholder="Enter termination clause summary"></textarea>
        </div>
      </div>
    </form>

    <!-- Submit Button Outside Form -->
    
  </div>
  <div class="text-right mt-8">
      <button type="submit" @click="submitRequest" class="w-auto bg-black hover:bg-gray-800 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition-all duration-300">
        Submit
      </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const contract = ref({
  contract_type: '',
  title: '',
  contract_term: '',
  contract_duration: null,
  contract_effective_date: '',
  termination_clause_summary: '',
  requester_email: '',
  description: ''
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
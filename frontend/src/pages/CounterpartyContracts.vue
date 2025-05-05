<template>
    <div class="min-h-screen bg-gray-100 flex justify-center p-6">
        <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-3xl font-bold text-gray-800">Contracts</h1>

                <div class="flex items-center space-x-2">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="🔍 Search"
                        class="px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                    />
                    <Button
                        size="xl"
                        theme="primary"
                        class="px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition bg-[#8B4513] text-white hover:bg-[#5C4033]"
                        @click="goToRequestForm"
                    >
                        Request Contract
                    </Button>
                </div>
            </div>
  
            <ul v-if="filteredContracts.length" class="space-y-4">
                <li
                    v-for="contract in filteredContracts"
                    :key="contract.name"
                    class="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm flex justify-between items-center cursor-pointer hover:bg-blue-100 transition"
                    @click="goToContract(contract.name)"
                >
                    <span class="text-lg font-semibold text-gray-700">{{ contract.name }}</span>
                    <span
                        class="px-3 py-1 text-sm font-medium rounded-full"
                        :class="{
                            'bg-green-200 text-green-800': contract.workflow_state === 'Approved',
                            'bg-red-200 text-red-800': contract.workflow_state === 'Rejected'
                        }"
                    >
                        {{ contract.workflow_state }}
                    </span>
                </li>
            </ul>
  
            <p v-else class="text-gray-600 text-center">No contracts match your search.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "CounterpartyContracts",

    data() {
        return {
            contracts: [],
            userEmail: null,
            userRoles: [],
            searchQuery: ""
        };
    },

    async mounted() {
        await this.getUserInfo();
        if (this.userEmail) {
            this.fetchContracts();
        }
    },

    computed: {
        filteredContracts() {
            if (!this.searchQuery) return this.contracts;
            const q = this.searchQuery.toLowerCase();
            return this.contracts.filter(c => c.name.toLowerCase().includes(q));
        }
    },

    methods: {
        async getUserInfo() {
            try {
                // Get logged-in user's email
                const response = await fetch("/api/method/frappe.auth.get_logged_user");
                const { message: email } = await response.json();
                this.userEmail = email;

                // Get user's uid
                const uidResponse = await fetch("/api/method/frappe.auth.get_logged_user");
                const { message: uid } = await uidResponse.json();  // Ensure this returns a 'uid'
                
                // Get roles via frappe.desk.permission.get_roles
                const rolesRes = await fetch(`/api/method/frappe.core.doctype.user.user.get_roles?uid=${uid}`);
                const rolesJson = await rolesRes.json();
                this.userRoles = rolesJson.message || [];
            } catch (error) {
                console.error("❌ Error fetching user info:", error);
            }
        },

        async fetchContracts() {
            try {
                const response = await fetch('/api/resource/Contract?fields=["name","workflow_state","counterparty_email","legal_member_email"]&limit_page_length=100');
                if (!response.ok) throw new Error('Failed to fetch contracts');

                const data = await response.json();
                const allowedStates = [
                    "In negotiation",
                    "Legal Review",
                    "Modified",
                    "Final Approval",
                    "Negotiated",
                    "Awaiting Signature",
                    "Active",
                    "Rejected"
                ];

                if (data.data && Array.isArray(data.data)) {
                    // Check if the user is part of "CounterParty Legal Team"
                    const isLegalTeam = this.userRoles.includes("CounterParty Legal Team");
                    const isCounterparty = this.userRoles.includes("CounterParty");

                    this.contracts = data.data.filter(contract => {
                        const stateAllowed = allowedStates.includes(contract.workflow_state);

                        if (isLegalTeam) {
                            return contract.workflow_state === "Legal Review" && contract.legal_member_email === this.userEmail && stateAllowed;
                        }
                        
                        if (isCounterparty) {
                            return contract.counterparty_email === this.userEmail && stateAllowed;
                        }
                    });
                }
            } catch (error) {
                console.error("❌ Error fetching contracts:", error);
            }
        },

        goToContract(contractName) {
            this.$router.push(`/contract/${contractName}`);
        },

        goToRequestForm() {
        window.location.href = "https://three-korecent.frappe.cloud/request-contract";
    }
    }
};
</script>
<template>
    <div class="min-h-screen bg-gray-100 flex justify-center p-6">
        <div class="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 relative">
            <div v-if="contract" class="relative mb-4">
                <h1 class="text-3xl font-bold text-gray-800 text-center">
                    {{ contract.title || 'Contract Title' }}
                </h1>

                <button v-if="['Legal Review', 'In negotiation'].includes(contract.workflow_state)"
                    class="absolute top-0 right-0 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                    @click="updateWorkflowState('Final Approval')">
                    Approve
                </button>
            </div>

            <h1 v-else class="text-3xl font-bold text-gray-800 mb-4 text-center">
                Loading...
            </h1>

            <div v-if="contract">
                <p class="text-gray-600 mt-2"><strong>Status:</strong> {{ contract.workflow_state }}</p>
                <p class="text-gray-600 mt-2"><strong>Content:</strong> {{ contract.content || 'No details available.' }}</p>

                <div class="mt-6 flex flex-wrap gap-4">
                    <button v-if="contract.workflow_state === 'Modified'"
                        class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        @click="updateWorkflowState('Send Back to Negotiation')">
                        Request Changes
                    </button>
                </div>

                <button v-if="!['Active', 'Rejected', 'Modified'].includes(contract.workflow_state)"
                    class="absolute bottom-6 right-6 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    @click="updateWorkflowState('Rejected')">
                    Reject
                </button>

                <Comments v-if="!['Active', 'Rejected', 'Awaiting Signature'].includes(contract.workflow_state)"
                    :doctype="'Contract'" :docname="contract.name" />
            </div>

            <div v-else class="text-center text-gray-500">
                Loading contract details...
            </div>

            <button class="absolute top-6 left-6 text-gray-600 hover:text-gray-800 transition"
                @click="$router.push('/counterpartycontracts')" title="Back">

                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import Comments from '@/components/Comments.vue';

export default {
    name: "ContractDetails",
    components: {
        Comments
    },

    data() {
        return {
            contract: null
        };
    },

    mounted() {
        this.fetchContract();
    },

    methods: {
        async fetchContract() {
            const contractName = this.$route.params.name;

            try {
                const response = await fetch(`/api/resource/Contract/${contractName}`, {
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.data) {
                    this.contract = data.data;
                }
            }

            catch (error) {
                console.error("Error fetching contract details:", error);
            }
        },

        async updateWorkflowState(action) {
            if (!this.contract) return;

            try {
                const response = await fetch(`/api/method/frappe.model.workflow.apply_workflow`, {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    credentials: 'include',

                    body: JSON.stringify({
                        doc: {
                            doctype: "Contract",
                            name: this.contract.name
                        },

                        action: action
                    })
                });

                const result = await response.json();

                if (result.message) {
                    this.contract.workflow_state = result.message.workflow_state;
                    console.log("Workflow updated to:", result.message.workflow_state);
                }
                
                else {
                    let errorMsg = "Unexpected error occurred.";

                    if (result._server_messages) {
                        const serverMessages = JSON.parse(result._server_messages);
                        errorMsg = serverMessages.map(msg => JSON.parse(msg).message).join('\n');
                    }

                    alert(errorMsg);
                    console.warn("Unexpected response:", result);
                }
            }

            catch (error) {
                console.error("Error updating workflow state:", error);
                alert("Something went wrong while updating the workflow.");
            }
        }
    }
};
</script>
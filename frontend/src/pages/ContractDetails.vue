<template>
    <div class="min-h-screen bg-gray-100 flex justify-center p-6">
      <div class="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 relative">
        <div v-if="contract" class="relative mb-4">
          <h1 class="text-3xl font-bold text-gray-800 text-center">
            {{ contract.title || 'Contract Title' }}
          </h1>
  
          <div class="absolute top-0 right-0 flex gap-2 items-center">
            <!-- Toggle Versions Button -->
            <button
              @click="showVersions = !showVersions"
              class="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition"
              title="Toggle Contract Versions"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-12.75a.75.75 0 00-1.5 0v4a.75.75 0 00.356.637l2.5 1.5a.75.75 0 10.738-1.288L10.75 9.25V5.25z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <span class="text-sm text-blue-600 font-medium">
              {{ showVersions ? 'Hide Versions' : 'Show Versions' }}
            </span>
  
            <button
              v-if="contract.workflow_state === 'In negotiation'"
              class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
              @click="updateWorkflowState('Send to Legal')"
            >
              Send for Legal Review
            </button>
  
            <button
              v-if="['Legal Review', 'In negotiation', 'Modified'].includes(contract.workflow_state)"
              class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
              @click="updateWorkflowState('Final Approval')"
            >
              Approve
            </button>
          </div>
        </div>
  
        <h1 v-else class="text-3xl font-bold text-gray-800 mb-4 text-center">
          Loading...
        </h1>
  
        <div v-if="contract">
          <p class="text-gray-600 mt-2">
            <strong>Status:</strong> {{ contract.workflow_state }}
          </p>
          <div class="text-gray-600 mt-2">
            <strong>Content:</strong>
            <div
              v-html="contract.content || 'No details available.'"
              class="prose max-w-none mt-1"
            ></div>
          </div>
  
          <!-- CONTRACT VERSIONS -->
          <div v-if="showVersions && contractVersions.length" class="mt-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Contract Versions</h2>
            <ul class="space-y-2">
              <li
                v-for="version in contractVersions"
                :key="version.name"
                class="p-3 bg-gray-50 rounded shadow-sm"
              >
                <p class="text-sm text-gray-700">
                  <strong>Version:</strong> {{ version.name }} |
                  <strong>Created:</strong>
                  {{ version.created_on ? new Date(version.created_on.replace(' ', 'T')).toLocaleString() : 'N/A' }}
                </p>
                <div v-html="version.content" class="prose max-w-none mt-2 text-sm"></div>
              </li>
            </ul>
          </div>
  
          <button
            v-if="!['Active', 'Rejected', 'Awaiting Signature'].includes(contract.workflow_state)"
            class="absolute bottom-6 right-6 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
            @click="updateWorkflowState('Rejected')"
          >
            Reject
          </button>
  
          <Comments
            v-if="!['Active', 'Rejected', 'Awaiting Signature'].includes(contract.workflow_state)"
            :doctype="'Contract'"
            :docname="contract.name"
            @comment-added="handleComment"
          />
        </div>
  
        <div v-else class="text-center text-gray-500">
          Loading contract details...
        </div>
  
        <button
          class="absolute top-6 left-6 text-gray-600 hover:text-gray-800 transition"
          @click="$router.push('/counterpartycontracts')"
          title="Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import Comments from '@/components/Comments.vue';
  
  export default {
    name: 'ContractDetails',
    components: {
      Comments
    },
  
    data() {
      return {
        contract: null,
        contractVersions: [],
        showVersions: false // 👈 added toggle state
      };
    },
  
    mounted() {
      this.fetchContract();
    },
  
    methods: {
      async handleComment() {
        if (this.contract.workflow_state === 'Modified') {
          await this.updateWorkflowState('Send Back to Negotiation');
        }
      },
  
      async fetchContract() {
        const contractName = this.$route.params.name;
  
        try {
          const response = await fetch(`/api/resource/Contract/${contractName}`, {
            credentials: 'include'
          });
  
          const data = await response.json();
  
          if (data.data) {
            this.contract = data.data;
            this.fetchContractVersions(contractName);
          }
        } catch (error) {
          console.error('Error fetching contract details:', error);
        }
      },
  
      async fetchContractVersions(contractName) {
        try {
          const response = await fetch(
            `/api/resource/Contract Version?filters=[["contract","=","${contractName}"]] +
              &fields=["name", "created_on", "change_log"]&order_by=created_on desc`,
            {
              credentials: 'include'
            }
          );
  
          const data = await response.json();
  
          if (data.data) {
            this.contractVersions = data.data;
          }
        } catch (error) {
          console.error('Error fetching contract versions:', error);
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
                doctype: 'Contract',
                name: this.contract.name
              },
              action: action
            })
          });
  
          const result = await response.json();
  
          if (result.message) {
            this.contract.workflow_state = result.message.workflow_state;
          } else {
            let errorMsg = 'Unexpected error occurred.';
  
            if (result._server_messages) {
              const serverMessages = JSON.parse(result._server_messages);
              errorMsg = serverMessages.map((msg) => JSON.parse(msg).message).join('\n');
            }
  
            alert(errorMsg);
            console.warn('Unexpected response:', result);
          }
        } catch (error) {
          console.error('Error updating workflow state:', error);
          alert('Something went wrong while updating the workflow.');
        }
      }
    }
  };
  </script>
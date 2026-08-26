<template>
	<div class="min-h-screen bg-gray-100 flex justify-center p-6">
		<div class="w-full max-w-9xl bg-white shadow-lg rounded-lg p-6 relative">
			<div v-if="contract" class="relative mb-4">
				<h1 class="text-3xl font-bold text-gray-800 text-center">
					{{ contract.title || 'Contract Title' }}
				</h1>

				<div class="absolute top-0 right-0 flex gap-2 items-center">
					<Button @click="showVersions = !showVersions" class="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition" title="Toggle Contract Versions">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-12.75a.75.75 0 00-1.5 0v4a.75.75 0 00.356.637l2.5 1.5a.75.75 0 10.738-1.288L10.75 9.25V5.25z" clip-rule="evenodd" />
						</svg>
					</Button>
					<span class="text-sm text-blue-600 font-medium">
						{{ showVersions ? 'Hide Versions' : 'Show Versions' }}
					</span>

					<Button v-if="contract.workflow_state === 'In Negotiation'" class="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition" @click="updateWorkflowState('Send to Legal')">
						Send for Legal Review
					</Button>

					<Button v-if="['Legal Review', 'In Negotiation', 'Modified'].includes(contract.workflow_state) && ['CounterParty', 'Signee'].some(role => userRoles.includes(role))" class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition" @click="updateWorkflowState('Final Approval')">
						Approve
					</Button>
				</div>
			</div>

			<h1 v-else class="text-3xl font-bold text-gray-800 mb-4 text-center">
				Loading...
			</h1>

			<div v-if="contract">
				<div class="flex items-center gap-2 mt-3">
					<span class="font-semibold">Status</span>
					<span
						class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
						{{ contract.workflow_state }}
					</span>
				</div>
				<div class="text-gray-600 mt-2">
					<strong>Content:</strong>
					<div v-html="contract.content || 'No details available.'" class="prose max-w-none mt-1"></div>
				</div>

				<div v-if="showVersions && contractVersions.length" class="mt-6">
					<h2 class="text-xl font-semibold text-gray-800 mb-4">Contract Versions</h2>
					<ul class="space-y-4">
						<li v-for="version in contractVersions" :key="version.name" class="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm cursor-pointer hover:bg-blue-100 transition" @click="goToVersionDetails(version.name, contract.name)">
							<div class="flex justify-between items-start">
								<div class="text-gray-700 flex">
									<span class="text-lg font-semibold text-gray-700">Version: {{ version.name }}</span>
									<span class="ml-auto px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-700">
										Created: {{ version.created_on ? new Date(version.created_on.replace(' ', 'T')).toLocaleString() : 'N/A' }}
									</span>
								</div>
							</div>
							<div v-html="version.content" class="prose max-w-none mt-2 text-sm"></div>
						</li>
					</ul>
				</div>

				<Button v-if="'Awaiting Signature'.includes(contract.workflow_state) && userRoles.includes('Signee')" class="absolute bottom-6 right-6 px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition" @click="handleSignClick">
					Sign
				</Button>

				<Button v-if="!['Active', 'Rejected', 'Awaiting Signature'].includes(contract.workflow_state) && ['CounterParty', 'Signee'].some(role => userRoles.includes(role))" class="absolute bottom-6 right-6 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition" @click="updateWorkflowState('Rejected')">
					Reject
				</Button>

				<Button v-if="'Active'.includes(contract.workflow_state) && ['CounterParty', 'Signee'].some(role => userRoles.includes(role))" class="absolute bottom-6 right-6 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition" @click="downloadContract">
					Download
				</Button>

				<Comments v-if="!['Active', 'Rejected', 'Awaiting Signature'].includes(contract.workflow_state)" :doctype="'Contract'" :docname="contract.name" @comment-added="handleComment" />
			</div>

			<div v-else class="text-center text-gray-500">
				Loading contract details...
			</div>

			<Button class="absolute top-6 left-6 text-gray-600 hover:text-gray-800 transition" @click="$router.push('/counterpartycontracts')" title="Back">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</Button>
		</div>
	</div>
</template>

<script>
	import Comments from '@/components/Comments.vue';
	import {Button} from 'frappe-ui';

	export default {
		name: 'ContractDetails',

		components: {
			Comments,
			Button,
		},

		data() {
			return {
				contract: null,
				contractVersions: [],
				showVersions: false,
				userRoles: []
			};
		},

		mounted() {
			this.fetchUserRoles();
			this.fetchContract();
		},

		methods: {
			goToVersionDetails(versionName, contractName) {
				this.$router.push(`${contractName}/contract-version/${versionName}`);
			},

			async handleSignClick() {
				try {
					const userRes = await fetch('/api/method/frappe.auth.get_logged_user', {
						credentials: 'include'
					});
					const userData = await userRes.json();
					const userEmail = userData.message;
					const signees = this.contract.signee || [];
					const userIndex = signees.findIndex(row => row.email === userEmail);

					if (userIndex === -1) {
						alert('You are not listed as a signee for this contract.');
						return;
					}

					const urlList = (this.contract.signing_url || '').split(',').map(url => url.trim());
					const signingUrl = urlList[userIndex];

					if (!signingUrl) {
						alert('No signing URL found for your entry.');
						return;
					}

					window.open(signingUrl, '_blank');
				} catch (error) {
					alert('An error occurred while retrieving your signing URL.');
				}
			},

			async fetchUserRoles() {
				try {
					const userRes = await fetch('/api/method/frappe.auth.get_logged_user', {
						credentials: 'include'
					});

					const userData = await userRes.json();
					const userId = userData.message;

					const rolesRes = await fetch(`/api/method/frappe.core.doctype.user.user.get_roles?uid=${userId}`, {
						credentials: 'include'
					});

					const rolesData = await rolesRes.json();
					this.userRoles = rolesData.message || [];
					this.rolesLoaded = true;
				} catch (error) {
				}
			},

			async handleComment() {
				if (this.contract.workflow_state === 'Modified') {
					await this.updateWorkflowState('Send Back to Negotiation');
				}
			},

			downloadContract() {
				if (this.contract && this.contract.download_url) {
					const link = document.createElement('a');
					link.href = this.contract.download_url;
					link.download = '';
					link.target = '_blank';
					link.click();
				} else {
					alert('Download URL not available.');
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
						`/api/resource/Contract Version?filters=[["contract","=","${contractName}"]]&fields=["name","created_on","content"]&order_by=created_on desc`,
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
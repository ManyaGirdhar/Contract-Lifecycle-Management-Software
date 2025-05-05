<template>
    <div class="min-h-screen bg-gray-100 flex justify-center p-6">
        <div class="w-full max-w-9xl bg-white shadow-lg rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-3xl font-bold text-gray-800">Contracts</h1>

                <div class="flex items-center space-x-2">
                    <input v-model="searchQuery" type="text" placeholder="🔍 Search"
                        class="px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500" />
                    <Button theme="primary"
                        class="px-8 py-5 text-lg font-semibold shadow-md hover:shadow-lg transition bg-[#264e36] text-white hover:bg-[#2f5f44]"
                        @click="goToRequestForm">
                        Request Contract
                    </Button>
                </div>
            </div>

            <ul v-if="filteredContracts.length" class="space-y-4">
                <li v-for="contract in filteredContracts" :key="contract.name"
                    class="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm flex justify-between items-center cursor-pointer hover:bg-blue-100 transition"
                    @click="goToContract(contract.name)">
                    <span class="text-lg font-semibold text-gray-700">{{ contract.name }}</span>
                    <span class="px-3 py-1 text-sm font-medium rounded-full" :class="{
                        'bg-green-200 text-green-800': contract.workflow_state === 'Active',
                        'bg-red-200 text-red-800': contract.workflow_state === 'Rejected'
                    }">
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
    resources: {
        posts() {
            return {
                url: '/api/method/clm.api.fetch_contracts',
                auto: true,
                params: {
                    user_email: this.userEmail,
                    user_roles: this.userRoles
                }
            }
        },
    },

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
    },

    computed: {
        filteredContracts() {
            const contracts = this.$resources.posts?.data || [];
            if (!this.searchQuery) return contracts;
            const q = this.searchQuery.toLowerCase();
            return contracts.filter(c => c.name.toLowerCase().includes(q));
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



        // get_data() {
        //     console.log("SDfknsdkn")


        //     let todo = createResource({
        //         url: '/api/method/clm.api.fetch_contracts',
        //         method: 'GET',
        //         params: {
        //             doctype: 'Contract',
        //             user_email: 'fdlnsdn'
        //         }
        //     })
        //     todo.fetch()
        //     console.log(todo, "todo")
        // }
        // ,


        goToContract(contractName) {
            this.$router.push(`/contract/${contractName}`);
        },

        goToRequestForm() {
        window.location.href = "https://three-korecent.frappe.cloud/request-contract";
    }
    }
};
</script>
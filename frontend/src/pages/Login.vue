<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">
    <div class="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
      <img
        src="@/assets/Inter/smartcontract_logo.png"
        alt="SmartContract Logo"
        width="100"
        height="20"
        class="mx-auto mb-4"
      />
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Login to SMARTContract
      </h2>
      <form class="flex flex-col space-y-4" @submit.prevent="submit">
        <Input
          required
          name="email"
          type="text"
          placeholder="johndoe@email.com"
          label="User ID"
          class="w-full"
        />
        <Input
          required
          name="password"
          type="password"
          placeholder="••••••"
          label="Password"
          class="w-full"
        />
        <Button
          :loading="session.login.loading"
          variant="solid"
          class="px-4 py-1 border border-[#8B4513] rounded-md text-[#8B4513] font-semibold transition duration-200 hover:bg-[#8B4513] hover:text-white"
        >
          Login
        </Button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { session } from '../data/session'

function submit(e) {
  let formData = new FormData(e.target)
  session.login.submit({
    email: formData.get('email'),
    password: formData.get('password'),
  })
}
</script>

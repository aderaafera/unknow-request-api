import { ref } from 'vue'

const usernameRef = ref<string | null>(null)

export function useUsername() {
  function setUsername(newUsername: string | null) {
    usernameRef.value = newUsername
  }

  return {
    username: usernameRef,
    setUsername
  }
}



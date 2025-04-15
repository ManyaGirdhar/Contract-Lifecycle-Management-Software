<template>
  <div class="mt-8 border-t pt-4">
    <h2 class="text-xl font-semibold mb-3 text-gray-800">Comments</h2>

    <!-- Comments List -->
    <div v-if="comments.length">
      <div
        v-for="comment in comments"
        :key="comment.name"
        class="mb-4 p-4 bg-white border rounded shadow-sm"
      >
        <p class="text-sm font-medium text-blue-700 mb-1">
          {{ comment.owner }}
        </p>
        <div class="pl-4 border-l-2 border-blue-300">
          <div class="text-gray-800 text-base" v-html="comment.content"></div>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatDate(comment.creation) }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-500 text-sm mb-4">No comments yet.</div>

    <!-- Add Comment -->
    <textarea
      v-model="newComment"
      rows="3"
      class="w-full border p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      placeholder="Add a comment..."
    ></textarea>
    <button
      @click="postComment"
      :disabled="isPosting"
      class="bg-blue-600 text-white px-2 py-1 text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {{ isPosting ? 'Posting...' : 'Post Comment' }}
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['comment-added']);
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  doctype: String,
  docname: String
});

const comments = ref([]);
const newComment = ref('');
const isPosting = ref(false);

const fetchComments = async () => {
  try {
    const url = `/api/resource/Comment?fields=["name","content","owner","creation"]&filters=[["reference_doctype","=","${props.doctype}"],["reference_name","=","${props.docname}"],["comment_type", "=", "Comment"]]&order_by=creation desc&_=${Date.now()}`;
    const res = await fetch(url);
    const data = await res.json();
    comments.value = data.data || data.message || [];
  } catch (err) {
    console.error('Error fetching comments:', err);
    alert('Failed to fetch comments.');
  }
};

const postComment = async () => {
  if (!newComment.value.trim()) return;

  isPosting.value = true;
  const commentText = newComment.value;

  try {
    const res = await fetch('/api/resource/Comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment_type: 'Comment',
        reference_doctype: props.doctype,
        reference_name: props.docname,
        content: commentText
      })
    });

    const result = await res.json();

    if (res.ok && result.data) {
      newComment.value = ''; // ✅ Clear textarea
      await fetchComments(); // ✅ Reload comments
      emit('comment-added');
    } else {
      console.error('Post failed:', result);
      alert(result.message || 'Failed to post comment.');
    }
  } catch (err) {
    console.error('Error posting comment:', err);
    alert("Couldn't post comment. Check login or network.");
  } finally {
    isPosting.value = false;
  }
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

onMounted(fetchComments);
watch(() => props.docname, fetchComments);
</script>
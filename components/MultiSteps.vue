<template>
  <div class="mx-auto my-5 col-12 col-lg-8">
    <div class="multisteps-form__progress">
      <button
        v-for="(button, key) in buttons"
        :key="key"
        :class="button.class"
        class="multisteps-form__progress-btn"
        type="button"
        :title="button.title"
      >
        <span>{{ button.title }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MultiSteps",
  props: {
    buttons: {
      type: Array,
      default: [
        {
          title: "About",
          class: "js-active position-relative"
        },
        {
          title: "Account",
          class: ""
        },
        {
          title: "Address",
          class: ""
        }
      ]
    }
  }
};
</script>

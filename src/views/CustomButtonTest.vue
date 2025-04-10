<template>
  <div>
    <CustomButton title="Button Title" icon_path="/icon-path.png" @clicked="handleClick" />
  </div>
</template>

<script>
import CustomButton from '@/components/CustomButton.vue';

export default {
  components: {
    CustomButton,
  },
  methods: {
    handleClick() {
      console.log('Button clicked');
    },
  },
};
</script>
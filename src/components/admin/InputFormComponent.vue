<template>
    <div class="dynamic-form">
        <h2>{{ headerText }}</h2>
      <form @submit.prevent="handleSubmit">
        <div v-for="(field, index) in fields" :key="index" class="form-group">
          <label :for="field.name">{{ field.label }}</label>
          <input
            v-if="field.type === 'text' || field.type === 'email' || field.type === 'number'"
            :type="field.type"
            v-model="formData[field.name]"
            :name="field.name"
            :placeholder="field.placeholder"
          />
          <textarea
            v-if="field.type === 'textarea'"
            v-model="formData[field.name]"
            :name="field.name"
            :placeholder="field.placeholder"
          ></textarea>
          <div v-if="field.error" class="error-message">{{ field.error }}</div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
</template>

<script>
  export default {
    name: 'DynamicForm',
    props: {
      fields: {
        type: Array,
        required: true,
      },
      headerText: {
        type: String,
        default: 'Dynamic Form',
      },
    },
    data() {
      return {
        formData: this.fields.reduce((acc, field) => {
          acc[field.name] = field.defaultValue || '';
          return acc;
        }, {}),
      };
    },
    methods: {
      validateForm() {
        let isValid = true;
          this.fields.forEach((field) => {
          if (field.required && !this.formData[field.name]) {
            field.error = `${field.label} is required.`;
            isValid = false;
          } else {
            field.error = null;
          }
        });
  
        return isValid;
      },
      handleSubmit() {
        if (this.validateForm()) {
          this.$emit('submit', this.formData);
        }
      },
    },
  };
</script>

<style scoped>
@import '@/assets/adminForm.css';
</style>
  
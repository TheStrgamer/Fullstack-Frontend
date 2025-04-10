<template>
    <div class="nuh">
        <Button @click="$router.push('/')">Return</Button>
        <img src="../assets/universal/images/nuhuh.gif" alt="Nuh Uh" class="nuhuh-image" />
    </div>
</template>
<style scoped>
.nuhuh-image {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}
@media (max-aspect-ratio: 1/1) {
  .nuhuh-image {
    width: 100%;
    height: auto;
  }
}
@media (min-aspect-ratio: 1/1) {
  .nuhuh-image {
    height: 100%;
    width: auto;
  }
}
.nuh {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
}
.nuh button {
  margin-bottom: 20px;
  padding: 10px 20px;
  font-size: 22px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 50px;
}
</style>

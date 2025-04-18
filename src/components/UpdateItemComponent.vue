<template>
  <div>
    <h1 class="title">Oppdater Produkt</h1>
    <div class="form-group">
      <ImageUpload
        :existingImageUrls="existingImageUrls"
        @update:images="selectedImages = $event"
        @update:existingImages="existingImageUrls = $event"
      />
      </div>
    <form class="update-item-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Tittel</label>
        <input v-model="listing.title" type="text" id="title" required />
      </div>

      <div class="form-group">
        <label for="brief_description">Lokketekst</label>
        <textarea v-model="listing.brief_description" id="brief_description" required></textarea>
      </div>

      <div class="form-group">
        <label for="full_description">Beskrivelse</label>
        <textarea v-model="listing.full_description" id="full_description" required></textarea>
      </div>

      <div class="form-group">
        <label for="price">Pris</label>
        <input v-model="listing.price" type="number" id="price" step="0.01" required />
      </div>

      <div class="form-group">
        <label for="category">Kategori</label>
        <select v-model="listing.category" required>
          <option value="" disabled>Velg en kategori</option>
          <option
            v-for="category in categoriesStore.categories"
            :key="category.id"
            :value="category.id?.toString()"

          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="condition">Tilstand</label>
        <select v-model="listing.condition" required>
          <option value="" disabled>Velg en tilstand</option>
          <option
            v-for="condition in conditionStore.conditions"
            :key="condition.id"
            :value="condition.id?.toString()"

          >
            {{ condition.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="size">Størrelse (valgfri)</label>
        <input v-model="listing.size" type="text" id="size" />
      </div>

      <div class="form-group">
        <label for="Address">Adresse</label>
        <AutoCompleteAddressSearchComponent
          v-model:address="listing.address"
        />
      </div>

      <button type="submit">Submit</button>
      <button type="button" @click="handleDelete">Slett</button>

    </form>
  </div>
  <br><br>
</template>


<script setup lang="ts">
  import { useCategoriesStore } from '@/stores/CategoriesStore.ts'
  import { useConditionStore } from '@/stores/ConditionStore.ts'
  import { useItemStore } from '@/stores/ItemStore.ts'
  import { useUserStore } from '@/stores/UserStore.ts'
  import { onMounted, reactive, ref } from 'vue'
  import AutoCompleteAddressSearchComponent from './AutoCompleteAddressSearchComponent.vue'
  import { addressToCoords, coordsToAddress }  from '@/services/geoCodingService'
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import { fetchDataWithAuth, postDataWithAuth, getUrlFromEndpoint, postImages } from '@/services/httpService';
  import ImageUpload from '@/components/ImageUpload.vue'

  const route = useRoute();
  const router = useRouter();
  const item_id = route.query.id;

  const categoriesStore = useCategoriesStore();
  const conditionStore = useConditionStore();
  const itemStore = useItemStore();
  const userStore = useUserStore();

  const token = userStore.jwtToken;

  const selectedImages = ref<File[]>([]);
  const existingImageUrls = ref<string[]>([]);


const listing = reactive({
  id: '',
  title: '',
  brief_description: '',
  full_description: '',
  price: '',
  category: '',
  condition: '',
  size: '',
  address: '',
  createdAt: '',
  imageUrls: [] as String[]
})



onMounted(async () => {
  await categoriesStore.fetchCategories();
  await conditionStore.fetchConditions();


  try {
    const response = await fetchDataWithAuth(`listings/id/${item_id}`)
    
    const data = response.data;
    Object.assign(listing, {
      id: item_id,
      title: data.title,
      brief_description: data.briefDescription,
      full_description: data.fullDescription,
      price: data.price,
      category: getCategoryIdByName(data.categoryName),
      condition: getConditionIdByName(data.conditionName),
      size: data.size || '',
      address: '',
      createdAt: data.createdAt,
      imageUrls: data.imageUrls
    });

    existingImageUrls.value = data.imageUrls;

    convertCoordsToAddress(data.latitude, data.longitude).then((resolvedAddress) => {
      listing.address = resolvedAddress;
    });

  } catch (error) {
    console.error(error);
  }
});



const handleSubmit = async () => {

  const geoData = await addressToCoords(listing.address);

  const lat = geoData?.latitude ? parseFloat(geoData.latitude) : 0;
  const long = geoData?.longitude ? parseFloat(geoData.longitude) : 0;


  const selectedCategory = categoriesStore.categories.find(
    (cat) => cat.id.toString() === listing.category
  )
  const selectedCondition = conditionStore.conditions.find(
    (cond) => cond.id.toString() === listing.condition
  )


  const itemData = {
    id: listing.id,
    title: listing.title,
    brief_description: listing.brief_description,
    full_description: listing.full_description,
    price: parseFloat(listing.price || '0'),
    category: selectedCategory?.id,
    condition: selectedCondition?.id,
    size: listing.size || '',
    sale_status: 'available',
    latitude: lat,
    longitude: long,
    imageUrls: existingImageUrls.value,
  };

  try {
    itemStore.updateItemListing(itemData);

    if (selectedImages.value.length != 0) {
      const formData = new FormData();
      formData.append("id", listing.id);

      selectedImages.value.forEach((file) => {
        formData.append("images", file);
      });

      const response = await postImages("images/uploadListing", formData);

    }
    
    await router.push('/profile/my_listings');

  } catch (error) {
    console.error('Failed to update item:', error);
  }
};


const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this listing?")) return;

  try {
    await itemStore.deleteItem(listing.id);
    await router.push('/profile/my_listings');
  } catch (error) {
    console.error("Failed to delete item:", error);
  }
};

async function convertCoordsToAddress(lat: string | number, long: string | number) {
  const geoData = await coordsToAddress(String(lat), String(long));
  return geoData ? geoData.fullAddress : '';
}

function getCategoryIdByName(name: string): string {
  const category = categoriesStore.categories.find(c => c.name === name);
  return category ? category.id.toString() : '';
}

function getConditionIdByName(name: string): string {
  const condition = conditionStore.conditions.find(c => c.name === name);
  return condition ? condition.id.toString() : '';
}
</script>

<style scoped>
@import '../assets/updateItem.css';
</style>
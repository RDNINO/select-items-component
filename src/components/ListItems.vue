<script>
  import ListItem from "./Item.vue";

  export default {
    name: "ListItems",
    components: { ListItem },
    props: {
      items: {
        type: Array,
        required: false,
        default: () => [],
      },
      itemControls: { type: Boolean, default: false },
    },
    methods: {
      add(item) {
        this.$emit("add", item);
      },
    },
  };
</script>

<template>
  <div class="suggests">
    <ul class="suggest-items">
      <li v-for="(item, index) in items" :key="index">
        <ListItem :data-test="`item-${index}`" :name="item" @add="add" :item-controls="itemControls" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .suggest-items {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
</style>

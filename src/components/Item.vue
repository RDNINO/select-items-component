<template>
  <div class="item">
    <div data-test="title" class="item-title">{{ name }}</div>
    <button v-if="displayAddButton" @click="add" data-test="btn-add" class="btn-add">
      Добавить
    </button>
  </div>
</template>

<script>
  export default {
    name: "ListItem",
    props: {
      name: { type: String, required: true },
      itemControls: { type: Boolean, default: false },
    },
    computed: {
      displayAddButton() {
        return this.itemControls;
      },
    },
    methods: {
      add() {
        this.$emit("add", this.name);
      },
    },
  };
</script>

<style scoped>
  .item {
    background: #fff;
    display: flex;
    padding: 10px;
    margin: 2px;
    height: 53px;
    font-size: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid #c4c4c4;
    box-sizing: border-box;
  }

  .btn-add {
    width: 104px;
    height: 35px;
    background: #40b159;
    margin-left: auto;
    margin-right: 14px;
    border: none;
  }
  .item-title {
    font-family: "Roboto";
    font-size: 16px;
    color: #000000;
    align-content: flex-start;
  }
</style>

<script>
  import Api from "@/api/api";
  import ListItems from "./ListItems.vue";
  const api = new Api();

  export default {
    name: "SelectItems",
    components: { ListItems },
    data: () => ({
      queryString: "",
      suggestItems: [],
      selectedItems: [],
      suggestsEnabled: true,
    }),
    computed: {
      itemsIsSelected() {
        return this.selectedItems.length > 0;
      },
      btnSwitchTitle() {
        if (this.suggestsEnabled) {
          return "Остановить автопоиск";
        }
        return "Включить автопоиск";
      },
    },
    methods: {
      async queryData(queryString) {
        const items = await api.getItems(this.queryString);
        const availableItems = items.filter((itemData) =>
          itemData.includes(queryString)
        );
        this.suggestItems = availableItems;
      },
      addToSelectedList(itemData) {
        this.selectedItems.push(itemData);
      },
      clearSuggestItems() {
        this.suggestItems = [];
      },
      switchSuggests() {
        this.suggestsEnabled = !this.suggestsEnabled;
      },
    },
    watch: {
      queryString(newValue) {
        if (!this.suggestsEnabled) return;
        if (newValue.length < 3) {
          this.clearSuggestItems();
          return;
        }
        this.queryData(newValue);
      },
    },
  };
</script>

<template>
  <div class="select-items">
    <div class="search">
      <input
        v-model="queryString"
        class="search__input"
        placeholder="Введите имя"
        data-test="search-input"
      />
    </div>
    <div class="suggests">
      <ListItems
        :items="suggestItems"
        @add="addToSelectedList"
        :item-controls="true"
        data-test="suggests-list"
      />
    </div>
    <div class="controls">
      <button
        class="controls__btn-switch"
        data-test="btn-switch"
        @click="switchSuggests"
      >
        {{ btnSwitchTitle }}
      </button>
    </div>
    <div class="list-title" v-if="itemsIsSelected">
      Список добавленных элементов
      <ListItems :items="selectedItems" data-test="list-selected-items" />
    </div>
  </div>
</template>

<style scoped>
  .select-items {
    width: 279px;
    height: 383px;
    background: #c4c4c4;
  }

  .search__input {
    padding: 16px 14px;
    width: 279px;
    height: 53px;

    background: #ffffff;
    border: 1px solid #c4c4c4;
    box-sizing: border-box;
  }

  .suggests {
    height: 310px;
  }

  .controls__btn-switch {
    width: 100%;
    height: 64px;
    bottom: 0%;
    right: 0%;
    background: #7382cd;
  }

  .list-title {
    margin-top: 13px;
    background: #c4c4c4;
    width: 279px;
    height: 26px;
  }
</style>

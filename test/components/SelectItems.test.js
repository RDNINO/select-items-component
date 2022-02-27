import { createLocalVue, shallowMount } from "@vue/test-utils";
import SelectItems from "@/components/SelectItems.vue";
import ListItems from "@/components/ListItems.vue";
import Api from "@/api/api";
import { nextTick } from "vue";

describe("Select items component", () => {
  let wrapper;

  const getSearchInput = () => wrapper.find("input[data-test='search-input']");

  const createComponent = (options) => {
    const localVue = createLocalVue();
    wrapper = shallowMount(SelectItems, {
      async: false,
      localVue,
      ...options,
    });
  };

  const componentStateByDefault = () => ({
    suggestItems: [],
    queryString: "",
    selectedItems: [],
    suggestsEnabled: true,
  });

  describe("initial render", () => {
    beforeAll(() => {
      createComponent();
    });

    afterAll(() => {
      if (wrapper) {
        wrapper.destroy();
      }
      jest.clearAllMocks();
      let wrapper = undefined;
    });

    it("search input", () => {
      const PLACEHOLDER_VALUE = "Введите имя";
      const searchInput = getSearchInput();
      expect(searchInput.attributes("placeholder")).toBe(PLACEHOLDER_VALUE);
    });

    it("'suggest items' list", () => {
      const ITEM_CONTROLS_PROP_VALUE = true;
      const suggestsList = wrapper.find("[data-test='suggests-list']");
      expect(suggestsList.props("items")).toEqual([]);
      expect(suggestsList.props("itemControls")).toBe(ITEM_CONTROLS_PROP_VALUE);
    });
    it("switch search button", () => {
      const BUTTON_TITLE = "Остановить автопоиск";

      const btnSwitch = wrapper.find("button[data-test='btn-switch']");

      expect(btnSwitch.text()).toContain(BUTTON_TITLE);
    });

    it("'selected items; list", () => {
      expect(wrapper.find("[data-test='selected-items-list']").exists()).toBe(
        false
      );
    });
  });

  describe("actions", () => {
    afterEach(() => {
      if (wrapper) {
        wrapper.destroy();
      }
      wrapper = undefined;
      jest.clearAllMocks();
    });

    it("call 'getItems' from api when 'search' input value length great 2", async () => {
      const QUERY_VALUE = "fake query value";
      const mockGetItems = jest.fn().mockResolvedValue([]);
      Api.prototype.getItems = mockGetItems;
      createComponent();
      const searchInput = getSearchInput();

      await searchInput.setValue(QUERY_VALUE);

      expect(mockGetItems).toHaveBeenCalledWith(QUERY_VALUE);
    });

    it("do not call 'getItems' from api when 'search' input value length less or equal 2", async () => {
      const QUERY_VALUE = "js";
      const mockGetItems = jest.fn().mockResolvedValue([]);
      Api.prototype.getItems = mockGetItems;
      createComponent();

      const searchInput = getSearchInput();
      await searchInput.setValue(QUERY_VALUE);

      expect(mockGetItems).not.toHaveBeenCalledWith(QUERY_VALUE);
    });

    it("display suggest items when get they from api", async () => {
      const apiResponse = ["fake item #1", "fake item #2"];
      const QUERY_VALUE = "fake item";
      const mockGetItems = jest.fn().mockResolvedValue(apiResponse);
      Api.prototype.getItems = mockGetItems;
      createComponent();
      const searchInput = getSearchInput();

      await searchInput.setValue(QUERY_VALUE);
      await nextTick();
      await nextTick();

      const suggestsList = wrapper.find("[data-test='suggests-list']");

      expect(suggestsList.props("items")).toEqual(apiResponse);
    });

    it("clear 'suggest items' list when 'search' input value length less or equal 2", async () => {
      const apiResponse = ["fake item #1", "fake item #2"];
      const QUERY_VALUE = "fake item";
      const NEW_QUERY_VALUE = "fa";
      const mockGetItems = jest.fn().mockResolvedValue(apiResponse);
      Api.prototype.getItems = mockGetItems;
      createComponent({
        data: () => ({
          queryString: QUERY_VALUE,
          suggestItems: apiResponse,
          selectedItems: [],
          suggestsEnabled: true,
        }),
      });

      const suggestsList = wrapper.find("[data-test='suggests-list']");

      expect(suggestsList.props("items")).toEqual(apiResponse);

      const searchInput = getSearchInput();
      await searchInput.setValue(NEW_QUERY_VALUE);

      expect(suggestsList.props("items")).toHaveLength(0);
    });

    it("add item to 'selected items' list when emitted 'add' from 'suggest items' list", async () => {
      const listItem = "fake item #1";
      const componentState = componentStateByDefault();
      componentState.suggestItems = [listItem];

      createComponent({
        data: () => ({
          ...componentState,
        }),
      });

      expect(wrapper.find("[data-test='list-selected-items']").exists()).toBe(
        false
      );

      await wrapper
        .find("[data-test='suggests-list']")
        .vm.$emit("add", listItem);

      const listSelectedItems = wrapper.find(
        "[data-test='list-selected-items']"
      );
      expect(listSelectedItems.isVisible()).toBe(true);
      expect(listSelectedItems.props("items")).toEqual([listItem]);
    });
  });

  describe("actions", () => {
    const BUTTON_ENABLED_SEARCH_TITLE = "Остановить автопоиск";
    const BUTTON_DISABLED_SEARCH_TITLE = "Включить автопоиск";
    const mockGetItems = jest.fn().mockResolvedValue([]);
    const QUERY_VALUE = "test";

    beforeEach(() => {
      Api.prototype.getItems = mockGetItems;
    });

    afterEach(() => {
      if (wrapper) {
        wrapper.destroy();
      }
      wrapper = undefined;
    });

    const getSwitchButton = () =>
      wrapper.find("button[data-test='btn-switch']");

    it("set autosearch to 'off' when 'disable autosearch' button click ", async () => {
      const componentState = componentStateByDefault();
      createComponent({ data: () => ({ ...componentState }) });

      const btnSwitch = getSwitchButton();

      expect(btnSwitch.text()).toContain(BUTTON_ENABLED_SEARCH_TITLE);

      await btnSwitch.trigger("click");

      expect(btnSwitch.text()).toContain(BUTTON_DISABLED_SEARCH_TITLE);

      const searchInput = getSearchInput();
      await searchInput.setValue(QUERY_VALUE);

      expect(mockGetItems).not.toHaveBeenCalled();
    });

    it("set autosearch to 'on' when 'enable autosearch' button click ", async () => {
      const componentState = componentStateByDefault();
      createComponent({
        data: () => ({ ...componentState, suggestsEnabled: false }),
      });

      const btnSwitch = getSwitchButton();

      expect(btnSwitch.text()).toContain(BUTTON_DISABLED_SEARCH_TITLE);

      await btnSwitch.trigger("click");

      expect(btnSwitch.text()).toContain(BUTTON_ENABLED_SEARCH_TITLE);

      const searchInput = getSearchInput();
      await searchInput.setValue(QUERY_VALUE);

      expect(mockGetItems).toHaveBeenCalledWith(QUERY_VALUE);
    });
  });
});

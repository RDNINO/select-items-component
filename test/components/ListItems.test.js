import { createLocalVue, shallowMount } from "@vue/test-utils";
import ListItems from "@/components/ListItems.vue";
import Item from "@/components/Item.vue";

describe("Items list", () => {
  let wrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
    }
    wrapper = undefined
    jest.clearAllMocks()
  })

  const createComponent = (options) => {
    const localVue = createLocalVue();

    wrapper = shallowMount(ListItems, {
      sync: false,
      localVue,
      ...options,
    });
  };

  it("pass 'items' by props", async () => {
    const items = ["item #1", "item #2", "item #3"];
    const ENABLE_ITEM_CONTROLS = false;
    const props = { items, itemControls: ENABLE_ITEM_CONTROLS };

    createComponent({ propsData: props });

    const listItems = wrapper.findAllComponents(Item);
    expect(listItems).toHaveLength(items.length);
    items.forEach((item, index) => {
      const itemComponent = wrapper.find(`[data-test="item-${index}"]`);
      expect(itemComponent.exists()).toBe(true);
      expect(itemComponent.props("name")).toBe(item);
      expect(itemComponent.props("itemControls")).toBe(ENABLE_ITEM_CONTROLS);
    });
  });

  it("pass 'itemControls' by props", () => {
    const items = ["fake item name"];
    const ENABLE_ITEM_CONTROLS = true;
    const props = { items, itemControls: ENABLE_ITEM_CONTROLS };

    createComponent({ propsData: props });

    const listItem = wrapper.findComponent(Item);
    expect(listItem.props("itemControls")).toBe(ENABLE_ITEM_CONTROLS);
  });

  it("set prop 'items' by default when empty", () => {
    createComponent();

    expect(wrapper.findAllComponents(Item)).toHaveLength(0);
  });

  it("emit 'add' when emitted 'add' from list", async () => {
    const items = ["item #1", "item #2"];
    createComponent({ propsData: { items, itemControls: true } });

    const itemComponent = wrapper.findComponent(Item);
    const EMIT_VALUE = "fake emit value";
    await itemComponent.vm.$emit("add", EMIT_VALUE);

    expect(wrapper.emitted("add")[0]).toEqual([EMIT_VALUE]);
  });
});

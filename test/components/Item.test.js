import { createLocalVue, shallowMount } from "@vue/test-utils";
import Item from "@/components/Item.vue";

describe("List item component", () => {
  let wrapper;
  const DEFAULT_PROPS = { name: "fake item title" };

  const createComponent = (options) => {
    const localVue = createLocalVue();

    wrapper = shallowMount(Item, {
      sync: false,
      localVue,
      ...options,
    });
  };

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
    wrapper = undefined;
    jest.clearAllMocks();
  });

  it("pass item title by props", async () => {
    createComponent({ propsData: DEFAULT_PROPS });

    expect(wrapper.find("div[data-test='title']").text()).toBe(
      DEFAULT_PROPS.name
    );
  });

  it.each`
    action       | itemControlsValue
    ${"display"} | ${true}
    ${"hide"}    | ${false}
  `(
    "$action 'add' button when 'itemControls' props is $itemControlsValue",
    ({ itemControlsValue }) => {
      const props = { ...DEFAULT_PROPS, itemControls: itemControlsValue };

      createComponent({ propsData: props });

      expect(wrapper.find("button[data-test='btn-add']").exists()).toBe(itemControlsValue);
    }
  );

  it("emits 'add' event when 'add' button click", async () => {
    const props = { ...DEFAULT_PROPS, itemControls: true }
    createComponent({ propsData: props })
    const btnAdd = wrapper.find("button[data-test='btn-add']")

    await btnAdd.trigger("click")

    expect(wrapper.emitted("add")[0]).toEqual([DEFAULT_PROPS.name])
  })
});

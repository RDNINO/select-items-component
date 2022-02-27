export default class Api {
  constructor() {
    this.url = "https://jsonplaceholder.typicode.com/users";
  }

  getOptions() {
    return {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
  }

  async getItems() {
    const options = this.getOptions();
    const request = {
      options,
    };
    try {
      const fetchRes = await fetch(this.url, request);
      const response = await fetchRes.json();
      const itemsData = response.map((item) => item.name);
      return itemsData;
    } catch (error) {
      throw new Error(error);
    }
  }
}

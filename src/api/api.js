export default class Api {
  constructor() {
    // this.url =
    //   "https://dadata.ru/api/suggest/name";
    // this.token = "43b7e62f8b5e35438a657ce267979f961dcb9670";
    this.url = "https://jsonplaceholder.typicode.com/users";
  }

  // getOptions() {
  //   return {
  //     method: "POST",
  //     mode: "cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Token ${ this.token }`,
  //       "Accept": "application/json",
  //     },
  //   };
  // }

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
      // body: JSON.stringify({ query: queryString }),
    };
    try {
      const fetchRes = await fetch(this.url, request);
      const response = await fetchRes.json()
      const itemsData = response.map(item => item.name)
      return itemsData
      
    } catch (error) {
      throw new Error(error)
    }

    // .then((res) => res.json())
    // .then((items) => {
    //   return items
    //   // return items.map((element) => element.name);
    // })
  }
}

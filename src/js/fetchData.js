import axios from "axios";

const API_KEY = '34916651-f99371deeade2de9e176e6ceb';
const API_URL = 'https://pixabay.com/api/';

const options = {
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    q: '',
    page: 1,
    per_page: 40,
  }
};

class Fetch {
  constructor() {};

  async getImages(userQuery) {
    try {
      options.params.q = userQuery;
      const response = await axios.get(API_URL, options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  pageIncrement() {
    options.params.page += 1;
  }

  pageRestart() {
    options.params.page = 1;
  }
}

export default Fetch;

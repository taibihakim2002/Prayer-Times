import axios from "axios";
const axiosClient = axios.create({
  baseURL: "https://api.aladhan.com/v1",
});

const getCityData = (country, city) => {
  return axiosClient.get(`/timingsByCity?country=${country}&city=${city}`);
};

export default { getCityData };

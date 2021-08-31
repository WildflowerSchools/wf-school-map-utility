export const BASE_URL = `${process.env.WF_SCHOOL_MAP_API}`

const createUrl = (base, path) => `${base}${path}`

export const fetchSchools = () => {
  return {
    url: createUrl(BASE_URL, "/schools"),
    method: "GET",
  }
}
//
// const Requests = () => {
//   const fetchSchools = async () => {
//     try {
//       setData({users: data.users, isFetching: true});
//       const response = await axios.get(SCHOOLS_SERVICE_URL);
//       setData({users: response.data, isFetching: false});
//     } catch (e) {
//       console.log(e);
//       setData({users: data.users, isFetching: false});
//     }
//   };
// }

  
import axios from 'axios';

export const fetchBug = bugId => {
  return axios.get(`/api/bugs/${bugId}`)
              .then(resp => resp.data);
};

export const fetchBugList = () => {
  let token = localStorage.getItem("auth-token");
  return axios.get('/api/bugs', {headers: {"x-auth-token": token}})
              .then(resp => resp.data);
};




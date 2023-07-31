import { useState } from 'react';
import Cookies from 'js-cookie';

const useFetch = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);


  const fetchData = (endpoint = '/', method = 'GET', body = null, LoginRequired = false) => {
    const baseEndpoint = 'http://localhost:8000/api'
    let options = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    }
    if (body){
      options['body'] = JSON.stringify(body)
    }
    if (LoginRequired === true){
      let token = localStorage.getItem('access')
      if (token){
        options.headers['Authorization'] = `Token ${token}`
      }
      else{
        throw Error('Authorization required')
      }
    }
    fetch(baseEndpoint + endpoint, options)
      .then(res => {
        setResponse(res)
        if (!res.ok) {
          throw Error('Could not fetch the data for that resource');
        }
        return res.json();
      })
      .then(data => {
        if (data.csrfToken !== undefined){
          Cookies.set('csrftoken', data.csrfToken);
        }
        setData(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      });
  };

  return [data, response,  error, fetchData];
};

export default useFetch;
import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for data fetching
 * @param url The URL to fetch data from
 * @param options Axios request options
 * @param dependencies Dependencies array to trigger refetch
 * @returns Object containing data, loading state, error, and refetch function
 */
function useFetch<T = any>(
  url: string,
  options?: AxiosRequestConfig,
  dependencies: any[] = []
) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);

  const refetch = () => {
    setState(prev => ({ ...prev, loading: true }));
    setShouldRefetch(prev => !prev);
  };

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }));
      
      try {
        const response = await axios(url, {
          ...options,
          cancelToken: source.token,
        });
        
        if (isMounted) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
        }
      } catch (error: any) {
        if (isMounted && !axios.isCancel(error)) {
          setState({
            data: null,
            loading: false,
            error: error.response?.data?.message || error.message || 'An error occurred',
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      source.cancel('Component unmounted');
    };
  }, [...dependencies, shouldRefetch, url]);

  return { ...state, refetch };
}

export default useFetch; 
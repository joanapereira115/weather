import { useState } from "react";

export const useHttp = () => {
  const [error, setError] = useState("No data available!");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const sendRequest = async (url) => {
    setData(null);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError("An error occurred while trying to fetch the data!");
      }
      const receivedData = await response.json();
      setData(receivedData);
    } catch (err) {
      setError("An error occurred while trying to fetch the data!");
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    sendRequest,
    data,
  };
};

export default useHttp;

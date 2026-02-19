import { useEffect, useState } from "react";

const apikey = "bwaWXaGmsaL0izPE61gQkrliJqdaQ2EjmiCnctcE";
const URL = `https://api.nasa.gov/planetary/apod?api_key=${apikey}`;
const URL2 = `https://api.nasa.gov/insight_weather/?api_key=${apikey}`
function Picture() {
  const [nasaData, setNasaData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(URL);
      const data = await result.json();
      console.log(data);
      setNasaData(data);
    };
    fetchData();
  }, []);
  if (!nasaData) return <p>Loading...</p>;
  return (
    <div>
      <h1>{nasaData.title}</h1>
      <img src={nasaData.hdurl}></img>
      <p>{nasaData.explanation}</p>
    </div>
  );
}

export default Picture;

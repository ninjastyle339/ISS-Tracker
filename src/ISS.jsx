import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
const URL = "https://api.wheretheiss.at/v1/satellites/25544";
const JAWG_TOKEN = import.meta.env.VITE_JAWG_TOKEN;
function ISS() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [issdata, setIssData] = useState(null);
  const [position, setPosition] = useState([0, 0]);
  const [radius, setRadius] = useState(0);
  const customIcon = new Icon({
    iconUrl: "/black-marker.png",
    iconSize: [38, 38],
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const getdate = new Date();
      setDate(getdate.toLocaleDateString());
      setTime(getdate.toLocaleTimeString());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(URL);
        const result = await data.json();
        setIssData(result);
        const newpos = [Number(result.latitude), Number(result.longitude)];
        setPosition(newpos);
        setRadius(Number(result.footprint) * 1000);
      } catch (error) {
        console.error("Fetch failed: ", error);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  if (!issdata) return <p>Data loading...</p>;
  return (
    <div>
      <header>
        <div class="header">
          <div class="adjust"></div>
          <div class="center">
            <h1>ISS</h1>
            <h4>International Space Station</h4>
          </div>
          <div class="calendar">
            <h1>Date: [{date}]</h1>
            <h1>Time: [{time}]</h1>
          </div>
        </div>
      </header>
      <section>
        <div class="centerbox">
          <div class="img">
            <h1>ISS Tracker</h1>
            <MapContainer attributionControl={false} center={position} zoom={3}>
              <TileLayer
                attribution='<a href=\"http://jawg.io\" title=\"Tiles Courtesy of Jawg Maps\" target=\"_blank\">&copy; <b>Jawg</b>Maps</a> &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'
                url={`https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=${JAWG_TOKEN}`}
              />
              <Marker icon={customIcon} position={[48.86, 2.3522]} />
              <Circle
                center={position}
                radius={radius}
                pathOptions={{
                  color: "red",
                  fillColor: "cyan",
                }}
              />
              <Circle
                center={position}
                radius={200}
                pathOptions={{
                  color: "blue",
                  fillColor: "black",
                  fillOpacity: 1,
                }}
              />
            </MapContainer>
            <p>
              If you stand in this circle you can theoretically see the ISS and
              the little blue dot is the ISS
            </p>
          </div>
          <div class="random">
            <div className="info">units: [{issdata.units}] </div>
            <div className="info">length: [109m] </div>
            <div className="info">width: [73m] </div>
            <div className="info">altitude: [{issdata.altitude}] </div>
            <div className="info">latitude: [{issdata.latitude}] </div>
            <div className="info">longitude:[{issdata.longitude}] </div>
            <div className="info">solar_lat:[{issdata.solar_lat}] </div>
            <div className="info">footprint:[{issdata.footprint}] </div>
            <div className="info">solar_lon:[{issdata.solar_lon}] </div>
            <div className="info">velocity:[{issdata.velocity}] </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ISS;

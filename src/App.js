import { useEffect, useState } from "react";
import { ReactComponent as WindImg } from "./icon/wi-windy.svg";
import { ReactComponent as HumidityImg } from "./icon/wi-humidity.svg";
function App() {

  const [weatherObject, setWeatherObject] = useState({}),
    API_KEY = "164b15fc03bc441f99933704221302";

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=yes`).then(oItem => oItem.json()).then(oItem => {
          console.log(oItem);
          setWeatherObject({ ...oItem });
        });
      });
    }
  }, []);


  function formatDateTime12hr(date) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
      day = date.getDate(),
      month = months[date.getMonth()],
      year = date.getFullYear(),
      hours = date.getHours(),
      minutes = date.getMinutes().toString().padStart(2, '0'),
      amPm = hours >= 12 ? 'PM' : 'AM',
      hours12hr = hours % 12 || 12;

    return `${day} ${month}, ${year} ${hours12hr}:${minutes} ${amPm}`;
  }



  return <div className="body"> {
    Object.keys(weatherObject).length ?
      <div className="App">

        <div>
          <div>{weatherObject.location.name}, {weatherObject.location.region}, {weatherObject.location.country}</div>
          <div>{formatDateTime12hr(new Date(weatherObject.location.localtime_epoch * 1000))}</div>
          <img src={weatherObject.current.condition.icon} alt={weatherObject.current.condition.text} />
          <div className="Degree">{weatherObject.current.temp_c}°C</div>
          <div>{weatherObject.current.condition.text}</div>
          <div className="SubSection">
            {SubSection(<WindImg fill="white" style={{ transform: 'scale(0.5)' }} width={200} height={100} />, "Wind", weatherObject.current.wind_kph + " kph")}
            {SubSection(<HumidityImg fill="white" style={{ transform: 'scale(0.5)' }} width={200} height={100} />, "Humidity", weatherObject.current.humidity + "%")}
          </div>
        </div>
      </div> : <div className="loader"></div>
  }</div>
}


function SubSection(HTMLTag, SectionText, SectionValue) {
  return <div>
    {HTMLTag}
    <div style={{ marginTop: '-1rem' }}>
      {SectionText}
    </div>
    <div>
      {SectionValue}
    </div>
  </div >;
}

export default App;
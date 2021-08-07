import { useState, useEffect } from "react";
import Image from "next/image";
import Metrics from "../components/Metrics";
import { convertTime, ctoF, timeToAMPM } from "../services/converters";
import { isPM } from "../services/utils";
import Head from 'next/head'


export default function Home ()
{
  const [ input, setInput ] = useState( "Sydney" );
  const [ systemUsed, setSystemUsed ] = useState( "metric" );
  const [ weatherData, setWeatherData ] = useState();
  const [ dark, setDark ] = useState( false );

  const getData = async () =>
  {
    const res = await fetch( "api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( { input } ),
    } );
    const data = await res.json();

    setWeatherData( { ...data } );
    setInput( "" );
  };

  const enterKeydown = ( event ) =>
  {
    if ( event.keyCode === 13 )
    {
      getData();
    }
  };

  useEffect( () =>
  {
    getData();
  }, [] );

  const changeSystem = () =>
    systemUsed == "metric"
      ? setSystemUsed( "imperial" )
      : setSystemUsed( "metric" );

  var weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const toggleIcon = `${ dark ? '/lantern-light.png' : '/lantern.png' }`

  return weatherData && !weatherData.message ? (
    <div className={`flex flex-col justify-center items-center px-0 sm:px-5 containerx ${ dark ? 'dark' : '' }`}>

      <Head>
        <title>Weather App</title>
      </Head>

      <button onClick={() => setDark( !dark )} className="absolute top-5 right-0 z-10">
        <img alt="toggleTheme" src={toggleIcon} height="80px" width="80px" className="toggleTheme" />
        <p className="absolute whitespace-nowrap right-2 mt-1 font-bold text-sm w-16 text-center">{dark ? 'Light' : 'Turn off'}</p>
      </button>

      <input
        type="text"
        className="focus:outline-none searchInput desktop"
        placeholder="Search a city..."
        value={input}
        onFocus={( e ) =>
        {
          e.target.value = "";
          e.target.placeholder = "";
        }}
        onChange={( e ) => { setInput( e.target.value ) }}
        onBlur={( e ) => { e.target.placeholder = "Search a city..."; }}
        onKeyDown={( e ) =>
        {
          enterKeydown( e );
          e.target.placeholder = "Search a city...";
        }}
      />
      <div className={`wrapper ${ dark ? 'dark' : '' }`}>

        <div className="weatherWrapper px-5 sm:px-0">

          <h1 className="locationTitle">
            {weatherData.name}, {weatherData.sys.country}
          </h1>

          <p className="weatherDescription">
            {weatherData.weather[ 0 ].description}
          </p>
          <Image
            alt="weatherIcon"
            src={`/icons/${ weatherData.weather[ 0 ].icon }.svg`}
            height="300px"
            width="300px"
          />

          <h1 className="mainTemp">
            {systemUsed == "metric"
              ? Math.round( weatherData.main.temp )
              : Math.round( ctoF( weatherData.main.temp ) )}
            °{systemUsed == "metric" ? "C" : "F"}
          </h1>
          <p>
            Feels like{" "}
            {systemUsed == "metric"
              ? Math.round( weatherData.main.feels_like )
              : Math.round( ctoF( weatherData.main.feels_like ) )}
            °{systemUsed == "metric" ? "C" : "F"}
          </p>

          <div className="mobile switchBox">
            <p
              className={`switch ${ systemUsed == "metric" ? "textGradient" : "black" }`}
              onClick={changeSystem}
            >
              °C
            </p>
            <p
              className={`switch ${ systemUsed == "metric" ? "black" : "textGradient" }`}
              onClick={changeSystem}
            >
              °F
            </p>
          </div>
        </div>

        <div className="statsWrapper relative">
          <div className="titleAndSearch text-center sm:text-left">
            <h2 className="font-bold text-2xl mb-5 mt-8 sm:mt-5 block w-full">
              {
                weekday[
                new Date(
                  convertTime( weatherData.dt, weatherData.timezone ).input
                ).getUTCDay()
                ]
              }
              ,{" "}
              {timeToAMPM(
                convertTime( weatherData.dt, weatherData.timezone )[ 0 ]
              ).split( ":" )[ 0 ]}
              :00{" "}
              {isPM( convertTime( weatherData.dt, weatherData.timezone )[ 0 ] )}
            </h2>
          </div>

          <input
            type="text"
            className="focus:outline-none searchInput mobile w-full text-right"
            placeholder="Search a city..."
            value={input}
            onFocus={( e ) =>
            {
              e.target.value = "";
              e.target.placeholder = "";
            }}
            onChange={( e ) => { setInput( e.target.value ) }}
            onBlur={( e ) => { e.target.placeholder = "Search a city..."; }}
            onKeyDown={( e ) =>
            {
              enterKeydown( e );
              e.target.placeholder = "Search a city...";
            }}
          />

          <Metrics data={weatherData} systemUsed={systemUsed} />
          <div className="desktop switchBox">
            <p
              className={`switch ${ systemUsed == "metric" ? "textGradient" : "black" }`}
              onClick={changeSystem}
            >
              °C
            </p>
            <p
              className={`switch ${ systemUsed == "metric" ? "black" : "textGradient" }`}
              onClick={changeSystem}
            >
              °F
            </p>
          </div>
        </div>
      </div>
    </div>

  ) : weatherData && weatherData.message ? (
    <div className="errScr">
      <div>
        <h1 style={{ marginBottom: "30px" }}>City not found, try again!</h1>
        <input
          type="text"
          className="searchInput"
          onFocus={( e ) => ( e.target.value = "" )}
          onChange={( e ) => setInput( e.target.value )}
          onKeyDown={( e ) => enterKeydown( e )}
        />
      </div>
    </div>
  ) : (
    <div className="errScr">
      <img src="/loader.svg" />
    </div>
  );
}

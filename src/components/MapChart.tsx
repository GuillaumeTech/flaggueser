import React, { memo, useMemo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import flag from "country-code-emoji";
const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-50m.json";

const MapChart = ({ setTooltipContent }: { setTooltipContent: Function }) => {
  const [geoData, setGeoData] = useState<any>();
  const [status, setStatus] = useState<any>();

  const [availableCountries, setAvailableCountries] = useState<Array<string>>([
    "",
  ]);
  const [currentCountry, setCurrentCountry] = useState<string>();

  function getRandomFlag() {
    const countryCode =
      availableCountries[Math.floor(Math.random() * availableCountries.length)];
    setCurrentCountry(countryCode.toLowerCase());
  }

  useEffect(() => {
    async function fetchGeoData() {
      const res = await fetch(geoUrl);
      const data = await res.json();
      setGeoData(data);
    }
    fetchGeoData();
  }, []);

  useEffect(() => {
    if (geoData) {
      const geometries = geoData.objects["ne_50m_admin_0_countries"].geometries;
      const ISO2countriesCodes = geometries.map(
        (geo: any) => geo.properties.ISO_A2
      );
      const uniq = [...new Set<string>(ISO2countriesCodes)];
      setAvailableCountries(uniq);
    }
  }, [geoData]);

  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 150 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME } = geo.properties;
                    // console.log(geo.properties);
                    setTooltipContent(NAME);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  onClick={() => {
                    const { ISO_A2 } = geo.properties;
                    console.log(ISO_A2.toLowerCase());
                    console.log(currentCountry);

                    if (ISO_A2.toLowerCase() === currentCountry) {
                      setStatus("YAY");
                      getRandomFlag();
                    } else {
                      setStatus("EHNON");
                    }
                  }}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none",
                    },
                    hover: {
                      fill: "#57C",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <button onClick={getRandomFlag}>Get random flag</button>
      <img
        src={`https://flagcdn.com/w1280/${currentCountry}.png`}
        srcSet={`https://flagcdn.com/w2560/${currentCountry}.png 2x`}
        width="200"
      />
      <div>Status {status}</div>
    </>
  );
};

export default memo(MapChart);

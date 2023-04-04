import React from "react";
import styled from "styled-components";
import {useState, useEffect} from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 50px 100px;
  margin-bottom: 150px;
`;
const GoogleMap = styled.div`
  display: flex;
  gap: 50px;
  width: 100%;
  margin-top: 60px;
`;

const Map = styled.div`
  height: 550px;
  width: 1280px;
  border: 20px solid #bdb0a4;
`;

declare const window: Window & {
  google: any;
};

let cachedScripts: string[] = [];
function useScript(src: string) {
  // Keeping track of script loaded and error state

  const [state, setState] = useState({
    loaded: false,
    error: false,
  });

  useEffect(
    () => {
      // If cachedScripts array already includes src that means another instance ...
      // ... of this hook already loaded this script, so no need to load again.
      if (cachedScripts.includes(src)) {
        setState({
          loaded: true,

          error: false,
        });
      } else {
        cachedScripts.push(src);
        // Create script
        let script = document.createElement("script");
        script.src = src;
        script.async = true;
        // Script event listener callbacks for load and error
        const onScriptLoad = () => {
          setState({
            loaded: true,
            error: false,
          });
        };

        const onScriptError = () => {
          // Remove from cachedScripts we can try loading again
          const index = cachedScripts.indexOf(src);
          if (index >= 0) cachedScripts.splice(index, 1);
          script.remove();
          setState({
            loaded: true,
            error: true,
          });
        };
        script.addEventListener("load", onScriptLoad);
        script.addEventListener("error", onScriptError);
        // Add script to document body
        document.body.appendChild(script);
        // Remove event listeners on cleanup
        return () => {
          script.removeEventListener("load", onScriptLoad);
          script.removeEventListener("error", onScriptError);
        };
      }
    },
    [src] // Only re-run effect if script src changes
  );
  return [state.loaded, state.error];
}

function BarMap() {
  const [loaded] = useScript(
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJMxLEPP0PzG_jdJtBCusb90JAw_SK06c&&libraries=places&callback=initMap"
  );
  const [map, setDataMap] = useState();

  useEffect(() => {
    if (loaded) {
      const myLatLng = [
        {lat: 25.030553536720603, lng: 121.55142011571756},
        {lat: 25.03062126392793, lng: 121.55145444019128},
        {lat: 25.030809884752056, lng: 121.55141012632296},
        {lat: 25.030680091245774, lng: 121.55130707081523},
      ];

      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 20,
        center: myLatLng[0],
      });

      const icons = {
        red: {
          url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png",
          scaledSize: new window.google.maps.Size(50, 50),
        },
        blue: {
          url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
          scaledSize: new window.google.maps.Size(50, 50),
        },
        green: {
          url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png",
          scaledSize: new window.google.maps.Size(50, 50),
        },
      };
      myLatLng.forEach((location, index) => {
        const marker = new window.google.maps.Marker({
          position: location,
          map,
          icon: icons[
            index % 3 === 0 ? "red" : index % 3 === 1 ? "blue" : "green"
          ],
        });
      });
      setDataMap(map);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Wrapper>
      <GoogleMap>
        <Map id="map" />
      </GoogleMap>
    </Wrapper>
  );
}
export default BarMap;

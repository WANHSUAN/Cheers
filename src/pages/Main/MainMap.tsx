// OPEN
import {collection, getDocs} from "firebase/firestore";
import {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {db} from "../../App";
import "./styles.css";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 200px 200px 50px;
`;

const GoogleMap = styled.div`
  display: flex;
  width: 100%;
`;

const Map = styled.div`
  height: 500px;
  width: 1000px;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #d9d9d980;
  border: 2px solid #ffffff7c;
`;

const ButtonSection = styled.div`
  gap: 5px;
  margin-right: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const CategoryButton = styled.button<CategoryButtonProps>`
  width: 100px;
  height: 30px;
  color: ${(props) => (props.selected ? "#D19B18" : "#fff")};
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #000;
  border-radius: 5px;
  text-align: right;
  font-size: 1.5rem;

  &:hover,
  &:focus,
  &:active {
    color: #d19b18;
    transform: translateX(-10px);
    transition: ease 0.5s;
    cursor: pointer;
  }
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

interface CategoryButtonProps {
  selected: boolean;
}
interface LatLng {
  lat: number;
  lng: number;
}
interface IBar {
  id: string;
  address: string;
  type: string;
  name: string;
  tel: string;
  barId: string;
  opening_time: {opening_date: string; opening_hours: string};
  img: string;
}

export interface IMainProps {}

const MainMap: React.FC<IMainProps> = (props: IMainProps) => {
  const [latLngArr, setLatLngArr] = useState<LatLng[]>([]);
  const [bars, setBars] = useState<IBar[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 新增 isLoading 狀態
  const [filteredBars, setFilteredBars] = useState(bars);
  const [buttonType, setButtonType] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      const barsCollectionRef = collection(db, "bars");
      const data = await getDocs(barsCollectionRef);
      const barsData = data.docs.map((doc) => ({
        ...(doc.data() as IBar),
        id: doc.id,
      }));
      setBars(barsData);

      let filteredBars;
      switch (buttonType) {
        case "afternoon":
          filteredBars = barsData.filter((bar) =>
            bar.type.includes("afternoon")
          );
          break;
        case "night":
          filteredBars = barsData.filter((bar) => bar.type.includes("night"));
          break;
        case "alone":
          filteredBars = barsData.filter((bar) => bar.type.includes("alone"));
          break;
        case "together":
          filteredBars = barsData.filter((bar) =>
            bar.type.includes("together")
          );
          break;
        case "classic":
          filteredBars = barsData.filter((bar) => bar.type.includes("classic"));
          break;
        case "special":
          filteredBars = barsData.filter((bar) => bar.type.includes("special"));
          break;
        case "simple":
          filteredBars = barsData.filter((bar) => bar.type.includes("simple"));
          break;
        case "vision":
          filteredBars = barsData.filter((bar) => bar.type.includes("vision"));
          break;
        case "couple":
          filteredBars = barsData.filter((bar) => bar.type.includes("couple"));
          break;
        case "friend":
          filteredBars = barsData.filter((bar) => bar.type.includes("friend"));
          break;
        default:
          filteredBars = barsData;
          break;
      }
      setFilteredBars(filteredBars);

      const address = filteredBars.map((bar) => bar.address);
      const latLngPromises = address.map((address) => fetchData(address));
      const latLngArr = await Promise.all(latLngPromises);
      setLatLngArr(latLngArr);
      setIsLoading(false); // 資料加載完成後設定 isLoading 為 false
    };

    fetchAllData();
  }, [buttonType]);

  if (isLoading) {
    // 若仍在資料加載中，回傳 null
    return null;
  }
  if (latLngArr.length === 0) {
    return null;
  }

  return (
    <Address latLng={latLngArr} bars={bars} setButtonType={setButtonType} />
  );
};

async function fetchData(address: string) {
  const apiKey = "AIzaSyDJMxLEPP0PzG_jdJtBCusb90JAw_SK06c";
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
  );
  const data = await response.json();
  const {lat, lng} = data.results[0].geometry.location;
  return {lat, lng};
}
interface IAddressProps {
  latLng: LatLng[];
  bars: IBar[];
  setButtonType: (param1: string) => void; // 修正參數名後面的括號和回傳值類型
}

function Address(props: IAddressProps) {
  const [map, setDataMap] = useState();
  const [selectedButton, setSelectedButton] = useState(null);

  const [loaded] = useScript(
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJMxLEPP0PzG_jdJtBCusb90JAw_SK06c&&libraries=places&callback=initMap"
  );

  function selectedMap() {
    const myLatLng = props.latLng;

    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: myLatLng[3],
      mapTypeId: "terrain",
      mapTypeControl: false,
      streetViewControl: false,
      rotateControl: false,
    });

    const infoWindow = new window.google.maps.InfoWindow();

    const locationButton = document.createElement("button");
    locationButton.textContent = "Current Location";
    locationButton.classList.add("custom-map-control-button");

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("Your location");
            infoWindow.open(map);
            map.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter()!);
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter()!);
      }
    });

    function handleLocationError(
      browserHasGeolocation: boolean,
      infoWindow: google.maps.InfoWindow,
      pos: google.maps.LatLng
    ) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    }

    // const icons = {
    //   url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png",
    //   scaledSize: new window.google.maps.Size(50, 50)
    // };

    map.setOptions({
      styles: [
        {elementType: "geometry", stylers: [{color: "#242f3e"}]},
        {elementType: "labels.text.stroke", stylers: [{color: "#242f3e"}]},
        {elementType: "labels.text.fill", stylers: [{color: "#746855"}]},
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{color: "#d59563"}],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{color: "#d59563"}],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{color: "#263c3f"}],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{color: "#6b9a76"}],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{color: "#38414e"}],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{color: "#212a37"}],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{color: "#9ca5b3"}],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{color: "#746855"}],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{color: "#1f2835"}],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{color: "#f3d19c"}],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{color: "#2f3948"}],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{color: "#d59563"}],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{color: "#17263c"}],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{color: "#515c6d"}],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{color: "#17263c"}],
        },
      ],
    });
    myLatLng.forEach((location, index) => {
      // barType.map((bar: string) => console.log(bar));
      const marker = new window.google.maps.Marker({
        position: location,
        map,
        // icon: icons,
      });
      // 綁定 click 事件
      marker.addListener("click", () => {
        const barAddress = props.bars[index].address; // 從 props 中取得 bars 數據
        const barName = props.bars[index].name;
        const barTel = props.bars[index].tel;
        const barLink = props.bars[index].barId;
        const barDate = props.bars[index].opening_time.opening_date;
        const barHours = props.bars[index].opening_time.opening_hours;
        const barImg = props.bars[index].img[1];

        // 設定 info window 的內容
        infoWindow.setContent(`
        <div class="infowindow">
          <h2>${barName}</h2>  <br />
          <img src="${barImg}" />
          <p>${barDate} ${barHours}</p> <br />
          <p>${barAddress}</p> <br />
          <p>${barTel}</p> <br />
          <a href="/bars/${barLink}">&#128279;</i></a>
          </div>
        `);
        // 開啟 info window
        infoWindow.open(map, marker);
      });
    });

    setDataMap(map);
  }

  useEffect(() => {
    if (loaded) {
      selectedMap();
    }
  }, [loaded, props.latLng]);

  if (!loaded) {
    return null;
  }

  const handleButtonClick = (buttonId: any) => {
    setSelectedButton(buttonId);
  };

  return (
    <Wrapper>
      <ButtonSection>
        <CategoryButton
          selected={selectedButton === 1}
          onClick={() => {
            props.setButtonType("");
            handleButtonClick(1);
          }}
        >
          #All Bars
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 2}
          onClick={() => {
            props.setButtonType("afternoon");
            handleButtonClick(2);
          }}
        >
          #Afternoon
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 3}
          onClick={() => {
            props.setButtonType("night");
            handleButtonClick(3);
          }}
        >
          #night
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 4}
          onClick={() => {
            props.setButtonType("alone");
            handleButtonClick(4);
          }}
        >
          #alone
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 5}
          onClick={() => {
            props.setButtonType("together");
            handleButtonClick(5);
          }}
        >
          #together
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 6}
          onClick={() => {
            props.setButtonType("classic");
            handleButtonClick(6);
          }}
        >
          #classic
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 7}
          onClick={() => {
            props.setButtonType("special");
            handleButtonClick(7);
          }}
        >
          #special
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 8}
          onClick={() => {
            props.setButtonType("simple");
            handleButtonClick(8);
          }}
        >
          #simple
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 9}
          onClick={() => {
            props.setButtonType("vision");
            handleButtonClick(9);
          }}
        >
          #vision
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 10}
          onClick={() => {
            props.setButtonType("couple");
            handleButtonClick(10);
          }}
        >
          #couple
        </CategoryButton>
        <CategoryButton
          selected={selectedButton === 11}
          onClick={() => {
            props.setButtonType("friend");
            handleButtonClick(11);
          }}
        >
          #friend
        </CategoryButton>
      </ButtonSection>
      <GoogleMap>
        <Map id="map" />
      </GoogleMap>
    </Wrapper>
  );
}

export default MainMap;

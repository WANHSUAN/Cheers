import {collection, getDocs} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {db} from "../../utils/firebase";
import Liquor from "../Main/Liquor.png";
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

const CategoryButton = styled.button<ICategoryButtonProps>`
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
const useScript = (src: string) => {
  const [state, setState] = useState({
    loaded: false,
    error: false,
  });

  useEffect(() => {
    if (cachedScripts.includes(src)) {
      setState({
        loaded: true,

        error: false,
      });
    } else {
      cachedScripts.push(src);
      let script = document.createElement("script");
      script.src = src;
      script.async = true;
      const onScriptLoad = () => {
        setState({
          loaded: true,
          error: false,
        });
      };

      const onScriptError = () => {
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
      document.body.appendChild(script);
      return () => {
        script.removeEventListener("load", onScriptLoad);
        script.removeEventListener("error", onScriptError);
      };
    }
  }, [src]);
  return [state.loaded, state.error];
};

interface ICategoryButtonProps {
  selected: boolean;
}
interface ILatLng {
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

interface IFilterConditions {
  [key: string]: string;
}

export interface IMainProps {}

const MainMap: React.FC<IMainProps> = (props: IMainProps) => {
  const [latLngArr, setLatLngArr] = useState<ILatLng[]>([]);
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

      const filterConditions: IFilterConditions = {
        afternoon: "afternoon",
        night: "night",
        alone: "alone",
        together: "together",
        classic: "classic",
        special: "special",
        simple: "simple",
        vision: "vision",
        couple: "couple",
        friend: "friend",
      };

      const filteredBars =
        buttonType in filterConditions
          ? barsData.filter((bar) =>
              bar.type.includes(filterConditions[buttonType])
            )
          : barsData;

      setFilteredBars(filteredBars);

      const address = filteredBars.map((bar) => bar.address);
      const latLngPromises = address.map((address) => fetchData(address));
      const latLngArr = await Promise.all(latLngPromises);
      setLatLngArr(latLngArr);
      setIsLoading(false);
    };

    fetchAllData();
  }, [buttonType]);

  if (isLoading) {
    return null;
  }
  if (latLngArr.length === 0) {
    return null;
  }

  return (
    <Address latLng={latLngArr} bars={bars} setButtonType={setButtonType} />
  );
};

const fetchData = async (address: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  const {lat, lng} = data.results[0].geometry.location;
  return {lat, lng};
};
interface IAddressProps {
  latLng: ILatLng[];
  bars: IBar[];
  setButtonType: (param1: string) => void;
}

const Address = (props: IAddressProps) => {
  const [map, setDataMap] = useState();
  const [selectedButton, setSelectedButton] = useState(null);

  const [loaded] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&&libraries=places`
  );

  const selectedMap = () => {
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
        handleLocationError(false, infoWindow, map.getCenter()!);
      }
    });

    const handleLocationError = (
      browserHasGeolocation: boolean,
      infoWindow: google.maps.InfoWindow,
      pos: google.maps.LatLng
    ) => {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    };

    const icons = {
      url: Liquor,
      scaledSize: new window.google.maps.Size(40, 40),
    };

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
      const marker = new window.google.maps.Marker({
        position: location,
        map,
        icon: icons,
      });

      marker.addListener("click", () => {
        const barAddress = props.bars[index].address;
        const barName = props.bars[index].name;
        const barTel = props.bars[index].tel;
        const barLink = props.bars[index].barId;
        const barDate = props.bars[index].opening_time.opening_date;
        const barHours = props.bars[index].opening_time.opening_hours;
        const barImg = props.bars[index].img[1];
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
        infoWindow.open(map, marker);
      });
    });

    setDataMap(map);
  };

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

  const categories = [
    {label: "#All Bars", type: ""},
    {label: "#Afternoon", type: "afternoon"},
    {label: "#Night", type: "night"},
    {label: "#Alone", type: "alone"},
    {label: "#Together", type: "together"},
    {label: "#Classic", type: "classic"},
    {label: "#Special", type: "special"},
    {label: "#Simple", type: "simple"},
    {label: "#Vision", type: "vision"},
    {label: "#Couple", type: "couple"},
    {label: "#Friend", type: "friend"},
  ];

  return (
    <Wrapper>
      <ButtonSection>
        {categories.map((category, index) => (
          <CategoryButton
            key={index}
            selected={selectedButton === index + 1}
            onClick={() => {
              props.setButtonType(category.type);
              handleButtonClick(index + 1);
            }}
          >
            {category.label}
          </CategoryButton>
        ))}
      </ButtonSection>
      <GoogleMap>
        <Map id="map" />
      </GoogleMap>
    </Wrapper>
  );
};

export default MainMap;

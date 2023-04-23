import React from "react";
import styled from "styled-components";
import {useState, useEffect} from "react";
import {db} from "../../App";
import {collection, getDocs} from "firebase/firestore";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px 200px 100px;
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
  border: 2px solid #fff;
`;

const ButtonSection = styled.div`
  gap: 5px;
  margin-right: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const CategoryButton = styled.button`
  width: 100px;
  height: 30px;
  color: #fff;
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #000;
  border-radius: 5px;
  text-align: right;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: #d19b18;
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
  const [loaded] = useScript(
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJMxLEPP0PzG_jdJtBCusb90JAw_SK06c&&libraries=places&callback=initMap"
  );
  function selectedMap() {
    const myLatLng = props.latLng;

    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: myLatLng[3],
    });

    const infoWindow = new window.google.maps.InfoWindow();
    // const icons = {
    //   url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png",
    //   scaledSize: new window.google.maps.Size(50, 50)
    // };

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
        // 設定 info window 的內容
        infoWindow.setContent(`
          Bar Name: ${barName}  <br />
          Address: ${barAddress} <br />
          Tel: ${barTel}
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

  return (
    <Wrapper>
      <ButtonSection>
        <CategoryButton onClick={() => props.setButtonType("")}>
          #All Bars
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("afternoon")}>
          #Afternoon
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("night")}>
          #night
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("alone")}>
          #alone
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("together")}>
          #together
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("classic")}>
          #classic
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("special")}>
          #special
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("simple")}>
          #simple
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("vision")}>
          #vision
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("couple")}>
          #couple
        </CategoryButton>
        <CategoryButton onClick={() => props.setButtonType("friend")}>
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

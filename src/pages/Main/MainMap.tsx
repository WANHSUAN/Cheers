import React from "react";
// import styled from "styled-components";
// import {useState, useEffect} from "react";
// import {db} from "../../App";
// import {collection, getDocs} from "firebase/firestore";

// const Wrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   margin: 50px 100px;
// `;
// const GoogleMap = styled.div`
//   display: flex;
//   width: 100%;
// `;

// const Map = styled.div`
//   height: 550px;
//   width: 1280px;
//   border: 10px solid beige;
//   margin-bottom: 10px;
// `;

// const ButtonSection = styled.div`
//   gap: 5px;
// `;

// const CategoryButton = styled.button`
//   width: 70px;
//   height: 30px;
//   background-color: #8daeed;
//   border: 1px solid #000;
//   border-radius: 5px;
// `;

// declare const window: Window & {
//   google: any;
// };

// let cachedScripts: string[] = [];
// function useScript(src: string) {
//   // Keeping track of script loaded and error state

//   const [state, setState] = useState({
//     loaded: false,
//     error: false,
//   });

//   useEffect(
//     () => {
//       // If cachedScripts array already includes src that means another instance ...
//       // ... of this hook already loaded this script, so no need to load again.
//       if (cachedScripts.includes(src)) {
//         setState({
//           loaded: true,

//           error: false,
//         });
//       } else {
//         cachedScripts.push(src);
//         // Create script
//         let script = document.createElement("script");
//         script.src = src;
//         script.async = true;
//         // Script event listener callbacks for load and error
//         const onScriptLoad = () => {
//           setState({
//             loaded: true,
//             error: false,
//           });
//         };

//         const onScriptError = () => {
//           // Remove from cachedScripts we can try loading again
//           const index = cachedScripts.indexOf(src);
//           if (index >= 0) cachedScripts.splice(index, 1);
//           script.remove();
//           setState({
//             loaded: true,
//             error: true,
//           });
//         };
//         script.addEventListener("load", onScriptLoad);
//         script.addEventListener("error", onScriptError);
//         // Add script to document body
//         document.body.appendChild(script);
//         // Remove event listeners on cleanup
//         return () => {
//           script.removeEventListener("load", onScriptLoad);
//           script.removeEventListener("error", onScriptError);
//         };
//       }
//     },
//     [src] // Only re-run effect if script src changes
//   );
//   return [state.loaded, state.error];
// }
// interface LatLng {
//   lat: number;
//   lng: number;
// }

// interface IBarTypes {
//   type: [];
// }
// interface IBar {
//   id: string;
//   address: string;
//   type: string;
// }

// interface IHashTags {
//   bars: [];
//   colorCode: string;
//   type: string;
// }

// export interface IMainProps {}

// const MainMap: React.FC<IMainProps> = (props: IMainProps) => {
//   const [latLngArr, setLatLngArr] = useState<LatLng[]>([]);
//   const [bars, setBars] = useState<IBar[]>([]);
//   const [isLoading, setIsLoading] = useState(true); // 新增 isLoading 狀態
//   const [barTypes, setBarTypes] = useState<string[]>([]); // 新增 IBarTypes 狀態
//   const [hashtags, setHashtags] = useState<IHashTags[]>([]);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       const barsCollectionRef = collection(db, "bars");
//       const hashtagsCollectionRef = collection(db, "hashtags");
//       const data = await getDocs(barsCollectionRef);
//       const hashtag = await getDocs(hashtagsCollectionRef);
//       const barsData = data.docs.map((doc) => ({
//         ...(doc.data() as IBar),
//         id: doc.id,
//       })); //
//       const hashtagsData = hashtag.docs.map((doc) => ({
//         ...(doc.data() as IBar),
//         bars: doc.data().bars || [], // 確保包含 bars 屬性，如果沒有則預設為空陣列
//         colorCode: doc.data().colorCode || "", // 確保包含 colorCode 屬性，如果沒有則預設為空字串
//         type: doc.data().type || "", // 確保包含 type 屬性，如果沒有則預設為空字串
//         id: doc.id,
//       }));
//       setBars(barsData);
//       setHashtags(hashtagsData);
//       hashtagsData.forEach((data) => setHashtags(data.type));
//       console.log(hashtags);

//       const address = barsData.map((bar) => bar.address);
//       const latLngPromises = address.map((address) => fetchData(address));
//       const latLngArr = await Promise.all(latLngPromises);

//       setLatLngArr(latLngArr);
//       setIsLoading(false); // 資料加載完成後設定 isLoading 為 false
//     };

//     fetchAllData();
//   }, []);

//   if (isLoading) {
//     // 若仍在資料加載中，回傳 null
//     return null;
//   }
//   if (latLngArr.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       <Address latLng={latLngArr} bars={bars} barTypes={barTypes} />
//     </>
//   );
// };

// async function fetchData(address: string) {
//   const apiKey = "AIzaSyDJMxLEPP0PzG_jdJtBCusb90JAw_SK06c";
//   const response = await fetch(
//     `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
//   );
//   const data = await response.json();
//   const {lat, lng} = data.results[0].geometry.location;
//   return {lat, lng};
// }
// interface IAddressProps {
//   latLng: LatLng[];
//   barTypes: IBarTypes[];
//   bars: [];
// }

// function Address(props: IAddressProps) {
//   const [map, setDataMap] = useState();
//   const [loaded] = useScript(
//     "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJMxLEPP0PzG_jdJtBCusb90JAw_SK06c&&libraries=places&callback=initMap"
//   );
//   function selectedMap() {
//     const myLatLng = props.latLng;

//     const map = new window.google.maps.Map(document.getElementById("map"), {
//       zoom: 15,
//       center: myLatLng[3],
//     });

//     const infoWindow = new window.google.maps.InfoWindow();
//     // const icons = {
//     //   url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png",
//     //   scaledSize: new window.google.maps.Size(50, 50)
//     // };

//     myLatLng.forEach((location, index) => {
//       // barType.map((bar: string) => console.log(bar));
//       const marker = new window.google.maps.Marker({
//         position: location,
//         map,
//         // icon: icons,
//       });
//       // 綁定 click 事件
//       marker.addListener("click", () => {
//         const barAddress = props.bars[index].address; // 從 props 中取得 bars 數據
//         const barName = props.bars[index].name;
//         const barTel = props.bars[index].tel;
//         // 設定 info window 的內容
//         infoWindow.setContent(`
//           Bar Name: ${barName}  <br />
//           Address: ${barAddress} <br />
//           Tel: ${barTel}
//         `);
//         // 開啟 info window
//         infoWindow.open(map, marker);
//       });
//     });

//     setDataMap(map);
//   }

//   useEffect(() => {
//     if (loaded) {
//       selectedMap();
//     }
//   }, [loaded, props.latLng]);

//   if (!loaded) {
//     return null;
//   }

//   function handleAllBarsClick() {
//     return;
//   }

//   return (
//     <Wrapper>
//       <GoogleMap>
//         <Map id="map" />
//       </GoogleMap>
//       <ButtonSection>
//         <CategoryButton onClick={handleAllBarsClick}>All Bars</CategoryButton>
//         <CategoryButton>Afternoon</CategoryButton>
//         <CategoryButton>night</CategoryButton>
//         <CategoryButton>alone</CategoryButton>
//         <CategoryButton>together</CategoryButton>
//         <CategoryButton>classic</CategoryButton>
//         <CategoryButton>special</CategoryButton>
//         <CategoryButton>simple</CategoryButton>
//         <CategoryButton>vision</CategoryButton>
//         <CategoryButton>couple</CategoryButton>
//         <CategoryButton>friend</CategoryButton>
//       </ButtonSection>
//     </Wrapper>
//   );
// }

// export default MainMap;

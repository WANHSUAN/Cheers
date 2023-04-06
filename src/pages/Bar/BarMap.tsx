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
//   margin-bottom: 150px;
// `;
// const GoogleMap = styled.div`
//   display: flex;
//   width: 100%;
// `;

// const Map = styled.div`
//   height: 550px;
//   width: 1280px;
//   border: 10px solid beige;
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
// interface IBar {
//   address: string;
// }

// export interface IMainProps {}

// const BarMap: React.FC<IMainProps> = (props: IMainProps) => {
//   const [bars, setBars] = useState<IBar[] | null>(null);
//   const [address, setAddress] = useState<string>("");
//   const barsCollectionRef = collection(db, "bars");

//   useEffect(() => {
//     const getBars = async () => {
//       const data = await getDocs(barsCollectionRef);
//       setBars(data.docs.map((doc) => ({...(doc.data() as IBar), id: doc.id})));
//     };

//     getBars();
//   }, []);

//   useEffect(() => {
//     if (bars !== null && bars.length > 0) {
//       setAddress(bars[0].address);
//     }
//   }, [bars]);

//   return <AddressToLatLng address={address} />;
// };
// interface IAddressToLatLngProps {
//   address: string;
// }
// function AddressToLatLng(props: IAddressToLatLngProps) {
//   const [latLng, setLatLng] = useState<LatLng>({lat: 0, lng: 0});

//   useEffect(() => {
//     async function fetchData() {
//       const apiKey = "AIzaSyDJMxLEPP0PzG_jdJtBCusb90JAw_SK06c";
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${props.address}&key=${apiKey}`
//       );
//       const data = await response.json();
//       const {lat, lng} = data.results[0].geometry.location;
//       setLatLng({lat, lng});
//     }
//     if (props.address !== "") {
//       fetchData();
//     }
//   }, [props.address]);

//   // console.log(latLng.lat, latLng.lng);
//   return <Address latLng={latLng} />;
// }

// interface IAddressProps {
//   latLng: {};
// }

// function Address(props: IAddressProps) {
//   const [map, setDataMap] = useState();
//   const [loaded] = useScript(
//     "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJMxLEPP0PzG_jdJtBCusb90JAw_SK06c&&libraries=places&callback=initMap"
//   );
//   function selectedMap() {
//     const myLatLng = [props.latLng];

//     const map = new window.google.maps.Map(document.getElementById("map"), {
//       zoom: 20,
//       center: myLatLng[0],
//     });

//     const icons = {
//       url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/library_maps.png",
//       scaledSize: new window.google.maps.Size(50, 50),
//     };

//     myLatLng.forEach((location, index) => {
//       const marker = new window.google.maps.Marker({
//         position: location,
//         map,
//         icon: icons,
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

//   return (
//     <Wrapper>
//       <GoogleMap>
//         <Map id="map" />
//       </GoogleMap>
//     </Wrapper>
//   );
// }

// export default BarMap;
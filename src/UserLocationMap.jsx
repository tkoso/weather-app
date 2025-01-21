import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

const UserLocationMap = () => {
    const [userLocation, setUserLocation] = useState([51.505, -0.09]);
    const [locationFound, setLocationFound] = useState(false);


    useEffect(() => {
        if (navigator.geolocation) { // part of web api
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
                setLocationFound(true);
            },
            (error) => {
                console.log("Error getting geolocation", error);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    const CenterOnUser = () => {
        const map = useMap();
        useEffect(() => {
            if (locationFound) {
                map.setView(userLocation, 13); // zoom level 13
            }
        // adding map to dependency array as it can potentially for instance re-render suddenly
        }, [map, userLocation, locationFound]); 

        return null;
    }

    return (
        <MapContainer center={userLocation} zoom={13} style={{ height: "100vh", width: "100%"}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                    OpenStreetMap</a> contributors'
            />
            <CenterOnUser />
        </MapContainer>
    );
}

export default UserLocationMap;
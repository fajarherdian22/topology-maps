import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "./styles.css";
import routerDashed from "../../../assets/icon/dashed-router.png";

function Legend() {
  const map = useMap();
  console.log("Test");
  
  
  useEffect(() => {
    const legend = L.control({ position: "bottomleft" });
    
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = "<center><h4>Marker</h4></center>";
      
      div.innerHTML += `
        <div>
          <i class="icon" style="
            width: 30px; 
            height: 20px; 
            display: inline-block; 
            background-image: url(${routerDashed}); 
            background-size: contain; 
            background-repeat: no-repeat;
          ">
          </i>
          <span> Router </span>
        </div>
      `;
      
      
      return div;
    };

    legend.addTo(map);
    
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}

export default Legend;

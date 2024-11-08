import towerIcon from '../../../assets/icon/tower.svg';
import towerRed from '../../../assets/icon/tower red.svg';
import towerBlue from '../../../assets/icon/tower blue.svg';
import towerorange from '../../../assets/icon/tower orange.svg';
import towergreen from '../../../assets/icon/tower green.svg';
import routerIcon from '../../../assets/icon/router1.png';
import repeaterIcon from '../../../assets/icon/repeater.svg';
import L from 'leaflet';


const icons = (iconType) => {
    if (iconType === "site") {
        return L.icon({
            iconUrl: towerIcon,
            iconSize: [20, 30],
        });
    }
    else if (iconType === "black") {
        return L.icon({
            iconUrl: towerIcon,
            iconSize: [20, 30],
        });
    } else if (iconType === "red") {
        return L.icon({
            iconUrl: towerRed,
            iconSize: [20, 30],
        });
    } else if (iconType === "blue") {
        return L.icon({
            iconUrl: towerBlue,
            iconSize: [20, 30],
        });
    } else if (iconType === "green") {
        return L.icon({
            iconUrl: towergreen,
            iconSize: [20, 30],
        });
    } else if (iconType === "orange") {
        return L.icon({
            iconUrl: towerorange,
            iconSize: [20, 30],
        });
    }
    else if (iconType === "router") {
        return L.icon({
            iconUrl: routerIcon,
            iconSize: [45, 32],
        });
    } else if (iconType === "repeater") {
        return L.icon({
            iconUrl: repeaterIcon,
            iconSize: [42, 32],
        });
    } else {
        console.warn("Unknown icon type:", iconType);
        return null;
    }
};

export default icons
export function calculateKPI(kpi, data) {
    if (kpi === "Util") {
        if (data >= 90) {
            return "red";
        } else if (data < 90 && data >= 80) {
            return "orange";
        } else if (data < 80 && data >= 70) {
            return "#3D2C8D";
        } else if (data < 70 && data >= 50) {
            return "blue";
        } else if (data < 50) {
            return "green";
        } else {
            return "black";
        }
    } else if (kpi === "Traffic") {
        if (data >= 1000) {
            return "green";
        } else if (data < 1000 && data >= 625) {
            return "blue";
        } else if (data < 625 && data >= 375) {
            return "orange";
        } else if (data < 375) {
            return "red";
        }
        return "black";
    }
};

export function categoryKpi(color) {
    if (color === "red")  {
        return "Bad"
    } else if (color === "orange")  {
        return "Poor"
    } else if (color === "blue")  {
        return "Fair"
    } else if (color === "green")  {
        return "Good"
    } else if (color === "black")  {
        return "No Data"
    }
}

export function categoryLink(color) {
    if (color === "red")  {
        return "Critical High"
    } else if (color === "orange")  {
        return "High"
    } else if (color === "#3D2C8D")  {
        return "Medium High"
    } else if (color === "blue")  {
        return "Medium"
    } else if (color === "green")  {
        return "Low"
    } else if (color === "black")  {
        return "No Data"
    }
}

export function calculateCenter(data) {
    const validData = data.filter(coord => coord.longitude && coord.latitude);
    if (validData.length > 0) {
        const avgLat = validData.reduce((sum, coord) => sum + coord.latitude, 0) / validData.length;
        const avgLon = validData.reduce((sum, coord) => sum + coord.longitude, 0) / validData.length;
        return [avgLat, avgLon];
    }
    return [-7.3411, 108.2186];
};
// 地図表示領域(MapLibre)
import React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MapView.css";

// MapLibreのMapオブジェクト
let map: maplibregl.Map;

// MapViewコンポーネント
export default function MapView() {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!map) {
      if (!mapContainer.current) return;
      // 地図の作成
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: "./kokudochiriin_wmts_blank.json", // 地図のスタイル(国土地理院地図のMapboxVectorTileを指定)
        center: [139.753, 35.6844], // 初期緯度経度
        zoom: 7, // 初期ズーム値
        minZoom: 4, // 最小ズーム値
        maxZoom: 16, // 最大ズーム値
      });
      map.addControl(new maplibregl.NavigationControl({}), "top-right"); // ズーム・回転コントロールの表示
      map.addControl(new maplibregl.ScaleControl({}), "bottom-left"); // スケール値の表示
    }
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}

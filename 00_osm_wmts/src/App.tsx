import React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

// MapLibreのMapオブジェクト
let map: maplibregl.Map;

// Appコンポーネント
export default function App() {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  // 初期化
  React.useEffect(() => {
    if (!map) {
      if (!mapContainer.current) return;
      // 地図の作成
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: "./osm_wmts.json", // Style URL
        center: [139.753, 35.6844], // 初期緯度経度
        zoom: 14, // 初期ズーム値
        minZoom: 1, // 最小ズーム値
        maxZoom: 17, // 最大ズーム値
      });
      map.addControl(new maplibregl.NavigationControl({}), "top-right"); // ズーム・回転コントロールの表示
      map.addControl(new maplibregl.ScaleControl({}), "bottom-left"); // スケール値の表示
      map.showTileBoundaries = true; // タイル境界線の表示
    }
  });

  return <div ref={mapContainer} className="map" />;
}

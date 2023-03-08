import maplibregl, { MapLibreEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React from "react";
import "./App.css";

// MapLibreのMapオブジェクト
let map: maplibregl.Map;
// Markerを格納する配列
let markers: maplibregl.Marker[] = [];

// Appコンポーネント
export default function App() {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  // 削除
  const deleteButtonClick = () => {
    if (markers.length === 0) return;
    markers[markers.length - 1].remove();
    markers.pop();
  };
  // 初期化
  React.useEffect(() => {
    if (!map) {
      if (!mapContainer.current) return;
      // 地図の作成
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://demotiles.maplibre.org/style.json", // style URL
        center: [139.753, 35.6844], // 初期緯度経度
        zoom: 16, // 初期ズーム値
        minZoom: 4, // 最小ズーム値
        maxZoom: 20, // 最大ズーム値
      });
      map.addControl(new maplibregl.NavigationControl({}), "top-right"); // ズーム・回転コントロールの表示
      map.addControl(new maplibregl.ScaleControl({}), "bottom-left"); // スケール値の表示
      map.showTileBoundaries = true; // タイル境界線の表示
      // 地図上のクリックした地点にマーカーを追加
      map.on("click", (e) => {
        const [x, y] = e.lngLat.toArray();
        console.log([x, y]);
        let marker = new maplibregl.Marker({ color: "#FF0000" })
          .setLngLat([x, y])
          .addTo(map);
        markers.push(marker);
      });
    }
  });

  return (
    <>
      <button className="button" onClick={deleteButtonClick}>
        Delete Marker
      </button>
      <div ref={mapContainer} className="map" />
    </>
  );
}

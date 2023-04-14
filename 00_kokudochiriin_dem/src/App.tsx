// 地図表示領域(MapLibre)
import React from "react";
import maplibregl from "maplibre-gl";
import { useGsiTerrainSource } from "maplibre-gl-gsi-terrain";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

// MapLibreのMapオブジェクト
let map: maplibregl.Map;

// Appコンポーネント
export default function App() {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!map) {
      if (!mapContainer.current) return;
      // 地図の作成
      const gsiTerrainSource = useGsiTerrainSource(maplibregl.addProtocol);
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            gsi: {
              type: "raster",
              tiles: [
                "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
              ],
              attribution: "地理院タイル",
            },
            terrain: gsiTerrainSource,
          },
          layers: [
            {
              id: "gsi",
              type: "raster",
              source: "gsi",
            },
          ],
          terrain: {
            source: "terrain",
            exaggeration: 1.2,
          },
        },
        center: [138.73, 35.355], // 初期緯度経度
        zoom: 13, // 初期ズーム値
        minZoom: 4, // 最小ズーム値
        maxZoom: 16, // 最大ズーム値
        pitch: 60, // 初期ピッチ値
        minPitch: 0, // 最小ピッチ値
        maxPitch: 85, // 最大ピッチ値
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

import maplibregl from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "maplibre-gl/dist/maplibre-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import React from "react";
import "./App.css";
import drawPolygonStyle from "./draw_polygon_style.json";

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
        style:
          "https://gsi-cyberjapan.github.io/gsivectortile-mapbox-gl-js/std.json", // 地図のスタイル(国土地理院地図のMapboxVectorTileを指定)
        center: [139.753, 35.6844], // 初期緯度経度
        zoom: 7, // 初期ズーム値
        minZoom: 4, // 最小ズーム値
        maxZoom: 16, // 最大ズーム値
      });
      map.addControl(new maplibregl.NavigationControl({}), "top-right"); // ズーム・回転コントロールの表示
      map.addControl(new maplibregl.ScaleControl({}), "bottom-left"); // スケール値の表示
      map.showTileBoundaries = true; // タイル境界線の表示
      // ポリゴンの描画UIを追加
      let draw = new MapboxDraw({
        displayControlsDefault: false,
        styles: drawPolygonStyle,
        controls: {
          polygon: true,
          trash: true,
          line_string: true,
          point: true,
        },
      });
      // @ts-ignore
      map.addControl(draw);
    }
  });

  return <div ref={mapContainer} className="map" />;
}

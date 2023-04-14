// 地図表示領域(MapLibre)
import React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

// 国土地理院のDEMをTerrainのRGB値に変換する関数
const gsiDEM2TerrainRGB = (r: number, g: number, b: number): number[] => {
  let height = r * 655.36 + g * 2.56 + b * 0.01;
  if (r === 128 && g === 0 && b === 0) {
    height = 0;
  } else if (r >= 128) {
    height -= 167772.16;
  }
  height += 100000;
  height *= 10;
  const tB = (height / 256 - Math.floor(height / 256)) * 256;
  const tG =
    (Math.floor(height / 256) / 256 -
      Math.floor(Math.floor(height / 256) / 256)) *
    256;
  const tR =
    (Math.floor(Math.floor(height / 256) / 256) / 256 -
      Math.floor(Math.floor(Math.floor(height / 256) / 256) / 256)) *
    256;
  return [tR, tG, tB];
};

// MapLibreのMapオブジェクト
let map: maplibregl.Map;

// Appコンポーネント
export default function App() {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!map) {
      if (!mapContainer.current) return;
      // 地図の作成
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: "./kokudochiriin_wmts_ortho.json",
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
      // 国土地理院DEMをTerrainに変換して追加
      maplibregl.addProtocol("gsidem", (params, callback) => {
        const image = new Image();
        image.crossOrigin = "";
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext("2d");
          if (!context) return;
          context.drawImage(image, 0, 0);
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          for (let i = 0; i < imageData.data.length / 4; i++) {
            const tRGB = gsiDEM2TerrainRGB(
              imageData.data[i * 4],
              imageData.data[i * 4 + 1],
              imageData.data[i * 4 + 2]
            );
            imageData.data[i * 4] = tRGB[0];
            imageData.data[i * 4 + 1] = tRGB[1];
            imageData.data[i * 4 + 2] = tRGB[2];
          }
          context.putImageData(imageData, 0, 0);
          canvas.toBlob((blob) => {
            if (blob)
              blob.arrayBuffer().then((arr) => callback(null, arr, null, null));
            // ここで返すデータは、画像のArrayBuffer()でなければならない
          });
        };
        image.src = params.url.replace("gsidem://", "");
        return { cancel: () => {} };
      });
    }
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}

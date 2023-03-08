import TopBar from "./components/TopBar";
import MapView from "./components/MapView";
import "./App.css";

// Appコンポーネント
export default function App() {
  return (
    <div className="App">
      {/* トップバー */}
      <TopBar />
      {/* 地図表示領域(MapLibre) */}
      <MapView />
    </div>
  );
}

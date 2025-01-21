import './App.css'
import UserLocationMap from './UserLocationMap'

function App() {
  return (
    <>
      <div>
        <h1>Leaflet map centered @ user's geolocation</h1>
        <UserLocationMap />
      </div>
    </>
  );
}

export default App

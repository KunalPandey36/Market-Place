import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedPage from "./components/ProtectedPage";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import Profile  from "./pages/Profile/index"
import Admin from "./pages/Admin";
import Productinfo from "./pages/Productinfo";
// import { loadersSlice } from "./redux/loadersSlice"; 

function App() {
  const {loading} = useSelector(state => state.loaders);
  return (
    <div>
      { loading && <Spinner />}
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<ProtectedPage><Home /></ProtectedPage>} />
            <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
            <Route path="/admin" element={<ProtectedPage><Admin /></ProtectedPage>} />
            <Route path="/product/:id" element={<ProtectedPage><Productinfo /></ProtectedPage>} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>

      
    </div>
  );
}

export default App;

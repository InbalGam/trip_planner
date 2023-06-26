import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import Root from './Components/Root';
import TripsList from './Components/TripsList';
import TripScheduler from "./Components/TripScheduler";
import Login from './Components/Login';

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={ <Root /> } >
      <Route exact path="/" element={<Navigate to="/trips" />} />
      <Route path='login' element={ <Login/> } />
      <Route path='trips' element={ <TripsList/> } />
      <Route path='trips/:tripId' element={ <TripScheduler/> } />
    </Route>
  ));

  return (
    <div className="App">
      <header className="App_header" >
        
      </header>
      <body className="App_body" >
        <RouterProvider router={ router } />
      </body>
    </div>
  );
}

export default App;

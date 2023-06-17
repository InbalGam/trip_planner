import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Navigation from './Components/Navigation';
import TripsList from './Components/TripsList';

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={ <Navigation /> } />
  ));

  return (
    <div className="App">
      <header className="App_header" >
        
      </header>
      <body className="App_body" >
        <RouterProvider router={ router } />
        <TripsList />
      </body>
    </div>
  );
}

export default App;

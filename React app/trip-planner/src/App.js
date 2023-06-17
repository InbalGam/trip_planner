import './App.css';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' /> //element={ } />
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

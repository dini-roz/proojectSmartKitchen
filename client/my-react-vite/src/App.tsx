

import Providers from "./app/Providers"

function App() {
  return (
    <>
   <Providers></Providers>
    </>

    // <>
    //   <Provider store={store}>
    //     <BrowserRouter> {/* עטוף את התוכן שלך ב-BrowserRouter */}
    //       <Routes>
    //     <Route path="/" element={<LandingPage />} />
    //     { <Route path="/login" element={<Login />} /> }
    //       <Route path="/signup" element={<Signup />} />
    //     {/* ... שאר ה-Routes שלך ... */}
    //   </Routes>
    //     </BrowserRouter>
    //   </Provider>
    // </>
  )
}

export default App;

 

 


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import PrebillLanding from "./components/PrebillLanding";
import PrebillDetail from "./components/PrebillDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PrebillLanding />} />
          <Route path="prebills" element={<PrebillLanding />} />
          <Route path="prebills/:invoiceId" element={<PrebillDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

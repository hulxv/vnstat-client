import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Contexts from "@Context/index";
import PageLayout from "@Layout/PageLayout";
import ErrorBoundary from "@Components/ErrorBoundary";

import Month from "@Pages/Month";
import Day from "@Pages/Day";
import Week from "@Pages/Week";
import Year from "@Pages/Year";
import CustomInterval from "@Pages/custom/index";

function App() {
  return (
    <ChakraProvider>
      <ErrorBoundary label="the application">
        <Contexts>
          <BrowserRouter>
            <PageLayout>
              <Routes>
                <Route path="/" element={<Month />} />
                <Route path="/day" element={<Day />} />
                <Route path="/week" element={<Week />} />
                <Route path="/year" element={<Year />} />
                <Route path="/custom/:from/:to" element={<CustomInterval />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageLayout>
          </BrowserRouter>
        </Contexts>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default App;

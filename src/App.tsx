import HomePage from "./components/pages/HomePage"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"


function App() {

  return (
    <>
    <Analytics />
    <SpeedInsights />
      <div>
        <HomePage />
      </div>
    </>
  )
}

export default App

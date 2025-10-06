import { useEffect, useState } from "react"

function Greeting() {
    const [greeting, setGreeting] = useState("");
    
    useEffect( () => {
          const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon ");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good Evening ");
      } else {
        setGreeting("Good Night ");
      }
    };

    updateGreeting(); // run once on mount

    const interval = setInterval(updateGreeting, 60 * 1000); // update every minute
    return () => clearInterval(interval);
    } )
  return (
    <div>
       <div className="text-white font-semiboldbold flex justify-center mt-28 text-4xl">
          <h1>
            { greeting }
          </h1>
        </div> 
      
    </div>
  )
}

export default Greeting

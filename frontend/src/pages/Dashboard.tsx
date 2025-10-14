import Greeting from "../components/Greeting"
import UserProfile from "../components/UserInfo"
import AddButton from "../components/AddButton"

function Dashboard() {
  return (
    <div>
      <Greeting></Greeting>
      <UserProfile></UserProfile>
      <div>
        <AddButton></AddButton>
      </div>
    </div>
  )
}

export default Dashboard

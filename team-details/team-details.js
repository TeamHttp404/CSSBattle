import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  child,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyCWcEHfggOEh_WshntMiwJ2HJNB0VVM-cg",
  authDomain: "cssbattle-sjce.firebaseapp.com",
  databaseURL: "https://cssbattle-sjce-default-rtdb.firebaseio.com",
  projectId: "cssbattle-sjce",
  storageBucket: "cssbattle-sjce.appspot.com",
  messagingSenderId: "484371487421",
  appId: "1:484371487421:web:90eb5aacea0d09dd9835d4",
  measurementId: "G-772RZVDCV3",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let allUsersData;
const dbRef = ref(getDatabase());
const fetchData = async () => {
  await get(child(dbRef, `battle/`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        allUsersData = data;
      } else {
        console.log("No data available");
        allUsersData = {};
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
const parseData = (data) => {
  return {
    Easy: data.answers["1"].accuracy,
    Medium: data.answers["2"].accuracy,
    Hard: data.answers["3"].accuracy,
    "Security Key": data.securityKey,
    "Logged Out Count": data.loggedOutCount,
  };
};
fetchData().then(() => {
  console.table(allUsersData);
  const users = Object.keys(allUsersData);
  const columns = [
    "Easy",
    "Medium",
    "Hard",
    "Security Key",
    "Logged Out Count",
  ];
  const table = document.getElementById("alluserstable");
  let bodyOfTable = "";
  let head = "<thead><tr><th>Team Name</th>";
  columns.forEach((col) => {
    head += "<th>" + col + "</th>";
  });
  head += "</tr></thead>";
  bodyOfTable += head;
  users.forEach((user) => {
    let txt = "<tr><th>" + user + "</th>";
    let userData = parseData(allUsersData[user]);
    columns.forEach((col) => {
      txt += "<td>" + userData[col] + "</td>";
    });
    txt += "</tr>";
    bodyOfTable += txt;
  });
  if (users.length === 0) {
    let txt = "<tr>";
    columns.push("");
    columns.forEach((col) => {
      txt += "<td>---</td>";
    });
    txt += "</tr>";
    bodyOfTable += txt;
  }
  table.innerHTML = bodyOfTable;
});

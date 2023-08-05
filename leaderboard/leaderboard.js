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
let allUsersData, timingData;

const fetchData = async () => {
  const dbRef = ref(getDatabase());
  await get(child(dbRef, `battle/`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        allUsersData = data;
      } else {
        allUsersData = {};
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  await get(child(dbRef, `timing/`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        timingData = data;
        console.log(data);
      } else {
        allUsersData = {};
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
const calculateScore = (accuracy1, accuracy2, accuracy3) => {
  let score1 = accuracy1 === "---" ? 0 : +accuracy1.split("%")[0];
  let score2 = accuracy2 === "---" ? 0 : +accuracy2.split("%")[0];
  let score3 = accuracy3 === "---" ? 0 : +accuracy3.split("%")[0];
  return score1 + score2 + score3;
};
const parseData = (data, timing) => {
  const accuracy1 = data.answers["1"].accuracy;
  const accuracy2 = data.answers["2"].accuracy;
  const accuracy3 = data.answers["3"].accuracy;
  return {
    "Team Name": data.teamName,
    Easy: accuracy1,
    Medium: accuracy2,
    Hard: accuracy3,
    "Easy TOS": timing["1"] ? timing["1"].timeOfSubmission : "---",
    "Medium TOS": timing["2"] ? timing["2"].timeOfSubmission : "---",
    "Hard TOS": timing["3"] ? timing["3"].timeOfSubmission : "---",
    "Overall Score": calculateScore(accuracy1, accuracy2, accuracy3),
  };
};
fetchData().then(() => {
  let users = Object.keys(allUsersData);
  const convertedUserData = {};
  users.forEach((user, index) => {
    convertedUserData[user] = parseData(
      allUsersData[user],
      timingData[user] === undefined ? {} : timingData[user]
    );
  });
  const columns = [
    "Position",
    "Team Name",
    "Easy",
    "Medium",
    "Hard",
    "Easy TOS",
    "Medium TOS",
    "Hard TOS",
    "Overall Score",
  ];
  const table = document.getElementById("alluserstable");
  let bodyOfTable = "";
  let head = "<thead><tr>";
  columns.forEach((col) => {
    head += "<th>" + col + "</th>";
  });
  head += "</tr></thead>";
  bodyOfTable += head;
  users.sort(
    (a, b) =>
      convertedUserData[b]["Overall Score"] -
      convertedUserData[a]["Overall Score"]
  );
  users.forEach((user, index) => {
    let txt = "<tr>";
    convertedUserData[user].Position = index + 1;
    let userData = convertedUserData[user];
    columns.forEach((col) => {
      txt +=
        "<td class='" +
        col.split(" ").join("-") +
        "''>" +
        userData[col] +
        "</td>";
    });
    txt += "</tr>";
    bodyOfTable += txt;
  });
  if (users.length === 0) {
    let txt = "<tr>";
    columns.forEach((col) => {
      txt += "<td>---</td>";
    });
    txt += "</tr>";
    bodyOfTable += txt;
  }
  table.innerHTML = bodyOfTable;
});

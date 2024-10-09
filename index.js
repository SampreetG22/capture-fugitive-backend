const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
app.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
});
let citiesData = [
  { name: "Lihas Nagar", distance: 50 },
  { name: "Narmis City", distance: 40 },
  { name: "Nuravgram", distance: 20 },
  { name: "Shekarvati", distance: 30 },
  { name: "Yapkash Nagar", distance: 60 },
];
let vehiclesData = [
  { name: "EV Bike", range: 60, count: 2 },
  { name: "EV Car", range: 100, count: 1 },
  { name: "EV SUV", range: 120, count: 1 },
];
let copAssignments = [
  {
    name: "Lieutenant Sam",
    city: "",
    vehicle: "",
  },
  {
    name: "Officer Swetha Iyer",
    city: "",
    vehicle: "",
  },
  {
    name: "Deputy Chief Lee Phuko",
    city: "",
    vehicle: "",
  },
];

const clearAllFields = () => {
  citiesData = [
    { name: "Lihas Nagar", distance: 50 },
    { name: "Narmis City", distance: 40 },
    { name: "Nuravgram", distance: 20 },
    { name: "Shekarvati", distance: 30 },
    { name: "Yapkash Nagar", distance: 60 },
  ];
  vehiclesData = [
    { name: "EV Bike", range: 60, count: 2 },
    { name: "EV Car", range: 100, count: 1 },
    { name: "EV SUV", range: 120, count: 1 },
  ];
  copAssignments = [
    {
      name: "Lieutenant Sam",
      city: "",
      vehicle: "",
    },
    {
      name: "Officer Swetha Iyer",
      city: "",
      vehicle: "",
    },
    {
      name: "Deputy Chief Lee Phuko",
      city: "",
      vehicle: "",
    },
  ];
};

//ROUTES
app.get("/getCitiesAndVehicles", (request, response) => {
  try {
    const copProps = {
      cities: citiesData,
      vehicles: vehiclesData,
      copAssignments: copAssignments,
    };
    response.json(copProps);
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("Internal Server Error");
  }
});
app.post("/addCityAndVehicle", (request, response) => {
  try {
    const { name, city, vehicle } = request.body;
    const copAssignment = copAssignments.find((assign) => assign.name === name);
    if (!copAssignment) {
      return response.status(404).send("COP not found");
    }

    // Check if there are available vehicles left and decrease the count of available vehicles if so
    const assignedVehicle = vehiclesData.find((v) => v.name === vehicle);
    if (assignedVehicle.count > 0) {
      assignedVehicle.count--;
    }
    if (!assignedVehicle) {
      return response.status(404).send("Vehicle not found");
    }

    // If a different vehicle is selected, increase the count of the previous vehicle
    const previousVehicle = copAssignment.vehicle;
    if (previousVehicle !== vehicle && previousVehicle) {
      const prevVehicleData = vehiclesData.find(
        (v) => v.name === previousVehicle
      );
      if (prevVehicleData) {
        prevVehicleData.count++;
      }
    }

    // Update the COP assignment
    copAssignment.city = city;
    copAssignment.vehicle = vehicle;

    response.status(200).send({ name: name, city: city, vehicle: vehicle });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});
app.post("/catchFugitive", (request, response) => {
  const randomNumber = Math.floor(Math.random() * 5);
  const fugitiveCity = citiesData[randomNumber].name;
  try {
    const copsData = request.body;
    const criminalCaptured = copsData.find(
      (each) => each.city === fugitiveCity
    );
    if (criminalCaptured) {
      response.status(200).send({
        cop: criminalCaptured.name,
        vehicle: criminalCaptured.vehicle,
        city: fugitiveCity,
      });
    } else {
      response.status(200).send({
        result: "Oops! Criminal is not hiding in these cities",
        actualPlace: fugitiveCity,
      });
    }
    clearAllFields();
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});

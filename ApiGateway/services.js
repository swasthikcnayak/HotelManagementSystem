// Define routes and corresponding microservices
const services = [
  {
    route: "/auth",
    target: "https://your-deployed-service.herokuapp.com/auth",
  },
  {
    route: "/users",
    target: "https://your-deployed-service.herokuapp.com/users/",
  },
  {
    route: "/chats",
    target: "https://your-deployed-service.herokuapp.com/chats/",
  },
  {
    route: "/payment",
    target: "https://your-deployed-service.herokuapp.com/payment/",
  },
  // Add more services as needed either deployed or locally.
];

exports.services = services;

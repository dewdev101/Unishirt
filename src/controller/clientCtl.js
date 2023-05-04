import Client from "../model/Client.js";

export const createClient = async (req, res) => {
  const client = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    productId: req.body.productId,
  };
  const insertClient = new Client(client);
  await insertClient.save().then((res) => console.log("result", res));
};

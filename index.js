import app from "./src/app.js";
import config from "./src/config/environment.js"

app.listen(config.server.port, ()=>{
  console.log(`Server is running ENV ${config.env} on port ${config.server.port}`);
});
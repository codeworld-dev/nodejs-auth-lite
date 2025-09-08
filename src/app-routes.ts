
import express from 'express';
import verifyToken from './middlewares/verifyToken';
import * as homeRouter from './services/home';
import * as loginservices from './services/login-service';
import * as userservices from './services/user-services';


export default function routes(app: express.Express){

    app.get('/health',homeRouter.healthCheck);
    app.get("/status", (request, response) => {
        const status = {
           "Status": "Running"
        };
     
        response.send(status);
     });

    app.post('/token',loginservices.loginUser);

    app.post('/adduser',userservices.addUser);
    app.get('/getallusers',verifyToken,userservices.getAllUsers);


    
}
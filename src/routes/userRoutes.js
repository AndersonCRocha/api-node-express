const fs = require('fs');
const { join } = require('path');

const filePath = join(__dirname, 'users.json');

const getUsers = () => {

    const data = fs.existsSync(filePath)
                ? fs.readFileSync(filePath) 
                : [];

    try {
        return JSON.parse(data);
    } catch (error){
        return [];
    }

}

const saveUsers = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'));

const validUserId = (id) => {

    const users = getUsers();

    return users.filter(user => user.id === id).length === 0;

}

const userRoute = (app) => {

    app.route('/users/:id?')
        .get((request, response) => {
        
            const users = getUsers();
            const { id } = request.params;

            if(id){
                response.send(users.filter(user => user.id == id));
                return;
            }

            response.send(users);
        
        })
        .post((request, response) => {

            const { id } = request.body;

            if(!validUserId(id)){
                response.status(400).send("User id already registered!");
                return;
            }

            const users = getUsers();
            users.push(request.body);
            saveUsers(users);

            response.status(201).send(request.body);
        
        })
        .put((request, response) => {
            
            const users = getUsers();
            saveUsers(users.map(user => {
                
                const { id } = request.params;
                
                if(!id){
                    response.status(400).send('Param id is missing!')
                }

                if(user.id === id){
                    return {
                        ...user,
                        ...request.body
                    }
                }
                
                return user;

            }))

            response.status(200).send('OK');

        })
        .delete((request, response) => {

            const users = getUsers();
            saveUsers(users.filter(user => user.id !== request.params.id));

            response.status(200).send('OK');

        })

}

module.exports = userRoute;
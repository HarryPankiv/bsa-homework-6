let users = [];

function findUserById(id){
    for(let i = 0; i < users.length; i++){
        if(users[i].id == id){
            return i;
        };
    };
    return -1;
};

module.exports = {
    users: users,
    addUser: (data)=>{
        users.push(data);
    },
    deleteUser: (id)=> {
        let ind = findUserById(id);
        let res = false;
        if(ind != -1){
            res = users[ind];
            users[ind].user_status = 0;
        }
        return res;
    },
    updateStatus: (id)=>{
        let ind = findUserById(id);
        if(ind != -1){
            users[ind].user_status = 2;
        }
    },
    typingChange: (id, val)=>{
        let ind = findUserById(id);
        if(ind != -1){
            users[ind].typing = val;
        }
    }
};
'use strict'

const User = require('./../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('./../services/jwt');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

const _calculateAge = (birth) => {
    let ageDifHs = Date.Now - birth.getTime();
    let ageDate = new Date(ageDifHs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// const home = (req, res) => {
//     res.status(200).send({
//         mesaage: "hello there"
//     });
// };

const removeFilesUploads = (res, file_path, message) => {
    fs.unlink(file_path, (err) => res.status(200).send({message: message}));
};

const saveUser = (req, res) => {
    let params =  req.body;
    let user = new User();

    if(params.name && params.surname && params.nick && 
        params.pswd && params.email && params.birth){
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.birth = params.birth;

        User.findOne({
            $or :[
                {email: user.email.toLowerCase()},
                {nick: user.nick.toLowerCase()}
            ]
        }).exec((err, users) => {
            if(err) return res.status(500).send({message: "Error getting users"});
            if(users && users.length >= 1) {
                return res.status(200).send({message: "The nick or email is unavalible"});
            }
        });

        bcrypt.hash(params.pswd, null, null, (err, hash) => {
            if (err) {
                console.log(err);
            }
            user.pswd = hash;
            user.save((err, userStored) => {
                if(err) return res.status(500).send({message: "Error to save the password"});
                if(userStored) {
                    res.status(200).send({user: userStored});
                } else {
                    res.status(404).send({message: "Failed to register user"});
                }
            })
        });
        
    } else {
        res.status(200).send({
            message: 'Error dude ;c'
        })
    }
};

const loginUser = (req, res) => {
    let params = req.body;

    let email, pswd;
    email = params.email;
    pswd = params.pswd;

    User.findOne({
        email: email
    }, (err, user) => {
        if (err) return res.status(500).send({message: 'Error getting users'});
        if (user) {
            bcrypt.compare(pswd, user.pswd, (err, check) => {
                if (check){
                    if(params.gettoken) {
                        return res.status(200).send({ token: jwt.createToken(user)});
                    } else {
                        user.pswd = undefined;
                        return res.status(200).send(user);
                    }
                } else {
                    return res.status(404).send({message: 'Bad login: Password and Email doesn\'t corresponde'});
                }
            });
        } else {
            return res.status(404).send({message: 'Bad login: Email doesn\'t exists '});
        }
    })
}

const getUser = (req, res) => {
    let userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({message: 'Error in Request'});
        if (!user) return res.status(404).send({message: 'User doesn\'t exists'});
        return res.status(200).send(user);
    });
};

const getUsers = (req, res) => {
    let identity_user_id = req.user.sub;
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    let itemsPerPage = 6;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({message: 'Error in Request'});
        if (!users) return res.status(404).send({message: 'Users doesn\'t exists'});

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    })
};

const updateUser = (req, res) => {
    let userId = req.params.id;
    let update = req.body;

    delete update.pswd;

    if(userId != req.user.sub) {
        return res.status(500).send({message: "Permised denied"});
    }

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if (err) return res.status(404).send({message: 'Error in Request'});
        if(!userUpdated) return res.status(404).send({message: 'Error in Update'});

        return res.status(200).send({user: userUpdated});
    });
};

const uploadImage = (req, res) => {
    let userId = req.params.id;

    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split("\\");
        let file_name = file_split[2];
        let ext_split = file_name.split("\.");
        let file_ext = ext_split[1];

        if(userId != req.user.sub) {
            return removeFilesUploads(res, file_path, "Permised denied");
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
                if (err) return res.status(404).send({message: 'Error in Request'});
                if(!userUpdated) return res.status(404).send({message: 'Error in Update'});
        
                return res.status(200).send({user: userUpdated});
            });
        } else {
            return removeFilesUploads(res, file_path, 'Extension invalidate');
        }
    } else {
        return res.status(200).sent({message: "No file uploaded"});
    }
};

const getImageUser = (req, res) => {
    let image_file = req.params.imageFile;
    let path_file = './../misc/uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.send(200).send({message: 'File doesn\'t exists'});
        }
    });
};

module.exports = {
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageUser
}
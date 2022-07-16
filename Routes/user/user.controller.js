
const { checkRequiredFields, checkRequiredHeaders, checkRequiredQueries, checkUserVerified, checkUserNotVerified } = require('../../MiddleWares/MiddleWares');
const UserController = require('express').Router();
const { UserService } = require('./user.service');
const { isUserAuthenticated } = require('./../../MiddleWares/isUserAuthenticated.js')

UserController.post('/register-user', checkRequiredFields(['username', 'email', 'password']), UserService.RegisterUserService)
UserController.post('/login-user', checkRequiredFields(['username', 'password']), UserService.LoginUserService)
UserController.get('/user-profile', checkRequiredHeaders(['x-user']), isUserAuthenticated,UserService.FetchUserService)
UserController.post('/request-ac-verification', checkRequiredHeaders(['x-user']), isUserAuthenticated, checkUserNotVerified(), UserService.requestAcVerification);
UserController.post('/verify-email/:code', checkRequiredHeaders(['x-user']), isUserAuthenticated, checkUserNotVerified(), UserService.VerifyUserAccount);
UserController.delete('/logout-user', checkRequiredHeaders(['x-user']), isUserAuthenticated, UserService.LogoutUserService)
UserController.get('/check-username/:username', UserService.CheckUsernameService)
UserController.patch('/change-password', checkRequiredHeaders(['x-user']), checkRequiredFields(['oldPassword', 'newPassword']), isUserAuthenticated, UserService.ChangeUserPassword)
UserController.patch('/update-user', checkRequiredHeaders(['x-user']), isUserAuthenticated, UserService.UpdateUserService)

module.exports = UserController;
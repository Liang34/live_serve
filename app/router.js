'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/admin', controller.admin.home.index);

  router.get('/admin/manager/delete/:id', controller.admin.manager.delete);
  router.get('/admin/manager/edit/:id', controller.admin.manager.edit);
  router.get('/admin/manager/create', controller.admin.manager.create);
  router.get('/admin/manager', controller.admin.manager.index);
  router.post('/admin/manager', controller.admin.manager.save);
  router.post('/admin/manager/:id', controller.admin.manager.update);

  router.get('/admin/login', controller.admin.home.login);
  router.post('/admin/loginevent', controller.admin.home.loginevent);
  router.get('/admin/logout', controller.admin.home.logout);
};

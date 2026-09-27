const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');

// Public Navigation API for Client
router.get('/', navigationController.getPublicNavigation);

// Admin Navigation APIs
router.get('/admin', navigationController.getAdminNavigation);
router.post('/', navigationController.createTopLevelPage);
router.put('/reorder', navigationController.reorderNavigationPages);
router.put('/:id', navigationController.updateTopLevelPage);
router.delete('/:id', navigationController.deleteTopLevelPage);

// Child Items Navigation APIs (Unlimited children under a top-level page)
router.post('/:pageId/children', navigationController.createChildItem);
router.put('/:pageId/children/:childId', navigationController.updateChildItem);
router.delete('/:pageId/children/:childId', navigationController.deleteChildItem);

module.exports = router;
